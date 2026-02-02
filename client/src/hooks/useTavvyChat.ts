/**
 * useTavvyChat - Real-Time Messaging Hook for Web
 * Handles messaging between users and professionals (Pros/Realtors)
 * Port of the mobile version for React web applications
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://scasgwrikoqdwlwlwcff.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYXNnd3Jpa29xZHdsd2x3Y2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODUxODEsImV4cCI6MjA4MjU2MTE4MX0.83ARHv2Zj6oJpbojPCIT0ljL8Ze2JqMBztLVueGXXhs'
);

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'customer' | 'pro' | 'consumer' | 'professional';
  content: string;
  created_at: string;
  is_read?: boolean;
}

export interface Conversation {
  id: string;
  pro_id: string;
  user_id: string;
  lead_id?: string;
  project_request_id?: string;
  last_message_at: string;
  user_unread_count: number;
  pro_unread_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  customer_name?: string;
  customer_email?: string;
  project_description?: string;
}

export function useTavvyChat(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getUser();
  }, []);

  // Fetch all conversations for the current user (as a professional)
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      // Fetch conversations where user is the pro
      const { data, error: fetchError } = await supabase
        .from('conversations')
        .select(`
          *,
          project_requests(id, description, customer_name, customer_email)
        `)
        .eq('pro_id', user.id)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (fetchError) throw fetchError;

      // Transform data to include customer info
      const transformedData = (data || []).map((conv: any) => ({
        ...conv,
        customer_name: conv.project_requests?.customer_name || 'Customer',
        customer_email: conv.project_requests?.customer_email,
        project_description: conv.project_requests?.description
      }));

      setConversations(transformedData);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMessages(data || []);

      // Mark messages as read for the pro
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('conversations')
          .update({ pro_unread_count: 0 })
          .eq('id', id)
          .eq('pro_id', user.id);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a new message
  const sendMessage = async (id: string, content: string, senderType: 'customer' | 'pro' = 'pro') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: id,
          sender_id: user.id,
          sender_type: senderType,
          content: content.trim()
        })
        .select()
        .single();

      if (sendError) throw sendError;

      // Update conversation timestamp and unread count
      await supabase
        .from('conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          user_unread_count: supabase.rpc('increment', { row_id: id, column_name: 'user_unread_count' })
        })
        .eq('id', id);

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  // Start a new conversation linked to a lead/project request
  const startConversation = async (
    proId: string, 
    customerId: string, 
    leadId?: string
  ): Promise<string> => {
    try {
      // Check if conversation already exists
      let query = supabase
        .from('conversations')
        .select('id')
        .eq('pro_id', proId)
        .eq('user_id', customerId);

      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data: existing } = await query.maybeSingle();

      if (existing) return existing.id;

      // Create new conversation
      const { data, error: createError } = await supabase
        .from('conversations')
        .insert({
          pro_id: proId,
          user_id: customerId,
          lead_id: leadId,
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      return data.id;
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to start conversation:', err);
      throw err;
    }
  };

  // Subscribe to real-time updates for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Message];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Subscribe to real-time updates for conversations (new messages indicator)
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(`conversations:${currentUserId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        filter: `pro_id=eq.${currentUserId}`
      }, () => {
        // Refresh conversations when there's an update
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchConversations]);

  return {
    messages,
    conversations,
    loading,
    error,
    currentUserId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startConversation
  };
}
