/**
 * Stripe Webhook Event Handlers with Supabase Integration
 * 
 * Handles all Stripe webhook events and updates the database accordingly
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase admin client for server-side operations
// Only initialize if credentials are available
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not configured - webhook handlers will not work');
}

/**
 * Handle checkout.session.completed event
 * This fires immediately after successful payment
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log('Checkout session completed:', session.id);
  
  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized');
    return;
  }
  
  try {
    const customerEmail = session.customer_email || session.customer_details?.email;
    const metadata = session.metadata || {};
    const plan = metadata.plan || 'pro';
    const interval = metadata.interval || 'monthly';
    const portalType = metadata.portal_type || 'pros'; // Get portal type from metadata
    
    if (!customerEmail) {
      console.error('No customer email found in checkout session');
      return;
    }

    // Find user by email in auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }

    const user = authUsers.users.find(u => u.email === customerEmail);
    
    if (!user) {
      console.error(`No user found with email: ${customerEmail}`);
      return;
    }

    // Update user profile with subscription details
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_plan: plan,
        portal_type: portalType,
        is_pro: true,
        stripe_customer_id: session.customer as string,
        subscription_expires_at: null, // Will be set by subscription webhook
        pro_since: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      return;
    }

    console.log(`Successfully activated subscription for user ${user.id} (${customerEmail}) - Portal: ${portalType}`);
  } catch (error) {
    console.error('Error in handleCheckoutSessionCompleted:', error);
  }
}

/**
 * Handle subscription created webhook
 */
export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription created:', subscription.id);
  
  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized');
    return;
  }
  
  try {
    const customerId = subscription.customer as string;
    const metadata = subscription.metadata || {};
    const plan = metadata.plan || 'pro';
    const portalType = metadata.portal_type || 'pros';
    
    // Find user by stripe_customer_id
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profileError || !profiles) {
      console.error('No profile found for customer:', customerId);
      return;
    }

    // Update subscription details
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: subscription.status,
        subscription_plan: plan,
        portal_type: portalType,
        is_pro: true,
        subscription_expires_at: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', profiles.user_id);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return;
    }

    console.log(`Subscription created for user ${profiles.user_id} - Portal: ${portalType}`);
  } catch (error) {
    console.error('Error in handleSubscriptionCreated:', error);
  }
}

/**
 * Handle subscription updated webhook
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription updated:', subscription.id);
  
  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized');
    return;
  }
  
  try {
    const customerId = subscription.customer as string;
    
    // Find user by stripe_customer_id
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profileError || !profiles) {
      console.error('No profile found for customer:', customerId);
      return;
    }

    // Update subscription status
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: subscription.status,
        subscription_expires_at: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : null,
        is_pro: subscription.status === 'active' || subscription.status === 'trialing',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', profiles.user_id);

    if (updateError) {
      console.error('Error updating subscription status:', updateError);
      return;
    }

    console.log(`Subscription updated for user ${profiles.user_id}: ${subscription.status}`);
  } catch (error) {
    console.error('Error in handleSubscriptionUpdated:', error);
  }
}

/**
 * Handle subscription deleted webhook
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription deleted:', subscription.id);
  
  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized');
    return;
  }
  
  try {
    const customerId = subscription.customer as string;
    
    // Find user by stripe_customer_id
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profileError || !profiles) {
      console.error('No profile found for customer:', customerId);
      return;
    }

    // Revoke pro access
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'canceled',
        is_pro: false,
        portal_type: 'free', // Revert to free
        subscription_expires_at: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', profiles.user_id);

    if (updateError) {
      console.error('Error revoking subscription:', updateError);
      return;
    }

    console.log(`Subscription canceled for user ${profiles.user_id}`);
  } catch (error) {
    console.error('Error in handleSubscriptionDeleted:', error);
  }
}

/**
 * Handle payment succeeded webhook
 */
export async function handlePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log('Payment succeeded:', invoice.id);
  
  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized');
    return;
  }
  
  try {
    const customerId = invoice.customer as string;
    const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : null;
    
    if (!subscriptionId) {
      console.log('No subscription associated with invoice');
      return;
    }

    // Find user by stripe_customer_id
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profileError || !profiles) {
      console.error('No profile found for customer:', customerId);
      return;
    }

    // Ensure subscription is active
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'active',
        is_pro: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', profiles.user_id);

    if (updateError) {
      console.error('Error updating payment status:', updateError);
      return;
    }

    console.log(`Payment processed for user ${profiles.user_id}`);
  } catch (error) {
    console.error('Error in handlePaymentSucceeded:', error);
  }
}

/**
 * Handle payment failed webhook
 */
export async function handlePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log('Payment failed:', invoice.id);
  
  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized');
    return;
  }
  
  try {
    const customerId = invoice.customer as string;
    
    // Find user by stripe_customer_id
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profileError || !profiles) {
      console.error('No profile found for customer:', customerId);
      return;
    }

    // Mark subscription as past_due (Stripe will handle retries)
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', profiles.user_id);

    if (updateError) {
      console.error('Error updating payment failed status:', updateError);
      return;
    }

    console.log(`Payment failed for user ${profiles.user_id}`);
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error);
  }
}
