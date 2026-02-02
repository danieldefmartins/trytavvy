/**
 * Stripe Service for Tavvy Pros Portal
 * 
 * Handles subscription checkout, webhooks, and customer management
 */

import Stripe from 'stripe';
import { STRIPE_CONFIG } from '../shared/stripe-config';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-01-28.clover',
});

export interface CreateCheckoutSessionParams {
  priceId: string;
  plan: 'pro' | 'proPlus';
  interval: 'monthly' | 'annual';
  couponId?: string;
  customerEmail?: string;
  userId?: string;
  portalType?: 'pros' | 'realtor' | 'onthego';
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create a Stripe Checkout Session for subscription
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<Stripe.Checkout.Session> {
  const {
    priceId,
    plan,
    interval,
    couponId,
    customerEmail,
    userId,
    portalType = 'pros',
    successUrl,
    cancelUrl,
  } = params;

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true, // Allow users to enter promo codes
      billing_address_collection: 'required',
      customer_email: customerEmail,
      metadata: {
        userId: userId || '',
        plan,
        interval,
        portal_type: portalType,
      },
      subscription_data: {
        metadata: {
          userId: userId || '',
          plan,
          interval,
          portal_type: portalType,
        },
      },
    };

    // Apply coupon if provided
    if (couponId) {
      sessionParams.discounts = [{ coupon: couponId }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create a Customer Portal Session for subscription management
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
}

/**
 * Get subscription details by ID
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

/**
 * Get customer details by ID
 */
export async function getCustomer(
  customerId: string
): Promise<Stripe.Customer | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;
    return customer as Stripe.Customer;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    return subscription;
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw error;
  }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
}

/**
 * Handle subscription created webhook
 */
export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription created:', subscription.id);
  // TODO: Update database with subscription details
  // - Save subscription ID, customer ID, status
  // - Grant access to pro features
  // - Send welcome email
}

/**
 * Handle subscription updated webhook
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription updated:', subscription.id);
  // TODO: Update database with subscription changes
  // - Update subscription status
  // - Handle plan changes
  // - Update billing cycle
}

/**
 * Handle subscription deleted webhook
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription deleted:', subscription.id);
  // TODO: Update database and revoke access
  // - Mark subscription as canceled
  // - Revoke pro features
  // - Send cancellation email
}

/**
 * Handle payment succeeded webhook
 */
export async function handlePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log('Payment succeeded:', invoice.id);
  // TODO: Update database with payment details
  // - Record payment
  // - Send receipt email
  // - Extend subscription period
}

/**
 * Handle payment failed webhook
 */
export async function handlePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log('Payment failed:', invoice.id);
  // TODO: Handle failed payment
  // - Send payment failed email
  // - Update subscription status
  // - Notify user to update payment method
}

export { stripe };
