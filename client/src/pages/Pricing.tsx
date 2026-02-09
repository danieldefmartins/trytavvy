/**
 * Pricing Page for Tavvy Pros Portal
 * 
 * Displays Pro and Pro+ plans with annual/monthly toggle
 * Integrates with Stripe Checkout for subscriptions
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { trpc } from '../lib/trpc';
import { STRIPE_CONFIG } from '../../../shared/stripe-config';

// Helper to get GHL affiliate ID from cookie or URL
function getAffiliateId(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const urlAmId = urlParams.get('am_id');
  if (urlAmId) {
    localStorage.setItem('tavvy_am_id', urlAmId);
    return urlAmId;
  }
  const storedAmId = localStorage.getItem('tavvy_am_id');
  if (storedAmId) return storedAmId;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'am_id' || name === 'affiliate_id') return value;
  }
  return null;
}

export default function PricingPage() {
  const navigate = useNavigate();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual');
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'proPlus' | null>(null);

  const createCheckout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSelectPlan = async (plan: 'pro' | 'proPlus') => {
    setSelectedPlan(plan);
    
    // Get coupon ID if code is entered
    let couponId: string | undefined;
    if (couponCode.trim()) {
      const couponConfig = STRIPE_CONFIG.products[plan].coupons[billingInterval];
      // Validate coupon code matches expected format
      if (couponCode.toUpperCase().includes('FOUNDING') || couponCode.toUpperCase().includes('OFF')) {
        couponId = couponConfig.id;
      }
    }

    // Get affiliate ID for GHL tracking
    const affiliateId = getAffiliateId() || undefined;

    await createCheckout.mutateAsync({
      plan,
      interval: billingInterval,
      couponId,
      affiliateId,
    });
  };

  const plans = [
    {
      id: 'pro' as const,
      name: 'Pro',
      description: 'Perfect for independent contractors and small teams',
      features: STRIPE_CONFIG.products.pro.features,
      price: STRIPE_CONFIG.products.pro.prices[billingInterval],
      coupon: STRIPE_CONFIG.products.pro.coupons[billingInterval],
      popular: false,
    },
    {
      id: 'proPlus' as const,
      name: 'Pro+',
      description: 'Advanced features for growing businesses',
      features: STRIPE_CONFIG.products.proPlus.features,
      price: STRIPE_CONFIG.products.proPlus.prices[billingInterval],
      coupon: STRIPE_CONFIG.products.proPlus.coupons[billingInterval],
      popular: true,
    },
  ];

  const savingsPercentage = billingInterval === 'annual' ? 17 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Get matched with verified contractors and manage your projects with confidence
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-lg font-medium ${billingInterval === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={billingInterval === 'annual'}
              onCheckedChange={(checked) => setBillingInterval(checked ? 'annual' : 'monthly')}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className={`text-lg font-medium ${billingInterval === 'annual' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Annual
            </span>
            {billingInterval === 'annual' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Save {savingsPercentage}%
              </Badge>
            )}
          </div>

          {/* Coupon Code Toggle */}
          <button
            onClick={() => setShowCouponInput(!showCouponInput)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            {showCouponInput ? 'Hide' : 'Have a'} coupon code?
          </button>

          {showCouponInput && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Founding member discounts available!
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? 'border-blue-500 shadow-xl scale-105'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${(plan.price.amount / 100).toFixed(2)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{plan.price.interval === 'month' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  
                  {/* Show discounted price if coupon code is entered */}
                  {couponCode.trim() && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        🎉 Founding Member Price: {plan.coupon.finalPrice}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {plan.coupon.name} for {plan.coupon.duration}
                      </p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={createCheckout.isLoading && selectedPlan === plan.id}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                  size="lg"
                >
                  {createCheckout.isLoading && selectedPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Questions? Contact us at{' '}
            <a href="mailto:support@tavvy.com" className="text-blue-600 hover:underline">
              support@tavvy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
