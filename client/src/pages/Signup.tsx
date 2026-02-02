import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, AlertCircle, CheckCircle, PartyPopper, Crown, Check, ArrowRight } from "lucide-react";
import { signUpWithEmail } from "@/lib/supabase";

// Brand colors
const COLORS = {
  background: '#000000',
  backgroundAlt: '#0A0A0A',
  backgroundCard: '#111111',
  teal: '#00CED1',
  tealDark: '#00A5A8',
  gold: '#D4A84B',
  goldLight: '#E5B84D',
  green: '#10B981',
  border: '#1F1F1F',
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  textDim: '#6B7280',
};

export default function Signup() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const paymentSuccess = searchParams.get("payment") === "success";
  const planFromUrl = searchParams.get("plan") as 'pro' | 'pro_plus' | null;
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'pro_plus'>(planFromUrl || 'pro');

  // Update selected plan when URL changes
  useEffect(() => {
    if (planFromUrl) {
      setSelectedPlan(planFromUrl);
    }
  }, [planFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Don't set subscription details here - webhook will handle it after payment
    const { data, error: signUpError } = await signUpWithEmail(email, password, {
      full_name: fullName,
      // Subscription details will be set by Stripe webhook after payment
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setSuccess(true);
    }
    setLoading(false);
  };

  const proFeatures = [
    "Unlimited lead access",
    "Fair lead distribution",
    "Fair review system",
    "Direct messaging",
    "Profile showcase",
  ];

  const proPlusFeatures = [
    "Everything in Pro",
    "Full CRM with Automation",
    "200 sponsored searches/mo",
    "Digital Business Cards",
    "Priority support",
  ];

  if (success) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: COLORS.background }}
      >
        <Card 
          className="w-full max-w-md border-none shadow-xl"
          style={{ backgroundColor: COLORS.backgroundCard }}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.green }}
              >
                <CheckCircle className="h-8 w-8 text-black" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <CardDescription style={{ color: COLORS.textMuted }}>
              We've sent a confirmation link to <strong className="text-white">{email}</strong>. 
              Please check your email and click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center" style={{ color: COLORS.textMuted }}>
            <p className="text-sm">
              After confirming your email, you'll be able to set up your Business Profile and start receiving leads.
            </p>
            {selectedPlan === 'pro_plus' && (
              <div 
                className="mt-4 p-4 rounded-xl"
                style={{ 
                  backgroundColor: `${COLORS.gold}20`,
                  border: `1px solid ${COLORS.gold}30`
                }}
              >
                <div className="flex items-center justify-center gap-2 font-semibold mb-1" style={{ color: COLORS.gold }}>
                  <Crown className="h-5 w-5" />
                  Pro+ Member
                </div>
                <p className="text-sm" style={{ color: COLORS.gold }}>
                  You'll receive your 360 For Business CRM login credentials via email within 24 hours.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full font-semibold"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.gold} 100%)`,
                color: 'black'
              }}
              onClick={() => setLocation("/login")}
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If payment was successful, show the account creation form
  if (paymentSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: COLORS.background }}
      >
        <Card 
          className="w-full max-w-md border-none shadow-xl"
          style={{ backgroundColor: COLORS.backgroundCard }}
        >
          <CardHeader className="text-center">
            <div 
              className="mb-4 p-4 rounded-xl"
              style={{ 
                backgroundColor: `${COLORS.green}20`,
                border: `1px solid ${COLORS.green}30`
              }}
            >
              <div className="flex items-center justify-center gap-2 font-semibold mb-1" style={{ color: COLORS.green }}>
                <PartyPopper className="h-5 w-5" />
                Payment Successful!
              </div>
              <p className="text-sm" style={{ color: COLORS.green }}>
                Welcome to Tavvy Pros {selectedPlan === 'pro_plus' ? 'Pro+' : 'Pro'}! Create your account to get started.
              </p>
            </div>
            
            {/* Show selected plan badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ 
                background: selectedPlan === 'pro_plus' 
                  ? `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`
                  : `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealDark} 100%)`,
                color: 'black'
              }}
            >
              {selectedPlan === 'pro_plus' && <Crown className="h-4 w-4" />}
              <span className="font-semibold">
                {selectedPlan === 'pro_plus' ? 'Pro+ Plan - $599 first year' : 'Pro Plan - $199 first year'}
              </span>
            </div>

            <div className="flex justify-center mb-4">
              <img 
                src="/tavvy-logo-2.png" 
                alt="Tavvy" 
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl text-white">Create Your Pro Account</CardTitle>
            <CardDescription style={{ color: COLORS.textMuted }}>
              Complete your registration to access your Pro dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="fullName" style={{ color: COLORS.textMuted }}>Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.border,
                    color: 'white'
                  }}
                  className="placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: COLORS.textMuted }}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.border,
                    color: 'white'
                  }}
                  className="placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: COLORS.textMuted }}>Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.border,
                    color: 'white'
                  }}
                  className="placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" style={{ color: COLORS.textMuted }}>Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.border,
                    color: 'white'
                  }}
                  className="placeholder:text-gray-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full font-semibold"
                style={{ 
                  background: selectedPlan === 'pro_plus'
                    ? `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`
                    : `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealDark} 100%)`,
                  color: 'black'
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create {selectedPlan === 'pro_plus' ? 'Pro+' : 'Pro'} Account
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                style={{ color: COLORS.textMuted }}
                onClick={() => setLocation("/login")}
              >
                Already have an account? Sign in
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Default view - redirect to landing page pricing
  // Users should not be able to access signup without payment
  useEffect(() => {
    if (!paymentSuccess) {
      setLocation('/#pricing');
    }
  }, [paymentSuccess, setLocation]);

  // If no payment success, show loading while redirecting
  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <img 
            src="/tavvy-logo-2.png" 
            alt="Tavvy" 
            className="h-12 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p style={{ color: COLORS.textMuted }}>Select the plan that's right for your business</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Pro Plan Card */}
          <div 
            className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all"
            style={{ 
              backgroundColor: COLORS.backgroundCard,
              border: selectedPlan === 'pro' 
                ? `2px solid ${COLORS.teal}` 
                : `1px solid ${COLORS.border}`,
              boxShadow: selectedPlan === 'pro' ? `0 0 30px ${COLORS.teal}30` : undefined
            }}
            onClick={() => setSelectedPlan('pro')}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="inline-block text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: COLORS.teal, color: 'black' }}
              >
                MOST POPULAR
              </div>
              <div 
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                style={{ 
                  borderColor: selectedPlan === 'pro' ? COLORS.teal : COLORS.border,
                  backgroundColor: selectedPlan === 'pro' ? COLORS.teal : 'transparent'
                }}
              >
                {selectedPlan === 'pro' && <Check className="w-4 h-4 text-black" />}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-white">$199</span>
              <span style={{ color: COLORS.textDim }}>/first year</span>
            </div>
            <p className="text-xs mb-4" style={{ color: COLORS.textDim }}>Then $599/year</p>
            
            <div className="space-y-2">
              {proFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.teal }} />
                  <span className="text-sm" style={{ color: COLORS.textMuted }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro+ Plan Card */}
          <div 
            className="rounded-2xl p-6 shadow-lg cursor-pointer transition-all"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.backgroundCard} 0%, #1a1a1a 100%)`,
              border: selectedPlan === 'pro_plus' 
                ? `2px solid ${COLORS.gold}` 
                : `1px solid ${COLORS.border}`,
              boxShadow: selectedPlan === 'pro_plus' ? `0 0 30px ${COLORS.gold}30` : undefined
            }}
            onClick={() => setSelectedPlan('pro_plus')}
          >
            <div className="flex items-center justify-between mb-4">
              <div 
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: COLORS.gold, color: 'black' }}
              >
                <Crown className="w-3 h-3" />
                BEST VALUE
              </div>
              <div 
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                style={{ 
                  borderColor: selectedPlan === 'pro_plus' ? COLORS.gold : COLORS.border,
                  backgroundColor: selectedPlan === 'pro_plus' ? COLORS.gold : 'transparent'
                }}
              >
                {selectedPlan === 'pro_plus' && <Check className="w-4 h-4 text-black" />}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">Pro+</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-white">$599</span>
              <span style={{ color: COLORS.textDim }}>/first year</span>
            </div>
            <p className="text-xs mb-4" style={{ color: COLORS.textDim }}>Then $1,399/year</p>
            
            <div className="space-y-2">
              {proPlusFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.gold }} />
                  <span 
                    className={`text-sm ${i === 0 ? 'font-semibold' : ''}`}
                    style={{ color: i === 0 ? COLORS.gold : COLORS.textMuted }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="px-12 py-6 text-lg shadow-xl transition-all hover:scale-[1.02] font-semibold"
            style={{ 
              background: selectedPlan === 'pro_plus'
                ? `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`
                : `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.tealDark} 100%)`,
              color: 'black',
              boxShadow: selectedPlan === 'pro_plus' 
                ? `0 10px 30px ${COLORS.gold}30`
                : `0 10px 30px ${COLORS.teal}30`
            }}
            onClick={() => {
              // Redirect to Stripe checkout
              window.location.href = `/?checkout=${selectedPlan}`;
            }}
          >
            Continue with {selectedPlan === 'pro_plus' ? 'Pro+' : 'Pro'} - ${selectedPlan === 'pro_plus' ? '599' : '199'} first year
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <p className="text-sm mt-4" style={{ color: COLORS.textDim }}>
            30-day money-back guarantee. No questions asked.
          </p>

          <Button
            type="button"
            variant="link"
            className="mt-4 p-0 h-auto"
            style={{ color: COLORS.textMuted }}
            onClick={() => setLocation("/login")}
          >
            Already have an account? Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
