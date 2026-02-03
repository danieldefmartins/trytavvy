import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Loader2, 
  Building2, 
  MapPin, 
  Wrench, 
  FileText, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Camera,
  Clock,
  Award,
  User,
  Briefcase,
  Home,
  Car,
  Upload,
  X,
  Plus,
  Star,
  Shield,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  Video,
  ChevronRight
} from "lucide-react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";

// Brand colors matching the existing theme
const COLORS = {
  background: '#000000',
  backgroundAlt: '#0A0A0A',
  backgroundCard: '#111111',
  teal: '#00CED1',
  tealDark: '#00A5A8',
  gold: '#D4A84B',
  goldLight: '#E5B84D',
  green: '#10B981',
  red: '#EF4444',
  border: '#1F1F1F',
  borderLight: '#2A2A2A',
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  textDim: '#6B7280',
};

// Provider types
const PROVIDER_TYPES = [
  { 
    id: 'pro', 
    name: 'Home Services Pro', 
    description: 'Plumbers, electricians, contractors, and more',
    icon: Wrench,
    color: COLORS.teal
  },
  { 
    id: 'realtor', 
    name: 'Real Estate Professional', 
    description: 'Agents, brokers, and property managers',
    icon: Home,
    color: COLORS.gold
  },
  { 
    id: 'on_the_go', 
    name: 'Mobile Business', 
    description: 'Food trucks, mobile grooming, and mobile services',
    icon: Car,
    color: COLORS.green
  },
];

// Service categories organized by provider type
const SERVICE_CATEGORIES: Record<string, { name: string; icon: string; subcategories: string[] }[]> = {
  pro: [
    { name: 'Plumbing', icon: '🔧', subcategories: ['Drain Cleaning', 'Water Heater', 'Pipe Repair', 'Bathroom Remodel', 'Sewer Line'] },
    { name: 'Electrical', icon: '⚡', subcategories: ['Wiring', 'Panel Upgrade', 'Lighting', 'Outlet Installation', 'Generator'] },
    { name: 'HVAC', icon: '❄️', subcategories: ['AC Repair', 'Heating', 'Duct Cleaning', 'Installation', 'Maintenance'] },
    { name: 'Roofing', icon: '🏠', subcategories: ['Repair', 'Replacement', 'Inspection', 'Gutter', 'Shingles'] },
    { name: 'Landscaping', icon: '🌳', subcategories: ['Lawn Care', 'Tree Service', 'Irrigation', 'Hardscaping', 'Design'] },
    { name: 'Cleaning', icon: '🧹', subcategories: ['House Cleaning', 'Deep Clean', 'Move-out', 'Commercial', 'Carpet'] },
    { name: 'Painting', icon: '🎨', subcategories: ['Interior', 'Exterior', 'Cabinet', 'Deck Staining', 'Wallpaper'] },
    { name: 'Handyman', icon: '🔨', subcategories: ['Repairs', 'Assembly', 'Mounting', 'Drywall', 'Carpentry'] },
    { name: 'Flooring', icon: '🪵', subcategories: ['Hardwood', 'Tile', 'Carpet', 'Vinyl', 'Refinishing'] },
    { name: 'Pest Control', icon: '🐜', subcategories: ['Termites', 'Rodents', 'Insects', 'Wildlife', 'Prevention'] },
    { name: 'Pool Service', icon: '🏊', subcategories: ['Cleaning', 'Repair', 'Installation', 'Maintenance', 'Remodeling'] },
    { name: 'Appliance Repair', icon: '🔌', subcategories: ['Washer/Dryer', 'Refrigerator', 'Dishwasher', 'Oven', 'HVAC'] },
    { name: 'Garage Door', icon: '🚗', subcategories: ['Repair', 'Installation', 'Opener', 'Spring', 'Maintenance'] },
    { name: 'Locksmith', icon: '🔐', subcategories: ['Lockout', 'Rekey', 'Installation', 'Safe', 'Auto'] },
    { name: 'Moving', icon: '📦', subcategories: ['Local', 'Long Distance', 'Packing', 'Storage', 'Commercial'] },
    { name: 'Window & Door', icon: '🪟', subcategories: ['Repair', 'Replacement', 'Installation', 'Glass', 'Screens'] },
  ],
  realtor: [
    { name: 'Residential Sales', icon: '🏡', subcategories: ['Single Family', 'Condo', 'Townhouse', 'Luxury', 'First-time Buyer'] },
    { name: 'Commercial', icon: '🏢', subcategories: ['Office', 'Retail', 'Industrial', 'Investment', 'Land'] },
    { name: 'Property Management', icon: '🔑', subcategories: ['Residential', 'Commercial', 'HOA', 'Vacation Rental', 'Tenant'] },
    { name: 'Rentals', icon: '📋', subcategories: ['Apartments', 'Houses', 'Commercial', 'Short-term', 'Luxury'] },
  ],
  on_the_go: [
    { name: 'Food Truck', icon: '🚚', subcategories: ['Tacos', 'BBQ', 'Asian', 'Desserts', 'Coffee'] },
    { name: 'Mobile Grooming', icon: '🐕', subcategories: ['Dogs', 'Cats', 'Full Service', 'Bath Only', 'Specialty'] },
    { name: 'Mobile Detailing', icon: '🚗', subcategories: ['Full Detail', 'Interior', 'Exterior', 'Ceramic Coating', 'Paint Correction'] },
    { name: 'Mobile Mechanic', icon: '🔧', subcategories: ['Oil Change', 'Brakes', 'Diagnostics', 'Battery', 'Tires'] },
    { name: 'Mobile Notary', icon: '📝', subcategories: ['Loan Signing', 'General Notary', 'Apostille', 'I-9', 'Wills'] },
  ],
};

// Business highlights/badges
const BUSINESS_HIGHLIGHTS = [
  { id: 'licensed', label: 'Licensed', icon: BadgeCheck, description: 'State or local license' },
  { id: 'insured', label: 'Insured', icon: Shield, description: 'Liability insurance' },
  { id: 'bonded', label: 'Bonded', icon: Award, description: 'Surety bond' },
  { id: 'veteran_owned', label: 'Veteran Owned', icon: Star, description: 'Veteran-owned business' },
  { id: 'woman_owned', label: 'Woman Owned', icon: Sparkles, description: 'Woman-owned business' },
  { id: 'minority_owned', label: 'Minority Owned', icon: TrendingUp, description: 'Minority-owned business' },
  { id: 'family_owned', label: 'Family Owned', icon: Home, description: 'Family-owned business' },
  { id: 'eco_friendly', label: 'Eco-Friendly', icon: Sparkles, description: 'Environmentally conscious' },
  { id: 'free_estimates', label: 'Free Estimates', icon: CheckCircle, description: 'Offers free quotes' },
  { id: 'emergency_service', label: '24/7 Emergency', icon: Clock, description: 'Available for emergencies' },
  { id: 'warranty', label: 'Warranty Offered', icon: Shield, description: 'Work warranty included' },
  { id: 'financing', label: 'Financing Available', icon: TrendingUp, description: 'Payment plans offered' },
];

// Days of the week for hours
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Types
interface OnboardingData {
  // Step 1: Provider Type
  providerType: string;
  
  // Step 2: Categories
  primaryCategory: string;
  secondaryCategories: string[];
  
  // Step 3: Business Info
  businessName: string;
  phone: string;
  email: string;
  website: string;
  yearEstablished: string;
  
  // Step 4: Location
  locationType: 'fixed' | 'mobile';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceAreas: string[];
  serviceRadius: number;
  
  // Step 5: Hours
  hours: Record<string, { open: string; close: string; closed: boolean }>;
  byAppointmentOnly: boolean;
  
  // Step 6: Services
  services: { name: string; description: string; priceType: string; priceMin: string; priceMax: string }[];
  
  // Step 7: Photos
  profilePhoto: string | null;
  coverPhoto: string | null;
  workPhotos: string[];
  
  // Step 8: Highlights
  highlights: string[];
  licenseNumber: string;
  licenseState: string;
  
  // Step 9: Bio
  shortBio: string;
  fullDescription: string;
  
  // Meta
  currentStep: number;
}

const TOTAL_STEPS = 10;

// Initial state
const initialData: OnboardingData = {
  providerType: '',
  primaryCategory: '',
  secondaryCategories: [],
  businessName: '',
  phone: '',
  email: '',
  website: '',
  yearEstablished: '',
  locationType: 'fixed',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  serviceAreas: [],
  serviceRadius: 25,
  hours: DAYS_OF_WEEK.reduce((acc, day) => ({
    ...acc,
    [day]: { open: '09:00', close: '17:00', closed: day === 'Sunday' }
  }), {}),
  byAppointmentOnly: false,
  services: [],
  profilePhoto: null,
  coverPhoto: null,
  workPhotos: [],
  highlights: [],
  licenseNumber: '',
  licenseState: '',
  shortBio: '',
  fullDescription: '',
  currentStep: 1,
};

// Profile completion weights
const COMPLETION_WEIGHTS = {
  providerType: 5,
  primaryCategory: 5,
  businessName: 5,
  phone: 5,
  address: 10,
  hours: 10,
  services: 15,
  profilePhoto: 10,
  coverPhoto: 5,
  workPhotos: 10,
  highlights: 10,
  bio: 10,
  website: 5,
};

export default function OnboardingNew() {
  const [, setLocation] = useLocation();
  const { user } = useSupabaseAuth();
  const [data, setData] = useState<OnboardingData>(initialData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate profile completion percentage
  const calculateCompletion = useCallback((): number => {
    let score = 0;
    
    if (data.providerType) score += COMPLETION_WEIGHTS.providerType;
    if (data.primaryCategory) score += COMPLETION_WEIGHTS.primaryCategory;
    if (data.businessName) score += COMPLETION_WEIGHTS.businessName;
    if (data.phone) score += COMPLETION_WEIGHTS.phone;
    if (data.address || data.serviceAreas.length > 0) score += COMPLETION_WEIGHTS.address;
    if (Object.values(data.hours).some(h => !h.closed)) score += COMPLETION_WEIGHTS.hours;
    if (data.services.length >= 3) score += COMPLETION_WEIGHTS.services;
    else if (data.services.length > 0) score += Math.floor(COMPLETION_WEIGHTS.services * (data.services.length / 3));
    if (data.profilePhoto) score += COMPLETION_WEIGHTS.profilePhoto;
    if (data.coverPhoto) score += COMPLETION_WEIGHTS.coverPhoto;
    if (data.workPhotos.length >= 3) score += COMPLETION_WEIGHTS.workPhotos;
    else if (data.workPhotos.length > 0) score += Math.floor(COMPLETION_WEIGHTS.workPhotos * (data.workPhotos.length / 3));
    if (data.highlights.length > 0) score += COMPLETION_WEIGHTS.highlights;
    if (data.shortBio || data.fullDescription) score += COMPLETION_WEIGHTS.bio;
    if (data.website) score += COMPLETION_WEIGHTS.website;
    
    return Math.min(100, score);
  }, [data]);

  const completion = calculateCompletion();

  // Update data helper
  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // Navigation
  const nextStep = async () => {
    if (data.currentStep < TOTAL_STEPS) {
      // Save progress at key milestones (after business info, location, and services)
      if ([3, 4, 6, 9].includes(data.currentStep)) {
        try {
          await saveProgress();
        } catch (err) {
          // Don't block navigation on save errors
          console.error('Save error:', err);
        }
      }
      updateData({ currentStep: data.currentStep + 1 });
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (data.currentStep > 1) {
      updateData({ currentStep: data.currentStep - 1 });
      window.scrollTo(0, 0);
    }
  };

  // Check if current step is valid
  const canProceed = (): boolean => {
    switch (data.currentStep) {
      case 1: return !!data.providerType;
      case 2: return !!data.primaryCategory;
      case 3: return !!data.businessName && !!data.phone;
      case 4: return data.locationType === 'mobile' ? data.serviceAreas.length > 0 : (!!data.city && !!data.state && !!data.zipCode);
      case 5: return true; // Hours are optional
      case 6: return data.services.length > 0;
      case 7: return true; // Photos are optional but encouraged
      case 8: return true; // Highlights are optional
      case 9: return !!data.shortBio;
      case 10: return true; // Review step
      default: return false;
    }
  };

  // Save progress to database
  const saveProgress = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // First, create or update the place
      const placeData = {
        name: data.businessName,
        phone: data.phone,
        email: data.email || user.email,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        description: data.fullDescription,
        short_description: data.shortBio,
        hours: data.hours,
        photos: data.workPhotos,
        cover_photo: data.coverPhoto,
        logo: data.profilePhoto,
        place_type: data.providerType,
        is_verified: false,
        updated_at: new Date().toISOString(),
      };

      // Check if place exists
      const { data: existingPro } = await supabase
        .from('pros')
        .select('place_id')
        .eq('user_id', user.id)
        .single();

      let placeId: string;

      if (existingPro?.place_id) {
        // Update existing place
        const { error: placeError } = await supabase
          .from('places')
          .update(placeData)
          .eq('id', existingPro.place_id);
        
        if (placeError) throw placeError;
        placeId = existingPro.place_id;
      } else {
        // Create new place
        const { data: newPlace, error: placeError } = await supabase
          .from('places')
          .insert({ ...placeData, created_at: new Date().toISOString() })
          .select('id')
          .single();
        
        if (placeError) throw placeError;
        placeId = newPlace.id;
      }

      // Now update or create the pro record
      const proData = {
        user_id: user.id,
        place_id: placeId,
        provider_type: data.providerType,
        specialties: [data.primaryCategory, ...data.secondaryCategories],
        services: data.services,
        service_areas: data.serviceAreas,
        service_radius: data.serviceRadius,
        year_established: data.yearEstablished ? parseInt(data.yearEstablished) : null,
        highlights: data.highlights,
        license_number: data.licenseNumber,
        license_state: data.licenseState,
        bio: data.shortBio,
        onboarding_step: data.currentStep,
        profile_completion: completion,
        onboarding_completed: data.currentStep === TOTAL_STEPS,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      const { error: proError } = await supabase
        .from('pros')
        .upsert(proData, { onConflict: 'user_id' });

      if (proError) throw proError;

    } catch (err) {
      console.error('Error saving progress:', err);
      // Try fallback to pro_providers table
      try {
        const fallbackData = {
          user_id: user.id,
          business_name: data.businessName,
          phone: data.phone,
          email: data.email || user.email,
          website: data.website,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          bio: data.shortBio,
          services: data.services,
          provider_type: data.providerType,
          specialties: [data.primaryCategory, ...data.secondaryCategories],
          onboarding_step: data.currentStep,
          is_active: true,
          updated_at: new Date().toISOString(),
        };
        await supabase.from('pro_providers').upsert(fallbackData, { onConflict: 'user_id' });
      } catch (fallbackErr) {
        console.error('Fallback save also failed:', fallbackErr);
        // Don't show error to user - just log it
      }
    } finally {
      setSaving(false);
    }
  };

  // Final submit
  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      await saveProgress();
      setLocation("/dashboard");
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError('Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Note: Auto-save removed to prevent keyboard focus issues on mobile
  // Progress is saved when user clicks Next or Complete

  // Progress bar component
  const ProgressHeader = () => (
    <div className="sticky top-0 z-50 px-4 py-3" style={{ backgroundColor: COLORS.backgroundAlt }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: COLORS.textMuted }}>
            Step {data.currentStep} of {TOTAL_STEPS}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: COLORS.teal }}>
              {completion}% Complete
            </span>
            {saving && <Loader2 className="h-4 w-4 animate-spin" style={{ color: COLORS.teal }} />}
          </div>
        </div>
        <Progress 
          value={(data.currentStep / TOTAL_STEPS) * 100} 
          className="h-2"
          style={{ backgroundColor: COLORS.border }}
        />
      </div>
    </div>
  );

  // Step 1: Provider Type
  const Step1ProviderType = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          What type of professional are you?
        </h1>
        <p style={{ color: COLORS.textMuted }}>
          Select the category that best describes your business
        </p>
      </div>

      <div className="grid gap-4">
        {PROVIDER_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = data.providerType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => updateData({ providerType: type.id, primaryCategory: '', secondaryCategories: [] })}
              className={`p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
              style={{
                backgroundColor: isSelected ? `${type.color}15` : COLORS.backgroundCard,
                borderColor: isSelected ? type.color : COLORS.border,
              }}
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${type.color}20` }}
              >
                <Icon className="h-7 w-7" style={{ color: type.color }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.text }}>
                  {type.name}
                </h3>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  {type.description}
                </p>
              </div>
              {isSelected && (
                <CheckCircle className="h-6 w-6" style={{ color: type.color }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Step 2: Category Selection
  const Step2Categories = () => {
    const categories = SERVICE_CATEGORIES[data.providerType] || [];
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
            What services do you offer?
          </h1>
          <p style={{ color: COLORS.textMuted }}>
            Select your primary category and up to 3 secondary categories
          </p>
        </div>

        <div className="space-y-4">
          <Label style={{ color: COLORS.textMuted }}>Primary Category *</Label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const isSelected = data.primaryCategory === cat.name;
              
              return (
                <button
                  key={cat.name}
                  onClick={() => updateData({ 
                    primaryCategory: cat.name,
                    secondaryCategories: data.secondaryCategories.filter(c => c !== cat.name)
                  })}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${COLORS.teal}15` : COLORS.backgroundCard,
                    borderColor: isSelected ? COLORS.teal : COLORS.border,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-medium" style={{ color: COLORS.text }}>
                      {cat.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {data.primaryCategory && (
          <div className="space-y-4 mt-8">
            <Label style={{ color: COLORS.textMuted }}>
              Secondary Categories (optional, up to 3)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {categories
                .filter(cat => cat.name !== data.primaryCategory)
                .map((cat) => {
                  const isSelected = data.secondaryCategories.includes(cat.name);
                  const canSelect = data.secondaryCategories.length < 3 || isSelected;
                  
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        if (isSelected) {
                          updateData({ 
                            secondaryCategories: data.secondaryCategories.filter(c => c !== cat.name)
                          });
                        } else if (canSelect) {
                          updateData({ 
                            secondaryCategories: [...data.secondaryCategories, cat.name]
                          });
                        }
                      }}
                      disabled={!canSelect}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        !canSelect ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${COLORS.gold}15` : COLORS.backgroundCard,
                        borderColor: isSelected ? COLORS.gold : COLORS.border,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="font-medium" style={{ color: COLORS.text }}>
                          {cat.name}
                        </span>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 ml-auto" style={{ color: COLORS.gold }} />
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Step 3: Business Info
  const Step3BusinessInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.teal}20` }}>
          <Building2 className="h-8 w-8" style={{ color: COLORS.teal }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Business Information
        </h1>
        <p style={{ color: COLORS.textMuted }}>
          Tell us about your business
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName" style={{ color: COLORS.textMuted }}>Business Name *</Label>
          <Input
            id="businessName"
            placeholder="ABC Plumbing Services"
            value={data.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
            style={{ 
              backgroundColor: COLORS.backgroundCard,
              borderColor: COLORS.border,
              color: COLORS.text
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" style={{ color: COLORS.textMuted }}>Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            style={{ 
              backgroundColor: COLORS.backgroundCard,
              borderColor: COLORS.border,
              color: COLORS.text
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" style={{ color: COLORS.textMuted }}>Business Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@yourbusiness.com"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            style={{ 
              backgroundColor: COLORS.backgroundCard,
              borderColor: COLORS.border,
              color: COLORS.text
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" style={{ color: COLORS.textMuted }}>Website (optional)</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yourbusiness.com"
            value={data.website}
            onChange={(e) => updateData({ website: e.target.value })}
            style={{ 
              backgroundColor: COLORS.backgroundCard,
              borderColor: COLORS.border,
              color: COLORS.text
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearEstablished" style={{ color: COLORS.textMuted }}>Year Established</Label>
          <Input
            id="yearEstablished"
            type="number"
            placeholder="2015"
            min="1900"
            max={new Date().getFullYear()}
            value={data.yearEstablished}
            onChange={(e) => updateData({ yearEstablished: e.target.value })}
            style={{ 
              backgroundColor: COLORS.backgroundCard,
              borderColor: COLORS.border,
              color: COLORS.text
            }}
          />
        </div>
      </div>
    </div>
  );

  // Step 4: Location & Service Area
  const Step4Location = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.green}20` }}>
          <MapPin className="h-8 w-8" style={{ color: COLORS.green }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Where do you provide services?
        </h1>
        <p style={{ color: COLORS.textMuted }}>
          Set your business location or service areas
        </p>
      </div>

      {/* Location Type Toggle */}
      <div className="flex gap-4 p-1 rounded-xl" style={{ backgroundColor: COLORS.backgroundCard }}>
        <button
          onClick={() => updateData({ locationType: 'fixed' })}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all`}
          style={{
            backgroundColor: data.locationType === 'fixed' ? COLORS.teal : 'transparent',
            color: data.locationType === 'fixed' ? 'black' : COLORS.textMuted
          }}
        >
          Fixed Location
        </button>
        <button
          onClick={() => updateData({ locationType: 'mobile' })}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all`}
          style={{
            backgroundColor: data.locationType === 'mobile' ? COLORS.teal : 'transparent',
            color: data.locationType === 'mobile' ? 'black' : COLORS.textMuted
          }}
        >
          Mobile / Travel to Customers
        </button>
      </div>

      {data.locationType === 'fixed' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" style={{ color: COLORS.textMuted }}>Street Address</Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              value={data.address}
              onChange={(e) => updateData({ address: e.target.value })}
              style={{ backgroundColor: COLORS.backgroundCard, borderColor: COLORS.border, color: COLORS.text }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" style={{ color: COLORS.textMuted }}>City *</Label>
              <Input
                id="city"
                placeholder="Miami"
                value={data.city}
                onChange={(e) => updateData({ city: e.target.value })}
                style={{ backgroundColor: COLORS.backgroundCard, borderColor: COLORS.border, color: COLORS.text }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" style={{ color: COLORS.textMuted }}>State *</Label>
              <Input
                id="state"
                placeholder="FL"
                value={data.state}
                onChange={(e) => updateData({ state: e.target.value })}
                style={{ backgroundColor: COLORS.backgroundCard, borderColor: COLORS.border, color: COLORS.text }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode" style={{ color: COLORS.textMuted }}>ZIP Code *</Label>
              <Input
                id="zipCode"
                placeholder="33101"
                value={data.zipCode}
                onChange={(e) => updateData({ zipCode: e.target.value })}
                style={{ backgroundColor: COLORS.backgroundCard, borderColor: COLORS.border, color: COLORS.text }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceRadius" style={{ color: COLORS.textMuted }}>Service Radius (miles)</Label>
              <Input
                id="serviceRadius"
                type="number"
                placeholder="25"
                value={data.serviceRadius}
                onChange={(e) => updateData({ serviceRadius: parseInt(e.target.value) || 25 })}
                style={{ backgroundColor: COLORS.backgroundCard, borderColor: COLORS.border, color: COLORS.text }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Label style={{ color: COLORS.textMuted }}>Service Areas *</Label>
          <p className="text-sm" style={{ color: COLORS.textDim }}>
            Add cities or zip codes where you provide services
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter city or zip code"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value && !data.serviceAreas.includes(value)) {
                    updateData({ serviceAreas: [...data.serviceAreas, value] });
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
              style={{ backgroundColor: COLORS.backgroundCard, borderColor: COLORS.border, color: COLORS.text }}
            />
            <Button
              type="button"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Enter city or zip code"]') as HTMLInputElement;
                const value = input?.value.trim();
                if (value && !data.serviceAreas.includes(value)) {
                  updateData({ serviceAreas: [...data.serviceAreas, value] });
                  input.value = '';
                }
              }}
              style={{ backgroundColor: COLORS.teal, color: 'black' }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.serviceAreas.map((area, idx) => (
              <Badge
                key={idx}
                className="px-3 py-1 flex items-center gap-2"
                style={{ backgroundColor: `${COLORS.teal}20`, color: COLORS.teal }}
              >
                {area}
                <button onClick={() => updateData({ serviceAreas: data.serviceAreas.filter((_, i) => i !== idx) })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Step 5: Hours of Operation
  const Step5Hours = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.gold}20` }}>
          <Clock className="h-8 w-8" style={{ color: COLORS.gold }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Hours of Operation
        </h1>
        <p style={{ color: COLORS.textMuted }}>
          When are you available for customers?
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: COLORS.backgroundCard }}>
        <Checkbox
          checked={data.byAppointmentOnly}
          onCheckedChange={(checked) => updateData({ byAppointmentOnly: checked as boolean })}
        />
        <Label style={{ color: COLORS.text }}>By Appointment Only</Label>
      </div>

      {!data.byAppointmentOnly && (
        <div className="space-y-3">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: COLORS.backgroundCard }}
            >
              <Checkbox
                checked={!data.hours[day]?.closed}
                onCheckedChange={(checked) => updateData({
                  hours: { ...data.hours, [day]: { ...data.hours[day], closed: !checked } }
                })}
              />
              <span className="w-24 font-medium" style={{ color: COLORS.text }}>{day}</span>
              {!data.hours[day]?.closed ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={data.hours[day]?.open || '09:00'}
                    onChange={(e) => updateData({
                      hours: { ...data.hours, [day]: { ...data.hours[day], open: e.target.value } }
                    })}
                    className="w-32"
                    style={{ backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }}
                  />
                  <span style={{ color: COLORS.textMuted }}>to</span>
                  <Input
                    type="time"
                    value={data.hours[day]?.close || '17:00'}
                    onChange={(e) => updateData({
                      hours: { ...data.hours, [day]: { ...data.hours[day], close: e.target.value } }
                    })}
                    className="w-32"
                    style={{ backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }}
                  />
                </div>
              ) : (
                <span style={{ color: COLORS.textDim }}>Closed</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Step 6: Services
  const Step6Services = () => {
    const [newService, setNewService] = useState({ name: '', description: '', priceType: 'quote', priceMin: '', priceMax: '' });

    const addService = () => {
      if (newService.name.trim()) {
        updateData({ services: [...data.services, newService] });
        setNewService({ name: '', description: '', priceType: 'quote', priceMin: '', priceMax: '' });
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.teal}20` }}>
            <Briefcase className="h-8 w-8" style={{ color: COLORS.teal }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
            Services You Offer
          </h1>
          <p style={{ color: COLORS.textMuted }}>
            Add at least 3 services to help customers find you
          </p>
        </div>

        {/* Existing Services */}
        {data.services.length > 0 && (
          <div className="space-y-3">
            {data.services.map((service, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl flex items-center justify-between"
                style={{ backgroundColor: COLORS.backgroundCard }}
              >
                <div>
                  <h4 className="font-medium" style={{ color: COLORS.text }}>{service.name}</h4>
                  {service.description && (
                    <p className="text-sm" style={{ color: COLORS.textMuted }}>{service.description}</p>
                  )}
                  <p className="text-sm" style={{ color: COLORS.teal }}>
                    {service.priceType === 'quote' ? 'Quote' : 
                     service.priceType === 'fixed' ? `$${service.priceMin}` :
                     `$${service.priceMin} - $${service.priceMax}`}
                  </p>
                </div>
                <button
                  onClick={() => updateData({ services: data.services.filter((_, i) => i !== idx) })}
                  style={{ color: COLORS.red }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Service */}
        <div className="p-4 rounded-xl space-y-4" style={{ backgroundColor: COLORS.backgroundCard, border: `1px dashed ${COLORS.border}` }}>
          <Input
            placeholder="Service name (e.g., Drain Cleaning)"
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            style={{ backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }}
          />
          <Textarea
            placeholder="Brief description (optional)"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            rows={2}
            style={{ backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }}
          />
          <div className="flex gap-2">
            <select
              value={newService.priceType}
              onChange={(e) => setNewService({ ...newService, priceType: e.target.value })}
              className="px-3 py-2 rounded-md"
              style={{ backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
            >
              <option value="quote">Request Quote</option>
              <option value="fixed">Fixed Price</option>
              <option value="range">Price Range</option>
            </select>
            {newService.priceType !== 'quote' && (
              <>
                <Input
                  type="number"
                  placeholder={newService.priceType === 'fixed' ? 'Price' : 'Min'}
                  value={newService.priceMin}
                  onChange={(e) => setNewService({ ...newService, priceMin: e.target.value })}
                  className="w-24"
                  style={{ backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }}
                />
                {newService.priceType === 'range' && (
                  <Input
                    type="number"
                    placeholder="Max"
                    value={newService.priceMax}
                    onChange={(e) => setNewService({ ...newService, priceMax: e.target.value })}
                    className="w-24"
                    style={{ backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }}
                  />
                )}
              </>
            )}
          </div>
          <Button
            onClick={addService}
            disabled={!newService.name.trim()}
            className="w-full gap-2"
            style={{ backgroundColor: COLORS.teal, color: 'black' }}
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>

        {data.services.length < 3 && (
          <p className="text-sm text-center" style={{ color: COLORS.gold }}>
            Add {3 - data.services.length} more service{3 - data.services.length > 1 ? 's' : ''} to improve your profile
          </p>
        )}
      </div>
    );
  };

  // Step 7: Photos & Media
  const Step7Photos = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.gold}20` }}>
          <Camera className="h-8 w-8" style={{ color: COLORS.gold }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Photos & Media
        </h1>
        <p style={{ color: COLORS.textMuted }}>
          Profiles with photos get 3x more views
        </p>
      </div>

      {/* Profile Photo */}
      <div className="space-y-3">
        <Label style={{ color: COLORS.textMuted }}>Profile Photo</Label>
        <div
          className="w-32 h-32 rounded-full mx-auto flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: COLORS.backgroundCard, border: `2px dashed ${COLORS.border}` }}
        >
          {data.profilePhoto ? (
            <img src={data.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="text-center">
              <User className="h-8 w-8 mx-auto mb-1" style={{ color: COLORS.textDim }} />
              <span className="text-xs" style={{ color: COLORS.textDim }}>Add Photo</span>
            </div>
          )}
        </div>
      </div>

      {/* Cover Photo */}
      <div className="space-y-3">
        <Label style={{ color: COLORS.textMuted }}>Cover Photo</Label>
        <div
          className="h-40 rounded-xl flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: COLORS.backgroundCard, border: `2px dashed ${COLORS.border}` }}
        >
          {data.coverPhoto ? (
            <img src={data.coverPhoto} alt="Cover" className="w-full h-full rounded-xl object-cover" />
          ) : (
            <div className="text-center">
              <ImageIcon className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.textDim }} />
              <span className="text-sm" style={{ color: COLORS.textDim }}>Add Cover Photo</span>
            </div>
          )}
        </div>
      </div>

      {/* Work Photos */}
      <div className="space-y-3">
        <Label style={{ color: COLORS.textMuted }}>Work Photos (Before/After, Portfolio)</Label>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="aspect-square rounded-xl flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              style={{ backgroundColor: COLORS.backgroundCard, border: `2px dashed ${COLORS.border}` }}
            >
              {data.workPhotos[idx] ? (
                <img src={data.workPhotos[idx]} alt={`Work ${idx + 1}`} className="w-full h-full rounded-xl object-cover" />
              ) : (
                <Plus className="h-6 w-6" style={{ color: COLORS.textDim }} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-center" style={{ color: COLORS.textDim }}>
          Click to upload photos (feature coming soon)
        </p>
      </div>
    </div>
  );

  // Step 8: Business Highlights
  const Step8Highlights = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.green}20` }}>
          <Award className="h-8 w-8" style={{ color: COLORS.green }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Business Highlights
        </h1>
        <p style={{ color: COLORS.textMuted }}>
          Show customers what makes you stand out
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {BUSINESS_HIGHLIGHTS.map((highlight) => {
          const Icon = highlight.icon;
          const isSelected = data.highlights.includes(highlight.id);
          
          return (
            <button
              key={highlight.id}
              onClick={() => {
                if (isSelected) {
                  updateData({ highlights: data.highlights.filter(h => h !== highlight.id) });
                } else {
                  updateData({ highlights: [...data.highlights, highlight.id] });
                }
              }}
              className={`p-4 rounded-xl border transition-all text-left`}
              style={{
                backgroundColor: isSelected ? `${COLORS.green}15` : COLORS.backgroundCard,
                borderColor: isSelected ? COLORS.green : COLORS.border,
              }}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" style={{ color: isSelected ? COLORS.green : COLORS.textDim }} />
                <div>
                  <span className="font-medium block" style={{ color: COLORS.text }}>{highlight.label}</span>
                  <span className="text-xs" style={{ color: COLORS.textDim }}>{highlight.description}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {data.highlights.includes('licensed') && (
        <div className="space-y-4 p-4 rounded-xl" style={{ backgroundColor: COLORS.backgroundCard }}>
          <h4 className="font-medium" style={{ color: COLORS.text }}>License Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label style={{ color: COLORS.textMuted }}>License Number</Label>
              <Input
                placeholder="ABC123456"
                value={data.licenseNumber}
                onChange={(e) => updateData({ licenseNumber: e.target.value })}
                style={{ backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }}
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: COLORS.textMuted }}>State</Label>
              <Input
                placeholder="FL"
                value={data.licenseState}
                onChange={(e) => updateData({ licenseState: e.target.value })}
                style={{ backgroundColor: COLORS.background, borderColor: COLORS.border, color: COLORS.text }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Step 9: Bio & Description
  const Step9Bio = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.teal}20` }}>
          <FileText className="h-8 w-8" style={{ color: COLORS.teal }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
          Tell Your Story
        </h1>
        <p style={{ color: COLORS.textMuted }}>
          Help customers get to know you
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label style={{ color: COLORS.textMuted }}>Short Bio * (displayed in search results)</Label>
          <Textarea
            placeholder="Family-owned plumbing business serving Miami for 20+ years. Licensed, insured, and committed to quality."
            value={data.shortBio}
            onChange={(e) => updateData({ shortBio: e.target.value })}
            rows={3}
            maxLength={200}
            style={{ backgroundColor: COLORS.backgroundCard, borderColor: COLORS.border, color: COLORS.text }}
          />
          <p className="text-xs text-right" style={{ color: COLORS.textDim }}>
            {data.shortBio.length}/200 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label style={{ color: COLORS.textMuted }}>Full Description (displayed on your profile)</Label>
          <Textarea
            placeholder="Tell customers more about your business, your experience, what makes you different, and why they should choose you..."
            value={data.fullDescription}
            onChange={(e) => updateData({ fullDescription: e.target.value })}
            rows={6}
            style={{ backgroundColor: COLORS.backgroundCard, borderColor: COLORS.border, color: COLORS.text }}
          />
        </div>
      </div>
    </div>
  );

  // Step 10: Review & Complete
  const Step10Review = () => {
    const getMissingItems = () => {
      const missing = [];
      if (!data.profilePhoto) missing.push({ item: 'Profile Photo', impact: 'high', tip: 'Profiles with photos get 3x more views' });
      if (!data.coverPhoto) missing.push({ item: 'Cover Photo', impact: 'medium', tip: 'Make your profile stand out' });
      if (data.workPhotos.length < 3) missing.push({ item: 'Work Photos', impact: 'high', tip: `Add ${3 - data.workPhotos.length} more photos to showcase your work` });
      if (data.services.length < 3) missing.push({ item: 'Services', impact: 'high', tip: `Add ${3 - data.services.length} more services to appear in more searches` });
      if (data.highlights.length === 0) missing.push({ item: 'Business Highlights', impact: 'medium', tip: 'Show badges like Licensed, Insured, etc.' });
      if (!data.website) missing.push({ item: 'Website', impact: 'low', tip: 'Add your website for credibility' });
      if (!data.fullDescription) missing.push({ item: 'Full Description', impact: 'medium', tip: 'Tell customers more about your business' });
      return missing;
    };

    const missingItems = getMissingItems();

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ 
            background: `conic-gradient(${COLORS.teal} ${completion}%, ${COLORS.border} ${completion}%)`
          }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
              <span className="text-2xl font-bold" style={{ color: COLORS.teal }}>{completion}%</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
            {completion >= 80 ? 'Great Job!' : completion >= 50 ? 'Almost There!' : 'Good Start!'}
          </h1>
          <p style={{ color: COLORS.textMuted }}>
            Your profile is {completion}% complete
          </p>
        </div>

        {/* Profile Summary */}
        <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.backgroundCard }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.text }}>Profile Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ color: COLORS.textMuted }}>Business Name</span>
              <span style={{ color: COLORS.text }}>{data.businessName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: COLORS.textMuted }}>Category</span>
              <span style={{ color: COLORS.text }}>{data.primaryCategory || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: COLORS.textMuted }}>Location</span>
              <span style={{ color: COLORS.text }}>{data.city && data.state ? `${data.city}, ${data.state}` : data.serviceAreas.join(', ') || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: COLORS.textMuted }}>Services</span>
              <span style={{ color: COLORS.text }}>{data.services.length} added</span>
            </div>
          </div>
        </div>

        {/* Missing Items */}
        {missingItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold" style={{ color: COLORS.gold }}>Improve Your Profile</h3>
            {missingItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl flex items-center gap-3"
                style={{ backgroundColor: `${item.impact === 'high' ? COLORS.gold : COLORS.teal}10` }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.impact === 'high' ? COLORS.gold : item.impact === 'medium' ? COLORS.teal : COLORS.textDim }}
                />
                <div className="flex-1">
                  <span className="font-medium" style={{ color: COLORS.text }}>{item.item}</span>
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>{item.tip}</p>
                </div>
                <ChevronRight className="h-5 w-5" style={{ color: COLORS.textDim }} />
              </div>
            ))}
          </div>
        )}

        {completion >= 80 && (
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: `${COLORS.green}15` }}>
            <Sparkles className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.green }} />
            <p className="font-medium" style={{ color: COLORS.green }}>
              Your profile is ready to attract customers!
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (data.currentStep) {
      case 1: return <Step1ProviderType />;
      case 2: return <Step2Categories />;
      case 3: return <Step3BusinessInfo />;
      case 4: return <Step4Location />;
      case 5: return <Step5Hours />;
      case 6: return <Step6Services />;
      case 7: return <Step7Photos />;
      case 8: return <Step8Highlights />;
      case 9: return <Step9Bio />;
      case 10: return <Step10Review />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
      <ProgressHeader />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={data.currentStep === 1}
            className="gap-2"
            style={{ 
              borderColor: COLORS.border,
              color: COLORS.textMuted,
              backgroundColor: 'transparent'
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {data.currentStep < TOTAL_STEPS ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed() || loading}
              className="gap-2"
              style={{ 
                background: canProceed() 
                  ? `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.gold} 100%)`
                  : COLORS.border,
                color: canProceed() ? 'black' : COLORS.textDim
              }}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.teal} 0%, ${COLORS.gold} 100%)`,
                color: 'black'
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
