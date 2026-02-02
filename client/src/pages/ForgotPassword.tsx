import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/supabase";

// Brand colors
const COLORS = {
  background: '#000000',
  backgroundCard: '#111111',
  teal: '#00CED1',
  gold: '#D4A84B',
  green: '#10B981',
  border: '#1F1F1F',
  textMuted: '#9CA3AF',
  textDim: '#6B7280',
};

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
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
            <div className="flex justify-center mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.green }}
              >
                <CheckCircle className="h-6 w-6 text-black" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
            <CardDescription style={{ color: COLORS.textMuted }}>
              We've sent a password reset link to <strong className="text-white">{email}</strong>. Please check your email and follow the instructions.
            </CardDescription>
          </CardHeader>
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
          <div className="flex justify-center mb-4">
            <img 
              src="/tavvy-logo-2.png" 
              alt="Tavvy" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
          <CardDescription style={{ color: COLORS.textMuted }}>
            Enter your email to receive a reset link
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full font-semibold"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.gold} 100%)`,
                color: 'black'
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              style={{ color: COLORS.textMuted }}
              onClick={() => setLocation("/login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
