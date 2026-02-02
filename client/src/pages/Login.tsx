import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { signInWithEmail } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Brand colors
const COLORS = {
  background: '#000000',
  backgroundCard: '#111111',
  teal: '#00CED1',
  gold: '#D4A84B',
  border: '#1F1F1F',
  textMuted: '#9CA3AF',
  textDim: '#6B7280',
};

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, sign in via Supabase client-side to establish session
      const { data, error: supabaseError } = await signInWithEmail(email, password);
      
      if (supabaseError) {
        toast({
          title: "Login failed",
          description: supabaseError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!data.user || !data.session) {
        toast({
          title: "Login failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Success - Supabase session is now established
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      
      // Invalidate tRPC cache and redirect to dashboard
      utils.auth.me.invalidate();
      setLocation("/dashboard");
    } catch (err) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: COLORS.background }}
    >
      <Card 
        className="w-full max-w-md"
        style={{ 
          backgroundColor: COLORS.backgroundCard,
          border: `1px solid ${COLORS.border}`
        }}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img 
              src="/tavvy-logo-2.png" 
              alt="Tavvy" 
              className="h-16 w-auto mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <CardTitle className="text-2xl text-white">Tavvy Pros</CardTitle>
          <CardDescription style={{ color: COLORS.textMuted }}>
            Sign in to access your Pro account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: COLORS.textMuted }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                  color: 'white'
                }}
                className="placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: COLORS.textMuted }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                  color: 'white'
                }}
                className="placeholder:text-gray-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full font-semibold"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.gold} 100%)`,
                color: 'black'
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a 
              href="/forgot-password" 
              className="text-sm hover:underline"
              style={{ color: COLORS.teal }}
            >
              Forgot your password?
            </a>
          </div>
          <p className="mt-4 text-center text-xs" style={{ color: COLORS.textDim }}>
            Need an account? Contact Tavvy support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
