/**
 * useProLeads - Hook to fetch and manage leads for professionals
 * Connects to the pro_request_matches and project_requests tables in Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useProProfile } from './useProProfile';

export interface ProjectRequest {
  id: string;
  user_id: string | null;
  category_id: string | null;
  zip_code: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
  dynamic_answers: Record<string, any> | null;
  photos: string[] | null;
  status: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  privacy_preference: string | null;
  is_anonymous_submission: boolean;
  contact_info_approved: boolean;
  created_at: string;
}

export interface ProLead {
  id: string;
  request_id: string;
  pro_id: string;
  match_score: number | null;
  match_reason: string | null;
  distance_miles: number | null;
  pro_status: 'pending' | 'viewed' | 'contacted' | 'quoted' | 'won' | 'lost' | 'declined';
  pro_viewed_at: string | null;
  pro_responded_at: string | null;
  quote_amount_cents: number | null;
  quote_description: string | null;
  quote_valid_until: string | null;
  customer_selected: boolean;
  customer_selected_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  project_request?: ProjectRequest;
}

export interface LeadStats {
  total: number;
  pending: number;
  viewed: number;
  contacted: number;
  quoted: number;
  won: number;
  lost: number;
}

export function useProLeads() {
  const { user } = useSupabaseAuth();
  const { profile } = useProProfile();
  const [leads, setLeads] = useState<ProLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leads for the current professional
  const fetchLeads = useCallback(async () => {
    if (!user || !profile) {
      setLeads([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('pro_request_matches')
        .select(`
          *,
          project_request:project_requests(*)
        `)
        .eq('pro_id', profile.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setLeads(data || []);
    } catch (err: any) {
      console.error('Failed to fetch leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  // Mark a lead as viewed
  const markAsViewed = async (leadId: string) => {
    if (!profile) throw new Error('No profile');

    try {
      const { error: updateError } = await supabase
        .from('pro_request_matches')
        .update({
          pro_status: 'viewed',
          pro_viewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .eq('pro_id', profile.id);

      if (updateError) throw updateError;
      await fetchLeads();
    } catch (err: any) {
      console.error('Failed to mark lead as viewed:', err);
      throw err;
    }
  };

  // Send a quote for a lead
  const sendQuote = async (leadId: string, amountCents: number, description: string, validDays: number = 7) => {
    if (!profile) throw new Error('No profile');

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    try {
      const { error: updateError } = await supabase
        .from('pro_request_matches')
        .update({
          pro_status: 'quoted',
          pro_responded_at: new Date().toISOString(),
          quote_amount_cents: amountCents,
          quote_description: description,
          quote_valid_until: validUntil.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .eq('pro_id', profile.id);

      if (updateError) throw updateError;
      await fetchLeads();
    } catch (err: any) {
      console.error('Failed to send quote:', err);
      throw err;
    }
  };

  // Decline a lead
  const declineLead = async (leadId: string) => {
    if (!profile) throw new Error('No profile');

    try {
      const { error: updateError } = await supabase
        .from('pro_request_matches')
        .update({
          pro_status: 'declined',
          pro_responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .eq('pro_id', profile.id);

      if (updateError) throw updateError;
      await fetchLeads();
    } catch (err: any) {
      console.error('Failed to decline lead:', err);
      throw err;
    }
  };

  // Get lead statistics
  const getStats = (): LeadStats => {
    return {
      total: leads.length,
      pending: leads.filter(l => l.pro_status === 'pending').length,
      viewed: leads.filter(l => l.pro_status === 'viewed').length,
      contacted: leads.filter(l => l.pro_status === 'contacted').length,
      quoted: leads.filter(l => l.pro_status === 'quoted').length,
      won: leads.filter(l => l.pro_status === 'won').length,
      lost: leads.filter(l => l.pro_status === 'lost').length,
    };
  };

  // Get recent leads (last 5)
  const getRecentLeads = (limit: number = 5): ProLead[] => {
    return leads.slice(0, limit);
  };

  // Get active leads (pending, viewed, contacted, quoted)
  const getActiveLeads = (): ProLead[] => {
    return leads.filter(l => ['pending', 'viewed', 'contacted', 'quoted'].includes(l.pro_status));
  };

  // Fetch leads on mount and when profile changes
  useEffect(() => {
    if (profile) {
      fetchLeads();
    }
  }, [profile, fetchLeads]);

  // Set up real-time subscription for new leads
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('pro_leads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pro_request_matches',
          filter: `pro_id=eq.${profile.id}`
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, fetchLeads]);

  return {
    leads,
    loading,
    error,
    fetchLeads,
    markAsViewed,
    sendQuote,
    declineLead,
    getStats,
    getRecentLeads,
    getActiveLeads,
  };
}
