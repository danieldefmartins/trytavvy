/**
 * Stripe Webhook Event Handlers with Supabase Integration
 * 
 * Handles all Stripe webhook events and updates the database accordingly
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { findGHLContactByEmail, addGHLContactTags } from './ghl';

// Go High Level API configuration
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL || '';
const GHL_API_KEY = process.env.GHL_API_KEY || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'e7vdyR8r7Cys9twmOQzp';

/**
 * Report affiliate sale to Go High Level
 * This attributes the Stripe payment to the affiliate who referred the customer
 */
async function reportAffiliateConversion(data: {
  affiliateId: string;
  email: string;
  amount: number;
  currency: string;
  plan: string;
  stripeSessionId: string;
}): Promise<void> {
  try {
    console.log(`Reporting affiliate conversion for affiliate ${data.affiliateId}, email: ${data.email}`);
    
    // Method 1: Use GHL webhook to report the conversion
    if (GHL_WEBHOOK_URL) {
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(GHL_API_KEY && { 'Authorization': `Bearer ${GHL_API_KEY}` }),
        },
        body: JSON.stringify({
          email: data.email,
          event: 'affiliate_sale',
          affiliate_id: data.affiliateId,
          amount: data.amount,
          currency: data.currency,
          plan: data.plan,
          stripe_session_id: data.stripeSessionId,
          source: 'tavvy_pros',
          timestamp: new Date().toISOString(),
          tags: [
            'affiliate_conversion',
            `affiliate_${data.affiliateId}`,
            `plan_${data.plan}`,
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GHL affiliate webhook failed:', response.status, errorText);
      } else {
        console.log('Successfully reported affiliate conversion to GHL for:', data.email);
      }
    }
    
    // Method 2: Use GHL Affiliate Manager API if available
    if (GHL_API_KEY) {
      try {
        const apiResponse = await fetch(
          `https://services.leadconnectorhq.com/affiliate-manager/campaign/${GHL_LOCATION_ID}/manual-sale`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GHL_API_KEY}`,
              'Version': '2021-07-28',
            },
            body: JSON.stringify({
              affiliate_id: data.affiliateId,
              amount: data.amount,
              currency: data.currency,
              email: data.email,
              external_id: data.stripeSessionId,
            }),
          }
        );
        
        if (apiResponse.ok) {
          console.log('Successfully reported sale via GHL Affiliate API');
        } else {
          console.warn('GHL Affiliate API call failed (non-critical):', apiResponse.status);
        }
      } catch (apiErr) {
        console.warn('GHL Affiliate API not available (non-critical):', apiErr);
      }
    }
  } catch (error) {
    console.error('Error reporting affiliate conversion:', error);
    // Don't throw - affiliate tracking failure should not block the payment flow
  }
}

/**
 * Notify the affiliate that their referral converted
 * Looks up the affiliate by their GHL affiliate_id, then adds a 'referral-converted' tag
 * A GHL workflow triggers on this tag and sends the affiliate a congrats email
 */
async function notifyAffiliateOfConversion(data: {
  affiliateId: string;
  customerName: string;
  plan: string;
  amount: number;
}): Promise<void> {
  if (!GHL_API_KEY) {
    console.warn('GHL_API_KEY not configured - cannot notify affiliate of conversion');
    return;
  }

  try {
    console.log(`Notifying affiliate ${data.affiliateId} of referral conversion`);

    // The affiliate_id from GHL's am.js tracking is the GHL contact ID
    // Try to add the 'referral-converted' tag directly to the affiliate contact
    const tagResult = await addGHLContactTags(
      data.affiliateId,
      ['referral-converted', 'active-affiliate'],
      GHL_API_KEY
    );

    if (tagResult.success) {
      console.log(`Successfully tagged affiliate ${data.affiliateId} with 'referral-converted'`);
    } else {
      console.warn(`Failed to tag affiliate ${data.affiliateId}:`, tagResult.error);
      
      // Fallback: Try to find the affiliate by searching contacts with the affiliate tag
      // and matching the affiliate_id in custom fields
      console.log('Tag by contact ID failed, affiliate may use a different ID format');
    }
  } catch (error) {
    console.error('Error notifying affiliate of conversion:', error);
  }
}

/**
 * Send welcome automation to Go High Level
 * This triggers the welcome SMS and email sequence
 */
async function sendToGoHighLevel(data: {
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  plan: string;
  interval: string;
  stripeCustomerId: string;
  userId?: string;
}): Promise<void> {
  if (!GHL_WEBHOOK_URL) {
    console.warn('GHL_WEBHOOK_URL not configured - skipping Go High Level integration');
    return;
  }

  try {
    console.log('Sending welcome automation to Go High Level for:', data.email);
    
    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(GHL_API_KEY && { 'Authorization': `Bearer ${GHL_API_KEY}` }),
      },
      body: JSON.stringify({
        // Contact info
        email: data.email,
        phone: data.phone || '',
        firstName: data.firstName || data.fullName?.split(' ')[0] || '',
        lastName: data.lastName || data.fullName?.split(' ').slice(1).join(' ') || '',
        name: data.fullName || '',
        
        // Subscription info
        plan: data.plan,
        interval: data.interval,
        stripeCustomerId: data.stripeCustomerId,
        
        // Tavvy-specific
        source: 'tavvy_pros',
        event: 'payment_completed',
        userId: data.userId || '',
        timestamp: new Date().toISOString(),
        
        // Tags for GHL automation
        tags: [
          'tavvy_pro',
          `plan_${data.plan}`,
          `billing_${data.interval}`,
          'welcome_sequence'
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Go High Level webhook failed:', response.status, errorText);
    } else {
      console.log('Successfully sent to Go High Level for:', data.email);
    }
  } catch (error) {
    console.error('Error sending to Go High Level:', error);
    // Don't throw - we don't want to fail the webhook if GHL fails
  }
}

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

    // Send welcome automation to Go High Level
    // This triggers the welcome SMS and email sequence
    const customerPhone = session.customer_details?.phone || '';
    const customerName = session.customer_details?.name || user.user_metadata?.full_name || '';
    
    await sendToGoHighLevel({
      email: customerEmail,
      phone: customerPhone,
      fullName: customerName,
      plan: plan,
      interval: interval,
      stripeCustomerId: session.customer as string,
      userId: user.id,
    });

    // Report affiliate conversion if affiliate ID is present in metadata
    const affiliateId = metadata.affiliate_id;
    if (affiliateId) {
      const amountTotal = session.amount_total || 0; // in cents
      await reportAffiliateConversion({
        affiliateId,
        email: customerEmail,
        amount: amountTotal / 100, // Convert cents to dollars
        currency: session.currency || 'usd',
        plan,
        stripeSessionId: session.id,
      });
      console.log(`Affiliate conversion reported for affiliate ${affiliateId}, session ${session.id}`);

      // Tag the affiliate's GHL contact with 'referral-converted' so the GHL workflow sends them a congrats email
      try {
        await notifyAffiliateOfConversion({
          affiliateId,
          customerName: session.customer_details?.name || customerEmail,
          plan,
          amount: (session.amount_total || 0) / 100,
        });
      } catch (notifyErr) {
        console.warn('Failed to notify affiliate of conversion (non-critical):', notifyErr);
      }
    }

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
