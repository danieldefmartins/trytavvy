/**
 * Stripe Webhook Handler
 * 
 * Processes Stripe webhook events for subscription lifecycle
 */

import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { verifyWebhookSignature } from './stripe';
import {
  handleCheckoutSessionCompleted,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handlePaymentSucceeded,
  handlePaymentFailed,
} from './stripeWebhookHandlers';

/**
 * Handle incoming Stripe webhooks
 * 
 * This endpoint should be registered in Stripe Dashboard:
 * https://dashboard.stripe.com/webhooks
 * 
 * Events to listen for:
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('Missing Stripe signature or webhook secret');
    return res.status(400).send('Webhook Error: Missing signature or secret');
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = verifyWebhookSignature(
      req.body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  console.log(`Received webhook event: ${event.type}`);

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Webhook handler failed');
  }
}
