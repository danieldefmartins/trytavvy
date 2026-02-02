/**
 * Stripe Configuration for Tavvy Pros Portal
 * 
 * Price IDs, Product IDs, and Coupon codes for subscription management
 */

export const STRIPE_CONFIG = {
  // Stripe API Key (set in environment variables)
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  
  // Products
  products: {
    pro: {
      id: 'prod_TkvJ6rkl8ICp97',
      name: 'Tavvy Pro Membership',
      prices: {
        monthly: {
          id: 'price_1StuJjIeV9jtGwIXHlQNkJav',
          amount: 5999, // $59.99
          interval: 'month',
          displayPrice: '$59.99/month',
        },
        annual: {
          id: 'price_1StuJAIeV9jtGwIXS4bDWgDT',
          amount: 59900, // $599.00
          interval: 'year',
          displayPrice: '$599/year',
        },
      },
      coupons: {
        monthly: {
          id: 'HCArOJ6D',
          name: '$10 Off',
          discount: 1000, // $10.00
          duration: '12 months',
          finalPrice: '$49.99/month',
        },
        annual: {
          id: 'wzF33SQA',
          name: '$400 Off',
          discount: 40000, // $400.00
          duration: 'once',
          finalPrice: '$199/year',
        },
      },
      features: [
        'Unlimited project requests',
        'Verified contractor matching',
        'Real activity signals',
        'Direct messaging',
        'Project management tools',
        'Payment protection',
        'Priority support',
      ],
    },
    proPlus: {
      id: 'prod_TkvJ6rkl8ICp97', // Same product, different tier
      name: 'Tavvy Pro+ Membership',
      prices: {
        monthly: {
          id: 'price_1StuBAIeV9jtGwIXnp3T4PLJ',
          amount: 11999, // $119.99
          interval: 'month',
          displayPrice: '$119.99/month',
        },
        annual: {
          id: 'price_1Stu9bIeV9jtGwIXWSN6axQf',
          amount: 139900, // $1,399.00
          interval: 'year',
          displayPrice: '$1,399/year',
        },
      },
      coupons: {
        monthly: {
          id: 'N831RGNp',
          name: '$50 Off',
          discount: 5000, // $50.00
          duration: '12 months',
          finalPrice: '$69.99/month',
        },
        annual: {
          id: 'Ef0h5xy1',
          name: '$800 Off',
          discount: 80000, // $800.00
          duration: 'once',
          finalPrice: '$599/year',
        },
      },
      features: [
        'Everything in Pro',
        'Advanced analytics',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'White-label options',
        'Premium support (24/7)',
      ],
    },
  },

  // Success/Cancel URLs
  urls: {
    success: '/subscription/success?session_id={CHECKOUT_SESSION_ID}',
    cancel: '/subscription/cancel',
  },
} as const;

export type StripePlan = 'pro' | 'proPlus';
export type StripeBillingInterval = 'monthly' | 'annual';
