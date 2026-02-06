import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/lib/supabase";

// Brand colors
const COLORS = {
  background: '#000000',
  backgroundCard: '#111111',
  teal: '#00CED1',
  gold: '#D4A84B',
  green: '#10B981',
  red: '#EF4444',
  border: '#1F1F1F',
  textMuted: '#9CA3AF',
  textDim: '#6B7280',
};

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password validation
  const passwordMinLength = password.length >= 8;
  const passwordHasUpper = /[A-Z]/.test(password);
  const passwordHasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isValid = passwordMinLength && passwordHasUpper && passwordHasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateError } = await updatePassword(password);

    if (updateError) {
      setError(updateError.message);
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
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.green} 100%)` }}
              >
                <CheckCircle className="h-8 w-8 text-black" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Password Updated!</CardTitle>
            <CardDescription style={{ color: COLORS.textMuted }} className="mt-2">
              Your password has been successfully reset. You can now log in with your new password.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              className="w-full font-semibold text-base py-6"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.gold} 100%)`,
                color: 'black'
              }}
              onClick={() => setLocation("/login")}
            >
              Back to Login
            </Button>
            <p className="text-center text-sm" style={{ color: COLORS.textDim }}>
              You can also open the Tavvy app and log in there.
            </p>
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
          <CardTitle className="text-2xl text-white">Set New Password</CardTitle>
          <CardDescription style={{ color: COLORS.textMuted }}>
            Choose a strong password for your Tavvy account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: COLORS.textMuted }}>New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.border,
                    color: 'white',
                    paddingRight: '40px'
                  }}
                  className="placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: COLORS.textDim }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password.length > 0 && (
              <div className="space-y-1.5 text-sm">
                <RequirementItem met={passwordMinLength} text="At least 8 characters" />
                <RequirementItem met={passwordHasUpper} text="One uppercase letter" />
                <RequirementItem met={passwordHasNumber} text="One number" />
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ color: COLORS.textMuted }}>Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ 
                    backgroundColor: COLORS.background,
                    borderColor: confirmPassword.length > 0 
                      ? (passwordsMatch ? COLORS.green : COLORS.red) 
                      : COLORS.border,
                    color: 'white',
                    paddingRight: '40px'
                  }}
                  className="placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: COLORS.textDim }}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-sm" style={{ color: COLORS.red }}>Passwords don't match</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full font-semibold text-base py-6"
              style={{ 
                background: isValid 
                  ? `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.gold} 100%)`
                  : '#333',
                color: isValid ? 'black' : '#666'
              }}
              disabled={loading || !isValid}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-4 h-4 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: met ? '#10B981' : '#333',
          transition: 'background-color 0.2s'
        }}
      >
        {met && <CheckCircle className="h-3 w-3 text-black" />}
      </div>
      <span style={{ color: met ? '#10B981' : '#6B7280' }}>{text}</span>
    </div>
  );
}
