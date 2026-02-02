import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Building2, 
  MapPin, 
  Wrench, 
  FileText, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";

const SERVICE_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Roofing",
  "Landscaping",
  "Cleaning",
  "Painting",
  "Handyman",
  "Flooring",
  "Carpentry",
  "Pest Control",
  "Pool Service",
  "Appliance Repair",
  "Garage Door",
  "Locksmith",
  "Moving",
  "Other"
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user } = useSupabaseAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1: Business Info
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  
  // Step 2: Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Step 3: Service Area
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [serviceRadius, setServiceRadius] = useState("25");
  
  // Step 4: Bio
  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const ghlSync = trpc.ghl.syncContact.useMutation();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Save business profile to Supabase (pro_providers is the single source of truth)
      const { error: profileError } = await supabase
        .from('pro_providers')
        .upsert({
          user_id: user?.id,
          business_name: businessName,
          phone,
          website,
          specialties: selectedServices,
          city,
          state,
          zip_code: zipCode,
          service_radius: parseInt(serviceRadius),
          bio,
          years_experience: parseInt(yearsExperience) || 0,
          provider_type: 'pro',
          is_active: true,
          created_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (profileError) {
        console.warn('Profile save warning:', profileError);
      }

      // Sync to GoHighLevel for CRM and automations
      try {
        await ghlSync.mutateAsync({
          email: user?.email || '',
          fullName: user?.user_metadata?.full_name || businessName,
          phone,
          businessName,
          city,
          state,
          zipCode,
          website: website || undefined,
          services: selectedServices,
          yearsExperience: parseInt(yearsExperience) || undefined,
        });
        console.log('Pro synced to GoHighLevel successfully');
      } catch (ghlError) {
        // Don't block onboarding if GHL sync fails
        console.warn('GHL sync warning:', ghlError);
      }

      setLocation("/dashboard");
    } catch (err) {
      console.error('Onboarding error:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return businessName.trim() && phone.trim();
      case 2:
        return selectedServices.length > 0;
      case 3:
        return city.trim() && state.trim() && zipCode.trim();
      case 4:
        return bio.trim();
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-slate-900">Business Information</CardTitle>
              <CardDescription className="text-slate-600">
                Tell us about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-slate-700">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="ABC Plumbing Services"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="border-slate-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-slate-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="text-slate-700">Website (optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="border-slate-300"
                />
              </div>
            </CardContent>
          </>
        );

      case 2:
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Wrench className="h-7 w-7 text-orange-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-slate-900">Services You Offer</CardTitle>
              <CardDescription className="text-slate-600">
                Select all the services you provide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {SERVICE_CATEGORIES.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all text-left ${
                      selectedServices.includes(service)
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </CardContent>
          </>
        );

      case 3:
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-slate-900">Service Area</CardTitle>
              <CardDescription className="text-slate-600">
                Where do you provide services?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-700">City *</Label>
                  <Input
                    id="city"
                    placeholder="Miami"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-slate-700">State *</Label>
                  <Input
                    id="state"
                    placeholder="FL"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-slate-700">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="33101"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceRadius" className="text-slate-700">Service Radius (miles)</Label>
                  <Input
                    id="serviceRadius"
                    type="number"
                    placeholder="25"
                    value={serviceRadius}
                    onChange={(e) => setServiceRadius(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
              </div>
            </CardContent>
          </>
        );

      case 4:
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FileText className="h-7 w-7 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-slate-900">About Your Business</CardTitle>
              <CardDescription className="text-slate-600">
                Help customers get to know you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="yearsExperience" className="text-slate-700">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  placeholder="10"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="border-slate-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-700">Business Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell customers about your business..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="border-slate-300 min-h-[120px]"
                />
              </div>
            </CardContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f2] py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step ? "bg-blue-600 w-8" : s < step ? "bg-green-500" : "bg-slate-300"
              }`}
            />
          ))}
        </div>

        <Card className="border-none shadow-xl">
          {error && (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          {renderStep()}
          
          <CardFooter className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600"
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-6">
          Step {step} of 4
        </p>
      </div>
    </div>
  );
}
