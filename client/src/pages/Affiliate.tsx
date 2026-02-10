/**
 * Tavvy Affiliate Program Page
 * Matches the "Rebellion" design theme from LandingPage
 * 
 * Explains the 20% + 10% two-tier commission structure
 * Custom signup form that creates a GHL contact with affiliate-signup tag
 * GHL workflow then auto-assigns the contact as an affiliate
 */
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { 
  DollarSign, Users, TrendingUp, Share2, 
  ChevronDown, ChevronUp, Check, ArrowRight,
  Smartphone, Star, CreditCard, Gift, Loader2,
  CheckCircle2, AlertCircle, ExternalLink
} from "lucide-react";

// Products eligible for commission
const PRODUCTS = [
  {
    name: "Tavvy Pro",
    icon: <Star className="w-5 h-5" />,
    plans: [
      { period: "Monthly", price: "$59.99/mo", commission: "$12.00" },
      { period: "Annual", price: "$599/yr", commission: "$119.80" },
    ],
    description: "Full business profile, analytics, reviews & messaging",
    highlight: true,
  },
  {
    name: "Tavvy Pro+",
    icon: <TrendingUp className="w-5 h-5" />,
    plans: [
      { period: "Monthly", price: "$119.99/mo", commission: "$24.00" },
      { period: "Annual", price: "$1,399/yr", commission: "$279.80" },
    ],
    description: "Everything in Pro plus premium placement & priority support",
    highlight: false,
  },
  {
    name: "Tavvy eCard",
    icon: <CreditCard className="w-5 h-5" />,
    plans: [
      { period: "Monthly", price: "$4.99/mo", commission: "$1.00" },
      { period: "Annual", price: "$39.99/yr", commission: "$8.00" },
    ],
    description: "Digital business card with QR code & contact sharing",
    highlight: false,
  },
];

// How it works steps
const STEPS = [
  {
    step: "01",
    title: "Sign Up",
    description: "Create your free affiliate account in under 2 minutes. No fees, no commitments.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    step: "02",
    title: "Share Your Link",
    description: "Get your unique referral link and share it with your network — social media, email, word of mouth.",
    icon: <Share2 className="w-6 h-6" />,
  },
  {
    step: "03",
    title: "Earn 20% Commission",
    description: "Every time someone signs up through your link and subscribes, you earn 20% of their payment.",
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    step: "04",
    title: "Build Your Network",
    description: "Invite other affiliates to join under you. Earn an extra 10% on every sale they make.",
    icon: <TrendingUp className="w-6 h-6" />,
  },
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: "How much can I earn?",
    answer: "You earn 20% commission on every sale you refer. Plus, if you recruit other affiliates, you earn an additional 10% on their sales. For example, if you refer a Tavvy Pro annual plan ($599), you earn $119.80. If one of your sub-affiliates sells the same plan, you earn an extra $59.90.",
  },
  {
    question: "When do I get paid?",
    answer: "Commissions are paid out on a Net-15 basis, meaning you'll receive your earnings 15 days after the end of each payment period. You'll need to set up your payout method in your affiliate dashboard.",
  },
  {
    question: "Is there a cost to join?",
    answer: "No. The Tavvy Affiliate Program is completely free to join. There are no fees, no minimums, and no commitments.",
  },
  {
    question: "How does the two-tier system work?",
    answer: "When you recruit someone to become a Tavvy affiliate, they become your sub-affiliate. You earn your standard 20% on your own referrals, PLUS an additional 10% on every sale your sub-affiliates make. It's a way to earn passive income by building a team.",
  },
  {
    question: "What products can I promote?",
    answer: "You can promote all Tavvy subscription products: Tavvy Pro ($59.99/mo or $599/yr), Tavvy Pro+ ($119.99/mo or $1,399/yr), and Tavvy eCard ($4.99/mo or $39.99/yr). You earn commission on all of them.",
  },
  {
    question: "How do I track my referrals?",
    answer: "You'll get access to a full affiliate dashboard where you can see your clicks, leads, customers, and commissions in real-time.",
  },
  {
    question: "Do I need to be a Tavvy user to be an affiliate?",
    answer: "No. Anyone can join the affiliate program. You don't need to be a Tavvy subscriber to earn commissions.",
  },
];

export default function Affiliate() {
  const [, navigate] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Signup form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const affiliateSignup = trpc.ghl.affiliateSignup.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSignupSuccess(true);
        setSignupError(null);
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
      } else {
        setSignupError(data.error || "Something went wrong. Please try again.");
      }
    },
    onError: (error) => {
      setSignupError(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setSignupError("Please fill in all required fields.");
      return;
    }

    affiliateSignup.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
    });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Inter',sans-serif]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src="/images/tavvy-logo-new.png" 
              alt="Tavvy" 
              className="h-10 w-auto"
            />
            <span className="hidden lg:block text-gray-400 text-sm italic border-l border-white/20 pl-3">The savvy way to discover.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://e7vdyr8r7cys9twmoqzp.app.clientclub.net/login"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-[#c8ff00]/40 text-[#c8ff00] hover:bg-[#c8ff00]/10 px-5"
              >
                Affiliate Dashboard
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <Button
              onClick={scrollToForm}
              className="hidden sm:inline-flex bg-[#c8ff00] text-black font-semibold hover:bg-[#b8ef00] px-6"
            >
              Become an Affiliate
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#c8ff00]/5 to-transparent pointer-events-none" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(200,255,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <Gift className="w-4 h-4 text-[#c8ff00]" />
            <span className="text-gray-300 text-sm">Free to join · No commitments</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['Space_Grotesk',sans-serif]">
            Earn Money with{' '}
            <span className="text-[#c8ff00]">Tavvy</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Join the Tavvy Affiliate Program and earn <strong className="text-white">20% commission</strong> on every referral.
            Build a team and earn an <strong className="text-white">extra 10%</strong> on their sales.
          </p>
          
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            No fees. No minimums. Just share your link and start earning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-[#c8ff00] text-black font-bold text-lg px-8 py-6 hover:bg-[#b8ef00] shadow-[0_0_40px_rgba(200,255,0,0.3)]"
            >
              Become an Affiliate
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6"
            >
              Learn How It Works
            </Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#c8ff00] font-['Space_Grotesk',sans-serif]">20%</div>
              <div className="text-gray-400 text-sm mt-1">Direct Commission</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-[#c8ff00] font-['Space_Grotesk',sans-serif]">10%</div>
              <div className="text-gray-400 text-sm mt-1">Sub-Affiliate Bonus</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#c8ff00] font-['Space_Grotesk',sans-serif]">$0</div>
              <div className="text-gray-400 text-sm mt-1">Cost to Join</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SIGNUP FORM SECTION ========== */}
      <section id="signup-form" className="py-20 px-4 bg-gradient-to-b from-[#c8ff00]/5 via-[#c8ff00]/[0.02] to-transparent">
        <div className="max-w-2xl mx-auto" ref={formRef}>
          <div className="text-center mb-10">
            <p className="text-[#c8ff00] font-bold text-sm tracking-widest mb-2">JOIN NOW</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk',sans-serif] mb-4">
              Become an Affiliate
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Fill out the form below and we'll set up your affiliate account. You'll receive your unique referral link via email within minutes.
            </p>
          </div>

          {signupSuccess ? (
            <div className="bg-[#c8ff00]/10 border border-[#c8ff00]/30 rounded-2xl p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-[#c8ff00] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 font-['Space_Grotesk',sans-serif]">
                You're In!
              </h3>
              <p className="text-gray-300 mb-2">
                Your affiliate application has been submitted successfully.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Check your email for your unique affiliate link and dashboard access. 
                If you don't see it within a few minutes, check your spam folder.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setSignupSuccess(false)}
                  variant="outline"
                  className="border-[#c8ff00]/30 text-[#c8ff00] hover:bg-[#c8ff00]/10"
                >
                  Sign Up Another Person
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-[#c8ff00] text-black font-semibold hover:bg-[#b8ef00]"
                >
                  Explore Tavvy for Pros
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300 text-sm font-medium">
                    First Name <span className="text-[#c8ff00]">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c8ff00]/50 focus:ring-[#c8ff00]/20 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300 text-sm font-medium">
                    Last Name <span className="text-[#c8ff00]">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c8ff00]/50 focus:ring-[#c8ff00]/20 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                  Email Address <span className="text-[#c8ff00]">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c8ff00]/50 focus:ring-[#c8ff00]/20 h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300 text-sm font-medium">
                  Phone Number <span className="text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c8ff00]/50 focus:ring-[#c8ff00]/20 h-12"
                />
              </div>

              {signupError && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{signupError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={affiliateSignup.isPending}
                className="w-full bg-[#c8ff00] text-black font-bold text-lg h-14 hover:bg-[#b8ef00] shadow-[0_0_30px_rgba(200,255,0,0.2)] disabled:opacity-50"
              >
                {affiliateSignup.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Setting Up Your Account...
                  </>
                ) : (
                  <>
                    Join the Affiliate Program
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-gray-500 text-xs text-center">
                By signing up, you agree to the Tavvy Affiliate Program terms. 
                No fees, cancel anytime.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Two-Tier Explanation */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c8ff00] font-bold text-sm tracking-widest mb-2">TWO-TIER COMMISSIONS</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk',sans-serif] mb-4">
              Earn More by Building a Team
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our two-tier system rewards you for both selling AND recruiting. The more affiliates you bring in, the more you earn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Tier 1 */}
            <div className="bg-white/5 border border-[#c8ff00]/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#c8ff00] text-black font-bold text-xs px-3 py-1 rounded-bl-lg">
                TIER 1
              </div>
              <div className="w-14 h-14 bg-[#c8ff00]/10 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7 text-[#c8ff00]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-['Space_Grotesk',sans-serif]">Direct Referrals</h3>
              <div className="text-5xl font-bold text-[#c8ff00] mb-4 font-['Space_Grotesk',sans-serif]">20%</div>
              <p className="text-gray-400 leading-relaxed">
                Share your unique affiliate link. When someone clicks it and subscribes to any Tavvy product, you earn <strong className="text-white">20% of their payment</strong>.
              </p>
              <div className="mt-6 bg-white/5 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Example</p>
                <p className="text-gray-300">
                  You refer a <strong className="text-white">Tavvy Pro Annual</strong> ($599) → You earn <strong className="text-[#c8ff00]">$119.80</strong>
                </p>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-bl-lg">
                TIER 2
              </div>
              <div className="w-14 h-14 bg-[#c8ff00]/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#c8ff00]" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-['Space_Grotesk',sans-serif]">Sub-Affiliate Sales</h3>
              <div className="text-5xl font-bold text-[#c8ff00] mb-4 font-['Space_Grotesk',sans-serif]">10%</div>
              <p className="text-gray-400 leading-relaxed">
                Recruit other affiliates to join under you. When <strong className="text-white">they</strong> make a sale, you earn an <strong className="text-white">extra 10%</strong> — on top of your own commissions.
              </p>
              <div className="mt-6 bg-white/5 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Example</p>
                <p className="text-gray-300">
                  Your sub-affiliate sells <strong className="text-white">Tavvy Pro Annual</strong> ($599) → You earn <strong className="text-[#c8ff00]">$59.90</strong> passively
                </p>
              </div>
            </div>
          </div>

          {/* Earnings Scenario */}
          <div className="mt-12 bg-gradient-to-r from-[#c8ff00]/10 via-[#c8ff00]/5 to-[#c8ff00]/10 border border-[#c8ff00]/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center font-['Space_Grotesk',sans-serif]">
              Real Earning Scenario
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gray-400 text-sm mb-2">Your Direct Sales</p>
                <p className="text-white font-semibold">5 Tavvy Pro Annual plans</p>
                <p className="text-[#c8ff00] text-2xl font-bold font-['Space_Grotesk',sans-serif] mt-1">$599.00</p>
                <p className="text-gray-500 text-xs mt-1">5 x $599 x 20%</p>
              </div>
              <div className="md:border-x border-white/10">
                <p className="text-gray-400 text-sm mb-2">Sub-Affiliate Sales</p>
                <p className="text-white font-semibold">3 affiliates x 4 sales each</p>
                <p className="text-[#c8ff00] text-2xl font-bold font-['Space_Grotesk',sans-serif] mt-1">$719.40</p>
                <p className="text-gray-500 text-xs mt-1">12 x $599 x 10%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
                <p className="text-white font-semibold">From one campaign</p>
                <p className="text-[#c8ff00] text-3xl font-bold font-['Space_Grotesk',sans-serif] mt-1">$1,318.40</p>
                <p className="text-gray-500 text-xs mt-1">Direct + Sub-Affiliate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c8ff00] font-bold text-sm tracking-widest mb-2">GETTING STARTED</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk',sans-serif]">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-[#c8ff00]/30 to-transparent" />
                )}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#c8ff00]/30 transition-all duration-300 h-full">
                  <div className="text-[#c8ff00] font-bold text-xs tracking-widest mb-4">{step.step}</div>
                  <div className="w-12 h-12 bg-[#c8ff00]/10 rounded-xl flex items-center justify-center mb-4 text-[#c8ff00]">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-['Space_Grotesk',sans-serif]">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c8ff00] font-bold text-sm tracking-widest mb-2">COMMISSION-ELIGIBLE PRODUCTS</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk',sans-serif] mb-4">
              What You Can Promote
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Earn 20% commission on every subscription sold through your link. Here's what's available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <div 
                key={i} 
                className={`rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
                  product.highlight 
                    ? 'bg-[#c8ff00]/5 border-[#c8ff00]/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {product.highlight && (
                  <div className="inline-flex items-center gap-1 bg-[#c8ff00] text-black text-xs font-bold px-2 py-1 rounded-full mb-4">
                    <Star className="w-3 h-3" /> MOST POPULAR
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#c8ff00]/10 rounded-lg flex items-center justify-center text-[#c8ff00]">
                    {product.icon}
                  </div>
                  <h3 className="text-xl font-bold font-['Space_Grotesk',sans-serif]">{product.name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6">{product.description}</p>
                
                <div className="space-y-3">
                  {product.plans.map((plan, j) => (
                    <div key={j} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="text-white text-sm font-medium">{plan.period}</p>
                        <p className="text-gray-500 text-xs">{plan.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#c8ff00] font-bold">{plan.commission}</p>
                        <p className="text-gray-500 text-xs">your cut</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tavvy Affiliates */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c8ff00] font-bold text-sm tracking-widest mb-2">WHY JOIN</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk',sans-serif]">
              Why Promote Tavvy?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <DollarSign className="w-6 h-6" />, title: "Generous Commissions", desc: "20% on direct sales + 10% on sub-affiliate sales. One of the highest commission rates in the industry." },
              { icon: <Users className="w-6 h-6" />, title: "Two-Tier Earnings", desc: "Build a team of affiliates and earn passive income from their sales. Your network works for you." },
              { icon: <Smartphone className="w-6 h-6" />, title: "Product People Love", desc: "Tavvy solves a real problem for professionals. Happy customers mean easy referrals." },
              { icon: <CreditCard className="w-6 h-6" />, title: "Multiple Products", desc: "From $4.99/mo eCards to $1,399/yr Pro+ plans — there's a product for every budget." },
              { icon: <TrendingUp className="w-6 h-6" />, title: "Real-Time Dashboard", desc: "Track your clicks, leads, conversions, and commissions in real-time from your affiliate portal." },
              { icon: <Gift className="w-6 h-6" />, title: "Free to Join", desc: "No signup fees, no monthly costs, no minimums. Start earning from day one." },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#c8ff00]/20 transition-all duration-300">
                <div className="w-12 h-12 bg-[#c8ff00]/10 rounded-xl flex items-center justify-center mb-4 text-[#c8ff00]">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 font-['Space_Grotesk',sans-serif]">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#c8ff00] font-bold text-sm tracking-widest mb-2">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk',sans-serif]">
              Common Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-white pr-4">{item.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-[#c8ff00] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#c8ff00]/10 to-[#c8ff00]/5 border border-[#c8ff00]/20 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(200,255,0,0.5) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }} />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-['Space_Grotesk',sans-serif]">
                Ready to Start Earning?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join the Tavvy Affiliate Program today. It's free, takes 2 minutes, and you could be earning commissions by tomorrow.
              </p>
              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-[#c8ff00] text-black font-bold text-lg px-10 py-6 hover:bg-[#b8ef00] shadow-[0_0_40px_rgba(200,255,0,0.3)]"
              >
                Become an Affiliate Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#c8ff00]" />
                  <span>Free to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#c8ff00]" />
                  <span>No minimums</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#c8ff00]" />
                  <span>Instant affiliate link</span>
                </div>
              </div>
            </div>
          </div>
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
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="mailto:support@tavvy.com" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-gray-500 text-sm">&copy; 2026 Tavvy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
