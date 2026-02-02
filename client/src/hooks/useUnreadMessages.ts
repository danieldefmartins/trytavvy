/**
 * useUnreadMessages - Hook to track unread message counts for web portals
 * Provides real-time unread message count for notification badges
 * 
 * Install path: client/src/hooks/useUnreadMessages.ts
 */

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (same as useTavvyChat)
const supabase = createClient(
  'https://scasgwrikoqdwlwlwcff.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYXNnd3Jpa29xZHdsd2x3Y2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODUxODEsImV4cCI6MjA4MjU2MTE4MX0.83ARHv2Zj6oJpbojPCIT0ljL8Ze2JqMBztLVueGXXhs'
);

interface UnreadCounts {
  total: number;
  conversations: { [conversationId: string]: number };
}

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({ total: 0, conversations: {} });
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

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setCurrentUserId(session.user.id);
      } else {
        setCurrentUserId(null);
        setUnreadCount(0);
        setUnreadCounts({ total: 0, conversations: {} });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch unread message count for the current user
  const fetchUnreadCount = useCallback(async () => {
    if (!currentUserId) {
      setUnreadCount(0);
      setUnreadCounts({ total: 0, conversations: {} });
      return;
    }

    setLoading(true);
    try {
      // Fetch conversations where user is the pro and has unread messages
      const { data: proConversations, error: proError } = await supabase
        .from('conversations')
        .select('id, pro_unread_count')
        .eq('pro_id', currentUserId)
        .gt('pro_unread_count', 0);

      if (proError) throw proError;

      // Calculate total unread count
      let total = 0;
      const conversationCounts: { [id: string]: number } = {};

      // Add pro unread counts
      (proConversations || []).forEach((conv) => {
        const count = conv.pro_unread_count || 0;
        total += count;
        conversationCounts[conv.id] = count;
      });

      setUnreadCount(total);
      setUnreadCounts({ total, conversations: conversationCounts });
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch unread count:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Fetch unread count when user ID changes
  useEffect(() => {
    if (currentUserId) {
      fetchUnreadCount();
    }
  }, [currentUserId, fetchUnreadCount]);

  // Subscribe to real-time updates for conversations (unread count changes)
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(`unread-messages:${currentUserId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `pro_id=eq.${currentUserId}`
      }, () => {
        // Refresh unread count when conversation is updated
        fetchUnreadCount();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, () => {
        // Refresh when new messages arrive
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchUnreadCount]);

  // Mark messages as read for a conversation
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!currentUserId) return;

    try {
      await supabase
        .from('conversations')
        .update({ pro_unread_count: 0 })
        .eq('id', conversationId)
        .eq('pro_id', currentUserId);

      // Refresh counts
      fetchUnreadCount();
    } catch (err: any) {
      console.error('Failed to mark as read:', err);
    }
  }, [currentUserId, fetchUnreadCount]);

  return {
    unreadCount,
    unreadCounts,
    loading,
    error,
    fetchUnreadCount,
    markAsRead,
  };
}

export default useUnreadMessages;
