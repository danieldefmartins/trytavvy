/**
 * Tavvy Business Landing Page
 * "The Rebellion" Design Theme - Stop Paying for Leads
 * 
 * Integrates with Stripe checkout via Supabase Edge Functions
 */

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, ChevronDown, ChevronUp, Crown } from "lucide-react";

// Helper to get GHL affiliate ID from cookie or URL
function getAffiliateId(): string | null {
  // First check URL params (direct affiliate link click)
  const urlParams = new URLSearchParams(window.location.search);
  const urlAmId = urlParams.get('am_id');
  if (urlAmId) {
    // Store in localStorage as backup
    localStorage.setItem('tavvy_am_id', urlAmId);
    return urlAmId;
  }
  
  // Check localStorage (persisted from earlier visit)
  const storedAmId = localStorage.getItem('tavvy_am_id');
  if (storedAmId) return storedAmId;
  
  // Check GHL affiliate cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'am_id' || name === 'affiliate_id') {
      return value;
    }
  }
  
  return null;
}

// Supabase client for Edge Function calls
const supabase = createClient(
  "https://scasgwrikoqdwlwlwcff.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYXNnd3Jpa29xZHdsd2x3Y2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODUxODEsImV4cCI6MjA4MjU2MTE4MX0.83ARHv2Zj6oJpbojPCIT0ljL8Ze2JqMBztLVueGXXhs"
);

// Business types for scrolling animation
const BUSINESS_TYPES = [
  "Realtors", "Plumbers", "Electricians", "General Contractors", "Handymen",
  "Food Trucks", "Mobile Businesses", "Mobile Groomers", "Kitchen Remodelers",
  "Bathroom Remodelers", "HVAC Technicians", "Landscapers", "Painters",
  "Roofers", "Pool Cleaners", "Pest Control", "Locksmiths", "Movers",
  "Photographers", "Caterers", "DJs", "Event Planners", "Personal Trainers",
  "Tutors", "Auto Mechanics", "Boat Mechanics", "Car Detailers", "Cleaners",
  "Pressure Washers", "Window Cleaners", "Every Professional"
];

// Pricing configuration
const PRICING = {
  yearly: {
    pro: {
      original: 599,
      intro: 199,
      renewal: 599,
      savings: 400,
    },
    proPlus: {
      original: 1399,
      intro: 599,
      renewal: 1399,
      savings: 800,
    }
  },
  monthly: {
    pro: {
      original: 59.99,
      intro: 49.99,
      renewal: 59.99,
      savings: 10,
    },
    proPlus: {
      original: 119.99,
      intro: 69.99,
      renewal: 119.99,
      savings: 50,
    }
  }
};

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const [spotsLeft, setSpotsLeft] = useState(230);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentBusinessType, setCurrentBusinessType] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const counterRef = useRef<NodeJS.Timeout | null>(null);
  const businessTypeRef = useRef<NodeJS.Timeout | null>(null);

  // Business type scrolling animation - faster transitions
  useEffect(() => {
    let speed = 800; // Start faster
    let index = 0;
    
    const animate = () => {
      index++;
      if (index >= BUSINESS_TYPES.length - 1) {
        // Stop at "Every Professional"
        setCurrentBusinessType(BUSINESS_TYPES.length - 1);
        return;
      }
      
      setCurrentBusinessType(index);
      
      // Accelerate faster
      if (index > 5) speed = 600;
      if (index > 10) speed = 400;
      if (index > 15) speed = 250;
      if (index > 20) speed = 150;
      if (index > 25) speed = 100;
      
      businessTypeRef.current = setTimeout(animate, speed);
    };
    
    businessTypeRef.current = setTimeout(animate, speed);
    
    return () => {
      if (businessTypeRef.current) clearTimeout(businessTypeRef.current);
    };
  }, []);

  // Spots counter with persistence
  useEffect(() => {
    const storedSpots = localStorage.getItem('tavvy_promo_spots');
    const lastVisit = localStorage.getItem('tavvy_last_visit');
    const now = Date.now();
    
    let currentSpots: number;
    
    if (storedSpots && lastVisit) {
      const timeSinceLastVisit = now - parseInt(lastVisit);
      const hoursAway = Math.floor(timeSinceLastVisit / (1000 * 60 * 60));
      const decrease = Math.min(Math.max(1, hoursAway * 2 + Math.floor(Math.random() * 3)), 50);
      currentSpots = Math.max(100, Math.min(parseInt(storedSpots) - decrease, 1000));
    } else {
      currentSpots = 230;
    }
    
    setSpotsLeft(currentSpots);
    localStorage.setItem('tavvy_promo_spots', currentSpots.toString());
    localStorage.setItem('tavvy_last_visit', now.toString());
    
    const simulatePurchases = () => {
      const randomInterval = 15000 + Math.random() * 45000;
      
      counterRef.current = setTimeout(() => {
        setSpotsLeft(prev => {
          const newValue = Math.max(100, prev - 1);
          localStorage.setItem('tavvy_promo_spots', newValue.toString());
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
          return newValue;
        });
        simulatePurchases();
      }, randomInterval);
    };
    
    simulatePurchases();
    
    return () => {
      if (counterRef.current) clearTimeout(counterRef.current);
    };
  }, []);

  // Stripe checkout handler
  const handleCheckout = async (plan: 'pro' | 'pro_plus', cycle: 'yearly' | 'monthly') => {
    const planKey = `${plan}_${cycle}`;
    setIsLoading(true);
    setLoadingPlan(planKey);
    
    try {
      // Get affiliate ID for tracking
      const affiliateId = getAffiliateId();
      
      const { data, error } = await supabase.functions.invoke('stripe-create-checkout', {
        body: {
          successUrl: window.location.origin + `/signup?payment=success&plan=${plan}&cycle=${cycle}&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.origin + '/',
          plan: plan,
          cycle: cycle,
          ...(affiliateId && { affiliateId }),
        },
      });

      if (error) {
        console.error('Checkout error:', error);
        alert('Unable to start checkout. Please try again.');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Unable to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingPlan(null);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const proFeatures = [
    "Unlimited lead access in your area",
    "Fair lead distribution - no racing",
    "Fair review system - bad days fade",
    "Direct messaging with customers",
    "Profile & portfolio showcase",
    "No per-lead fees. Ever.",
  ];

  const proPlusFeatures = [
    "Everything in Pro, plus:",
    "Full CRM with Automation (360 For Business)",
    "Up to 200 sponsored searches/month",
    "Free Tavvy Pros Digital Business Cards",
    "Priority customer support",
    "Advanced analytics dashboard",
  ];

  const faqItems = [
    {
      question: "Is $199/year really all I pay?",
      answer: "Yes. $199 for your first year, then $599/year after that. No hidden fees, no per-lead charges, no referral fees. Ever."
    },
    {
      question: "What types of businesses can use Tavvy?",
      answer: "Any service professional! Contractors, realtors, food trucks, mobile groomers, photographers, cleaners, tutors, and more. If you provide a service, Tavvy is for you."
    },
    {
      question: "How is this different from Angi, Thumbtack, or HomeAdvisor?",
      answer: "Those platforms charge you per lead ($50-100+) and sell the same lead to multiple pros. We charge one flat annual fee and send each lead to ONE pro at a time. No bidding wars."
    },
    {
      question: "What do you mean by 'fair review system'?",
      answer: "Reviews fade over time. A 3-star review from 2 years ago shouldn't hurt you as much as one from last month. Your recent work matters more."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. Cancel anytime, no questions asked. We also offer a 30-day money-back guarantee if Tavvy isn't working for you."
    },
    {
      question: "How do customers find me?",
      answer: "Customers search for services in your area through our app and website. Your profile appears based on your service area, ratings, and availability."
    },
  ];

  const currentPricing = PRICING[billingCycle];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Inter',sans-serif]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/images/tavvy-logo-new.png" 
              alt="Tavvy" 
              className="h-10 w-auto"
            />
            <span className="hidden lg:block text-gray-400 text-sm italic border-l border-white/20 pl-3">The savvy way to discover.</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-400 hover:text-white transition-colors">
              FAQ
            </button>
          </nav>
          <Button 
            onClick={() => scrollToSection('pricing')}
            className="bg-[#c8ff00] text-black font-semibold hover:bg-[#b8ef00] px-6"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c8ff00]/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Spot Counter Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-[#c8ff00] rounded-full animate-pulse" />
            <span className="text-gray-300">
              Only <strong className={`text-white transition-all ${isAnimating ? 'scale-110 text-[#c8ff00]' : ''}`}>{spotsLeft}</strong> founding member spots left
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['Space_Grotesk',sans-serif]">
            Built for{' '}
            <span className="text-[#c8ff00] inline-block min-w-[300px]">
              {BUSINESS_TYPES[currentBusinessType]}
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            <strong className="text-white">Stop paying for leads.</strong>{' '}
            <strong className="text-white">Stop paying high fees to marketing companies.</strong>
          </p>
          <p className="text-lg text-gray-400 mb-10">
            Get discovered for your work. One flat fee. No surprises.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button 
              onClick={() => scrollToSection('pricing')}
              className="bg-[#c8ff00] text-black font-bold text-lg px-8 py-6 hover:bg-[#b8ef00] shadow-[0_0_40px_rgba(200,255,0,0.3)]"
            >
              Claim Your Spot — $199/year
              <span className="ml-2">→</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('features')}
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6"
            >
              See How It Works
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#c8ff00]" />
              <span>No referral fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#c8ff00]" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#c8ff00]" />
              <span>30-day money back</span>
            </div>
          </div>
        </div>
      </section>

      {/* 65M Places Banner */}
      <section className="py-16 bg-gradient-to-r from-[#c8ff00]/10 via-[#c8ff00]/5 to-[#c8ff00]/10 border-y border-[#c8ff00]/20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-[#c8ff00] font-bold text-sm tracking-widest mb-2">DON'T GET LEFT OUT</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk',sans-serif]">
            65 Million+ Places Already in Our Database
          </h2>
          <p className="text-gray-400 mb-6">Join thousands of professionals worldwide</p>
          <Button 
            onClick={() => scrollToSection('pricing')}
            className="bg-[#c8ff00] text-black font-bold px-8 py-3 hover:bg-[#b8ef00]"
          >
            JOIN NOW →
          </Button>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 font-['Space_Grotesk',sans-serif]">
            The Industry is <span className="text-[#c8ff00]">Broken</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            You're amazing at what you do. But getting customers? That's where they get you.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { number: "$50+", label: "Per Lead", desc: "Lead gen companies charge you for every click, even if they never become a customer." },
              { number: "25-35%", label: "Referral Fees", desc: "Close a deal? Hand over a quarter of your hard-earned commission." },
              { number: "∞", label: "Bidding Wars", desc: "Same lead sold to 10 competitors. Race to the bottom on price." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-[#c8ff00]/30 transition-colors">
                <div className="text-5xl font-bold text-red-500 line-through mb-4 font-['Space_Grotesk',sans-serif]">
                  {item.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.label}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 font-['Space_Grotesk',sans-serif]">
            One Price. <span className="text-[#c8ff00]">Everything Included.</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            No hidden fees. No per-lead charges. No commission on sales. Just one flat fee.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "👥", title: "Fair Lead Distribution", desc: "Leads go to ONE pro at a time. No racing, no bidding wars." },
              { icon: "⭐", title: "Fair Review System", desc: "Reviews that fade over time. One bad day doesn't define you forever." },
              { icon: "💬", title: "Direct Messaging", desc: "Talk directly with customers. No middleman taking a cut." },
              { icon: "💳", title: "Digital Business Card", desc: "Professional profile that makes you stand out from the crowd." },
              { icon: "📊", title: "Analytics Dashboard", desc: "See who's viewing your profile and where your leads come from." },
              { icon: "🛡️", title: "Verified Badge", desc: "Show customers you're licensed, insured, and trustworthy." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#c8ff00]/30 transition-colors">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-['Space_Grotesk',sans-serif]">
            See the <span className="text-[#c8ff00]">Difference</span>
          </h2>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 p-4 font-semibold">
              <div>Feature</div>
              <div className="text-center text-red-400">Lead Gen Sites</div>
              <div className="text-center text-[#c8ff00]">Tavvy</div>
            </div>
            {[
              ["Cost per lead", "$50-100+", "$0"],
              ["Referral fees", "25-35%", "0%"],
              ["Lead distribution", "Sold to many", "One at a time"],
              ["Annual cost (10 deals)", "$30,000+", "$199"],
              ["Review system", "Permanent", "Fair fading"],
              ["Hidden fees", "Many", "None"],
            ].map(([feature, them, us], i) => (
              <div key={i} className="grid grid-cols-3 p-4 border-t border-white/5">
                <div className="text-gray-300">{feature}</div>
                <div className="text-center flex items-center justify-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-gray-400">{them}</span>
                </div>
                <div className="text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-[#c8ff00]" />
                  <span className="text-white">{us}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#c8ff00]/10 border border-[#c8ff00]/30 rounded-full px-4 py-2 mb-4">
              <span className="text-[#c8ff00]">⚡</span>
              <span className="text-[#c8ff00] font-semibold">Founding Member Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk',sans-serif]">
              Lock In Your <span className="text-[#c8ff00]">First-Year Rate</span>
            </h2>
            <p className="text-gray-400">This exclusive pricing is only available to our first 1,000 members</p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-1">
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'yearly' 
                    ? 'bg-[#c8ff00] text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly <span className="text-xs ml-1 opacity-75">Save $$$</span>
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-[#c8ff00] text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pro Plan */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#00CED1]/50 transition-colors">
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="mb-4">
                <span className="text-gray-500 line-through text-xl">
                  ${billingCycle === 'yearly' ? currentPricing.pro.original : currentPricing.pro.original.toFixed(2)}
                </span>
                <span className="text-5xl font-bold ml-2">
                  ${billingCycle === 'yearly' ? currentPricing.pro.intro : currentPricing.pro.intro.toFixed(2)}
                </span>
                {billingCycle === 'monthly' && <span className="text-gray-400">/mo</span>}
              </div>
              <p className="text-gray-400 mb-2">for your first {billingCycle === 'yearly' ? 'year' : '12 months'}</p>
              <p className="text-gray-500 text-sm mb-4">
                Then ${billingCycle === 'yearly' ? currentPricing.pro.renewal : currentPricing.pro.renewal.toFixed(2)}/{billingCycle === 'yearly' ? 'year' : 'mo'}
              </p>
              <div className="inline-block bg-[#00CED1]/20 text-[#00CED1] px-3 py-1 rounded-full text-sm font-medium mb-4">
                Founders Discount: Save ${currentPricing.pro.savings}
              </div>
              <p className="text-gray-400 text-sm mb-6">{spotsLeft} of 1,000 spots left</p>
              
              <ul className="space-y-3 mb-8">
                {proFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#00CED1] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleCheckout('pro', billingCycle)}
                disabled={isLoading}
                className="w-full bg-[#00CED1] text-black font-bold py-6 hover:bg-[#00B8BB]"
              >
                {loadingPlan === `pro_${billingCycle}` ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  `Get Pro - $${billingCycle === 'yearly' ? currentPricing.pro.intro : currentPricing.pro.intro.toFixed(2)}/${billingCycle === 'yearly' ? 'year' : 'mo'}`
                )}
              </Button>
              <p className="text-gray-500 text-xs text-center mt-4">
                No contract. Renews at ${billingCycle === 'yearly' ? currentPricing.pro.renewal : currentPricing.pro.renewal.toFixed(2)}/{billingCycle === 'yearly' ? 'year' : 'mo'}. Cancel anytime.
              </p>
            </div>

            {/* Pro+ Plan */}
            <div className="bg-white/5 border-2 border-[#D4A84B]/50 rounded-3xl p-8 relative hover:border-[#D4A84B] transition-colors">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4A84B] text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Crown className="w-4 h-4" /> BEST VALUE
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro+</h3>
              <div className="mb-4">
                <span className="text-gray-500 line-through text-xl">
                  ${billingCycle === 'yearly' ? currentPricing.proPlus.original.toLocaleString() : currentPricing.proPlus.original.toFixed(2)}
                </span>
                <span className="text-5xl font-bold ml-2">
                  ${billingCycle === 'yearly' ? currentPricing.proPlus.intro : currentPricing.proPlus.intro.toFixed(2)}
                </span>
                {billingCycle === 'monthly' && <span className="text-gray-400">/mo</span>}
              </div>
              <p className="text-gray-400 mb-2">for your first {billingCycle === 'yearly' ? 'year' : '12 months'}</p>
              <p className="text-gray-500 text-sm mb-4">
                Then ${billingCycle === 'yearly' ? currentPricing.proPlus.renewal.toLocaleString() : currentPricing.proPlus.renewal.toFixed(2)}/{billingCycle === 'yearly' ? 'year' : 'mo'}
              </p>
              <div className="inline-block bg-[#D4A84B]/20 text-[#D4A84B] px-3 py-1 rounded-full text-sm font-medium mb-4">
                Founders Discount: Save ${currentPricing.proPlus.savings}
              </div>
              <p className="text-gray-400 text-sm mb-6">{spotsLeft} of 1,000 spots left</p>
              
              <ul className="space-y-3 mb-8">
                {proPlusFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${i === 0 ? 'text-[#D4A84B]' : 'text-[#D4A84B]'}`} />
                    <span className={i === 0 ? 'text-[#D4A84B] font-semibold' : 'text-gray-300'}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleCheckout('pro_plus', billingCycle)}
                disabled={isLoading}
                className="w-full bg-[#D4A84B] text-black font-bold py-6 hover:bg-[#C49A3B]"
              >
                {loadingPlan === `pro_plus_${billingCycle}` ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                ) : (
                  `Get Pro+ - $${billingCycle === 'yearly' ? currentPricing.proPlus.intro : currentPricing.proPlus.intro.toFixed(2)}/${billingCycle === 'yearly' ? 'year' : 'mo'}`
                )}
              </Button>
              <p className="text-gray-500 text-xs text-center mt-4">
                No contract. Renews at ${billingCycle === 'yearly' ? currentPricing.proPlus.renewal.toLocaleString() : currentPricing.proPlus.renewal.toFixed(2)}/{billingCycle === 'yearly' ? 'year' : 'mo'}. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-['Space_Grotesk',sans-serif]">
            Loved by <span className="text-[#c8ff00]">Professionals</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I was spending $500/month on leads that went nowhere. Now I pay $199/year and get better quality customers who actually want to hire me.",
                name: "Mike Rodriguez",
                role: "General Contractor • Miami, FL",
                initials: "MR"
              },
              {
                quote: "The fair review system is a game changer. One difficult client used to tank my rating for years. Now I can focus on doing great work.",
                name: "Sarah Chen",
                role: "Real Estate Agent • Austin, TX",
                initials: "SC"
              },
              {
                quote: "Before Tavvy, I'd post on Instagram and hope for the best. Now I go live and within 20 minutes there's a line at my truck.",
                name: "Maria Santos",
                role: "Food Truck Owner • Los Angeles, CA",
                initials: "MS"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-[#c8ff00] mb-4">★★★★★</div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#c8ff00]/20 text-[#c8ff00] rounded-full flex items-center justify-center font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-['Space_Grotesk',sans-serif]">
            Questions? <span className="text-[#c8ff00]">Answers.</span>
          </h2>
          
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div 
                key={i} 
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold pr-4">{item.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-[#c8ff00] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-gray-400">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk',sans-serif]">
            Ready to Keep More of <span className="text-[#c8ff00]">What You Earn?</span>
          </h2>
          <p className="text-gray-400 mb-8">Join thousands of professionals who've already made the switch.</p>
          <Button 
            onClick={() => scrollToSection('pricing')}
            className="bg-[#c8ff00] text-black font-bold text-lg px-10 py-6 hover:bg-[#b8ef00] shadow-[0_0_40px_rgba(200,255,0,0.3)]"
          >
            Get Started Now — $199/year
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <img 
                src="/images/tavvy-logo-new.png" 
                alt="Tavvy" 
                className="h-10 w-auto"
              />
              <span className="text-gray-400 text-sm italic">The savvy way to discover.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
              <a href="https://tavvy.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c8ff00] transition-colors">Visit Tavvy</a>
              <a href="/affiliate" className="hover:text-[#c8ff00] transition-colors">Become an Affiliate</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="mailto:support@tavvy.com" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-gray-500 text-sm">© 2026 Tavvy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
