/**
 * useProProfile - Hook to fetch and manage professional profile data
 * Connects to the pro_providers table in Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export interface ProProfile {
  id: string;
  user_id: string;
  provider_type: 'pro' | 'realtor';
  business_name: string | null;
  first_name: string | null;
  last_name: string | null;
  slug: string | null;
  description: string | null;
  bio: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  profile_photo_url: string | null;
  cover_photo_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  service_areas: string[] | null;
  specialties: string[] | null;
  trade_category: string | null;
  years_in_business: number | null;
  years_experience: number | null;
  license_number: string | null;
  is_licensed: boolean;
  is_insured: boolean;
  is_verified: boolean;
  is_active: boolean;
  // Stats
  average_rating: number | null;
  total_reviews: number | null;
  review_count: number | null;
  total_leads: number | null;
  active_leads: number | null;
  response_rate: number | null;
  // Subscription
  subscription_plan: string | null;
  subscription_status: string | null;
  subscription_started_at: string | null;
  subscription_expires_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  // Digital Card
  card_slug: string | null;
  card_enabled: boolean;
  card_theme: string | null;
  card_social_links: Record<string, string> | null;
  card_custom_links: Array<{ title: string; url: string }> | null;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ProProfileStats {
  totalLeads: number;
  activeLeads: number;
  responseRate: number;
  avgRating: number;
  reviewCount: number;
  profileViews: number;
}

export function useProProfile() {
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the professional profile for the current user
  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('pro_providers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setProfile(data);
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new professional profile
  const createProfile = async (data: Partial<ProProfile>) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const { data: newProfile, error: createError } = await supabase
        .from('pro_providers')
        .insert({
          user_id: user.id,
          email: user.email,
          provider_type: data.provider_type || 'pro',
          ...data
        })
        .select()
        .single();

      if (createError) throw createError;
      setProfile(newProfile);
      return newProfile;
    } catch (err: any) {
      console.error('Failed to create profile:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update the professional profile
  const updateProfile = async (updates: Partial<ProProfile>) => {
    if (!user || !profile) throw new Error('No profile to update');

    try {
      const { data: updatedProfile, error: updateError } = await supabase
        .from('pro_providers')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (updateError) throw updateError;
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.message);
      throw err;
    }
  };

  // Get profile completion percentage
  const getProfileCompletion = (): number => {
    if (!profile) return 0;

    const fields = [
      profile.business_name || profile.first_name,
      profile.phone,
      profile.email,
      profile.description || profile.bio,
      profile.address || profile.city,
      profile.service_areas?.length,
      profile.specialties?.length || profile.trade_category,
      profile.profile_photo_url || profile.logo_url,
      profile.years_in_business || profile.years_experience,
      profile.license_number,
    ];

    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  // Get stats from profile
  const getStats = (): ProProfileStats => {
    return {
      totalLeads: profile?.total_leads || 0,
      activeLeads: profile?.active_leads || 0,
      responseRate: profile?.response_rate || 0,
      avgRating: profile?.average_rating || 0,
      reviewCount: profile?.review_count || profile?.total_reviews || 0,
      profileViews: 0, // TODO: Track profile views separately
    };
  };

  // Fetch profile on mount and when user changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    getProfileCompletion,
    getStats,
  };
}
