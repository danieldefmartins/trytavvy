import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { 
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Palette,
  Eye,
  Save,
  Share2,
  QrCode,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  Star,
  Globe,
  Instagram,
  Facebook,
  Briefcase,
  Check,
  X,
  ChevronDown,
  Loader2,
  ExternalLink,
  Copy
} from "lucide-react";
import { useLocation } from "wouter";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://scasgwrikoqdwlwlwcff.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYXNnd3Jpa29xZHdsd2x3Y2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODUxODEsImV4cCI6MjA4MjU2MTE4MX0.83ARHv2Zj6oJpbojPCIT0ljL8Ze2JqMBztLVueGXXhs";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Predefined gradient presets
const GRADIENT_PRESETS = [
  { id: 'purple-indigo', name: 'Purple Indigo', colors: ['#8B5CF6', '#6366F1'], preview: 'linear-gradient(135deg, #8B5CF6, #6366F1)' },
  { id: 'blue-cyan', name: 'Ocean Blue', colors: ['#3B82F6', '#06B6D4'], preview: 'linear-gradient(135deg, #3B82F6, #06B6D4)' },
  { id: 'orange-red', name: 'Sunset', colors: ['#F97316', '#EF4444'], preview: 'linear-gradient(135deg, #F97316, #EF4444)' },
  { id: 'green-teal', name: 'Forest', colors: ['#22C55E', '#14B8A6'], preview: 'linear-gradient(135deg, #22C55E, #14B8A6)' },
  { id: 'pink-purple', name: 'Berry', colors: ['#EC4899', '#8B5CF6'], preview: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
  { id: 'teal-blue', name: 'Aqua', colors: ['#14B8A6', '#3B82F6'], preview: 'linear-gradient(135deg, #14B8A6, #3B82F6)' },
  { id: 'amber-orange', name: 'Golden', colors: ['#F59E0B', '#F97316'], preview: 'linear-gradient(135deg, #F59E0B, #F97316)' },
  { id: 'slate-gray', name: 'Professional', colors: ['#475569', '#1E293B'], preview: 'linear-gradient(135deg, #475569, #1E293B)' },
];

// Available tabs for the card
const AVAILABLE_TABS = [
  { id: 'contact', name: 'Contact', icon: Phone, description: 'Call, Text, Email buttons' },
  { id: 'services', name: 'Services', icon: Briefcase, description: 'List your services' },
  { id: 'portfolio', name: 'Portfolio', icon: ImageIcon, description: 'Show your work' },
  { id: 'reviews', name: 'Reviews', icon: Star, description: 'Display customer reviews' },
  { id: 'about', name: 'About', icon: FileText, description: 'About your business' },
];

// Social media options
const SOCIAL_OPTIONS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: 'username (without @)' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, placeholder: 'page name or URL' },
  { id: 'website', name: 'Website', icon: Globe, placeholder: 'www.yourwebsite.com' },
  { id: 'tiktok', name: 'TikTok', icon: Globe, placeholder: '@username' },
];

interface CardData {
  id?: string;
  slug: string;
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  category: string;
  profilePhoto: string | null;
  logoPhoto: string | null;
  gradientColor1: string;
  gradientColor2: string;
  enabledTabs: string[];
  socialLinks: { [key: string]: string };
  services: string[];
  aboutText: string;
  isPublished: boolean;
}

// Generate slug from company name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
};

export default function DigitalCardEditor() {
  const [, setLocation] = useLocation();
  const { user } = useSupabaseAuth();
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const logoPhotoRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [cardExists, setCardExists] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [cardData, setCardData] = useState<CardData>({
    slug: '',
    companyName: '',
    tagline: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    category: '',
    profilePhoto: null,
    logoPhoto: null,
    gradientColor1: '#8B5CF6',
    gradientColor2: '#6366F1',
    enabledTabs: ['contact', 'services'],
    socialLinks: {
      instagram: '',
      facebook: '',
      website: '',
      tiktok: '',
    },
    services: [],
    aboutText: '',
    isPublished: false,
  });

  const [activePreviewTab, setActivePreviewTab] = useState('contact');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newService, setNewService] = useState('');

  // Load existing card data on mount
  useEffect(() => {
    const loadCardData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('pro_cards')
          .select('*')
          .eq('pro_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading card:', error);
        }

        if (data) {
          setCardExists(true);
          setCardData({
            id: data.id,
            slug: data.slug || '',
            companyName: data.company_name || '',
            tagline: data.tagline || '',
            phone: data.phone || '',
            email: data.email || '',
            city: data.city || '',
            state: data.state || '',
            category: data.category || '',
            profilePhoto: data.profile_photo_url || null,
            logoPhoto: data.logo_url || null,
            gradientColor1: data.gradient_color_1 || '#8B5CF6',
            gradientColor2: data.gradient_color_2 || '#6366F1',
            enabledTabs: data.enabled_tabs || ['contact', 'services'],
            socialLinks: {
              instagram: data.social_instagram || '',
              facebook: data.social_facebook || '',
              website: data.social_website || '',
              tiktok: data.social_tiktok || '',
            },
            services: data.services || [],
            aboutText: data.about_text || '',
            isPublished: data.is_published || false,
          });
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCardData();
  }, [user?.id]);

  // Auto-generate slug when company name changes
  useEffect(() => {
    if (!cardExists && cardData.companyName) {
      setCardData(prev => ({
        ...prev,
        slug: generateSlug(prev.companyName)
      }));
    }
  }, [cardData.companyName, cardExists]);

  // Get current gradient
  const getCurrentGradient = () => {
    return `linear-gradient(135deg, ${cardData.gradientColor1}, ${cardData.gradientColor2})`;
  };

  // Handle photo upload
  const handlePhotoUpload = (type: 'profile' | 'logo') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      // For now, convert to base64 (in production, upload to Supabase Storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardData(prev => ({
          ...prev,
          [type === 'profile' ? 'profilePhoto' : 'logoPhoto']: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  // Toggle tab
  const toggleTab = (tabId: string) => {
    setCardData(prev => {
      const isEnabled = prev.enabledTabs.includes(tabId);
      if (isEnabled && prev.enabledTabs.length <= 1) {
        return prev; // Keep at least one tab
      }
      return {
        ...prev,
        enabledTabs: isEnabled 
          ? prev.enabledTabs.filter(t => t !== tabId)
          : [...prev.enabledTabs, tabId].slice(0, 2) // Max 2 tabs
      };
    });
  };

  // Update social link
  const updateSocialLink = (id: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [id]: value }
    }));
  };

  // Add service
  const addService = () => {
    if (newService.trim() && cardData.services.length < 10) {
      setCardData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  // Remove service
  const removeService = (index: number) => {
    setCardData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  // Apply gradient preset
  const applyGradientPreset = (preset: typeof GRADIENT_PRESETS[0]) => {
    setCardData(prev => ({
      ...prev,
      gradientColor1: preset.colors[0],
      gradientColor2: preset.colors[1]
    }));
  };

  // Save card to database
  const handleSave = async () => {
    if (!user?.id) {
      setSaveMessage({ type: 'error', text: 'You must be logged in to save' });
      return;
    }

    if (!cardData.companyName.trim()) {
      setSaveMessage({ type: 'error', text: 'Company name is required' });
      return;
    }

    if (!cardData.slug.trim()) {
      setSaveMessage({ type: 'error', text: 'Card URL slug is required' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const cardPayload = {
        pro_id: user.id,
        slug: cardData.slug,
        company_name: cardData.companyName,
        tagline: cardData.tagline,
        phone: cardData.phone,
        email: cardData.email,
        city: cardData.city,
        state: cardData.state,
        category: cardData.category,
        gradient_color_1: cardData.gradientColor1,
        gradient_color_2: cardData.gradientColor2,
        profile_photo_url: cardData.profilePhoto,
        logo_url: cardData.logoPhoto,
        enabled_tabs: cardData.enabledTabs,
        services: cardData.services,
        social_instagram: cardData.socialLinks.instagram,
        social_facebook: cardData.socialLinks.facebook,
        social_website: cardData.socialLinks.website,
        social_tiktok: cardData.socialLinks.tiktok,
        about_text: cardData.aboutText,
        is_published: cardData.isPublished,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (cardExists && cardData.id) {
        // Update existing card
        result = await supabase
          .from('pro_cards')
          .update(cardPayload)
          .eq('id', cardData.id)
          .select()
          .single();
      } else {
        // Create new card
        result = await supabase
          .from('pro_cards')
          .insert(cardPayload)
          .select()
          .single();
      }

      if (result.error) {
        if (result.error.code === '23505') {
          setSaveMessage({ type: 'error', text: 'This URL slug is already taken. Please choose another.' });
        } else {
          throw result.error;
        }
      } else {
        setCardExists(true);
        setCardData(prev => ({ ...prev, id: result.data.id }));
        setSaveMessage({ type: 'success', text: 'Card saved successfully!' });
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save card' });
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle publish status
  const togglePublish = async () => {
    const newStatus = !cardData.isPublished;
    setCardData(prev => ({ ...prev, isPublished: newStatus }));
    
    if (cardExists && cardData.id) {
      await supabase
        .from('pro_cards')
        .update({ is_published: newStatus })
        .eq('id', cardData.id);
    }
  };

  // Copy card URL
  const copyCardUrl = () => {
    const url = `${window.location.origin}/pro/${cardData.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get card URL
  const getCardUrl = () => `${window.location.origin}/pro/${cardData.slug}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f7f2] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f7f2]">
      {/* Header */}
      <header className="bg-[#0f172a] text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={() => setLocation('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <img src="/logo-horizontal.png" alt="Tavvy" className="h-8" />
              <span className="text-orange-500 font-semibold">Digital Card</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {cardData.slug && (
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => window.open(getCardUrl(), '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live
              </Button>
            )}
            <Button 
              size="sm" 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Card'}
            </Button>
          </div>
        </div>
      </header>

      {/* Save Message */}
      {saveMessage && (
        <div className={`py-2 px-4 text-center text-sm ${
          saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {saveMessage.text}
        </div>
      )}

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Card URL & Publish Status */}
            <Card>
              <CardHeader>
                <CardTitle>Card Settings</CardTitle>
                <CardDescription>Your card URL and visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug">Card URL</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1 flex items-center bg-gray-100 rounded-md px-3 text-sm text-gray-600">
                      <span className="truncate">{window.location.origin}/pro/</span>
                    </div>
                    <Input 
                      id="slug"
                      value={cardData.slug}
                      onChange={(e) => setCardData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                      className="flex-1"
                      placeholder="your-business-name"
                    />
                    <Button variant="outline" size="icon" onClick={copyCardUrl}>
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Publish Card</Label>
                    <p className="text-sm text-gray-500">Make your card visible to everyone</p>
                  </div>
                  <Switch 
                    checked={cardData.isPublished}
                    onCheckedChange={togglePublish}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your business details shown on the card</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input 
                      id="companyName"
                      value={cardData.companyName}
                      onChange={(e) => setCardData(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Martinez Plumbing"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category"
                      value={cardData.category}
                      onChange={(e) => setCardData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Plumber"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input 
                    id="tagline"
                    value={cardData.tagline}
                    onChange={(e) => setCardData(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Your Trusted Local Plumber"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone"
                      value={cardData.phone}
                      onChange={(e) => setCardData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={cardData.email}
                      onChange={(e) => setCardData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@business.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      value={cardData.city}
                      onChange={(e) => setCardData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Orlando"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state"
                      value={cardData.state}
                      onChange={(e) => setCardData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="FL"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
                <CardDescription>Add your profile photo and logo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Profile Photo</Label>
                    <input
                      type="file"
                      ref={profilePhotoRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload('profile')}
                    />
                    <div 
                      className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => profilePhotoRef.current?.click()}
                    >
                      {cardData.profilePhoto ? (
                        <img 
                          src={cardData.profilePhoto} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full mx-auto object-cover"
                        />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">Click to upload</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Logo</Label>
                    <input
                      type="file"
                      ref={logoPhotoRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload('logo')}
                    />
                    <div 
                      className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => logoPhotoRef.current?.click()}
                    >
                      {cardData.logoPhoto ? (
                        <img 
                          src={cardData.logoPhoto} 
                          alt="Logo" 
                          className="w-20 h-20 mx-auto object-contain"
                        />
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">Click to upload</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Card Colors</CardTitle>
                <CardDescription>Choose your card's gradient colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENT_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      className={`h-12 rounded-lg transition-all ${
                        cardData.gradientColor1 === preset.colors[0] && cardData.gradientColor2 === preset.colors[1]
                          ? 'ring-2 ring-orange-500 ring-offset-2'
                          : ''
                      }`}
                      style={{ background: preset.preview }}
                      onClick={() => applyGradientPreset(preset)}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={cardData.gradientColor1}
                        onChange={(e) => setCardData(prev => ({ ...prev, gradientColor1: e.target.value }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input 
                        value={cardData.gradientColor1}
                        onChange={(e) => setCardData(prev => ({ ...prev, gradientColor1: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={cardData.gradientColor2}
                        onChange={(e) => setCardData(prev => ({ ...prev, gradientColor2: e.target.value }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input 
                        value={cardData.gradientColor2}
                        onChange={(e) => setCardData(prev => ({ ...prev, gradientColor2: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Card Tabs</CardTitle>
                <CardDescription>Choose which tabs to show (max 2)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {AVAILABLE_TABS.map(tab => {
                    const Icon = tab.icon;
                    const isEnabled = cardData.enabledTabs.includes(tab.id);
                    return (
                      <div 
                        key={tab.id}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          isEnabled ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => toggleTab(tab.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${isEnabled ? 'text-orange-500' : 'text-gray-400'}`} />
                          <div>
                            <p className="font-medium">{tab.name}</p>
                            <p className="text-sm text-gray-500">{tab.description}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isEnabled ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                        }`}>
                          {isEnabled && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>List the services you offer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Add a service..."
                    onKeyPress={(e) => e.key === 'Enter' && addService()}
                  />
                  <Button onClick={addService} disabled={!newService.trim()}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cardData.services.map((service, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{service}</span>
                      <button 
                        onClick={() => removeService(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Add your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {SOCIAL_OPTIONS.map(social => {
                  const Icon = social.icon;
                  return (
                    <div key={social.id} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <Input 
                        value={cardData.socialLinks[social.id] || ''}
                        onChange={(e) => updateSocialLink(social.id, e.target.value)}
                        placeholder={social.placeholder}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>Tell customers about your business</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={cardData.aboutText}
                  onChange={(e) => setCardData(prev => ({ ...prev, aboutText: e.target.value }))}
                  placeholder="Write a brief description of your business..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your card will look</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Phone Frame */}
                <div className="mx-auto max-w-[320px] bg-black rounded-[40px] p-3 shadow-xl">
                  <div className="bg-white rounded-[32px] overflow-hidden">
                    {/* Gradient Header */}
                    <div 
                      className="p-6 text-center text-white"
                      style={{ background: getCurrentGradient() }}
                    >
                      {/* Tavvy Badge */}
                      <div className="flex justify-end mb-2">
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Tavvy Pro</span>
                      </div>
                      
                      {/* Profile Photo */}
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full border-4 border-white/30 overflow-hidden bg-white/20">
                        {cardData.profilePhoto ? (
                          <img src={cardData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-3xl">👤</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Company Info */}
                      <h3 className="font-bold text-lg">{cardData.companyName || 'Company Name'}</h3>
                      <p className="text-sm opacity-80">{cardData.tagline || 'Your tagline here'}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {cardData.category || 'Category'} • {cardData.city || 'City'}{cardData.state ? `, ${cardData.state}` : ''}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      {/* Tabs */}
                      <div className="flex gap-2 mb-4">
                        {cardData.enabledTabs.map(tabId => {
                          const tab = AVAILABLE_TABS.find(t => t.id === tabId);
                          if (!tab) return null;
                          return (
                            <button
                              key={tabId}
                              className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-colors ${
                                activePreviewTab === tabId 
                                  ? 'text-white' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                              style={activePreviewTab === tabId ? { background: cardData.gradientColor1 } : {}}
                              onClick={() => setActivePreviewTab(tabId)}
                            >
                              {tab.name}
                            </button>
                          );
                        })}
                      </div>

                      {/* Tab Content */}
                      <div className="space-y-2">
                        {activePreviewTab === 'contact' && (
                          <>
                            <button className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm flex items-center justify-center gap-2">
                              <Phone className="h-4 w-4" /> Call Now
                            </button>
                            <button className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm flex items-center justify-center gap-2">
                              <MessageSquare className="h-4 w-4" /> Send Text
                            </button>
                            <button className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm flex items-center justify-center gap-2">
                              <Mail className="h-4 w-4" /> Email
                            </button>
                            <button className="w-full py-2.5 bg-gray-900 text-white rounded-full text-sm flex items-center justify-center gap-2">
                              <FileText className="h-4 w-4" /> Request Quote
                            </button>
                          </>
                        )}
                        {activePreviewTab === 'services' && (
                          <div className="space-y-2">
                            {cardData.services.length > 0 ? (
                              cardData.services.map((service, i) => (
                                <div key={i} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm">{service}</span>
                                  <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-gray-400 text-sm py-4">No services added yet</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
                        {cardData.socialLinks.instagram && (
                          <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center">
                            <Instagram className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {cardData.socialLinks.facebook && (
                          <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center">
                            <Facebook className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {cardData.socialLinks.website && (
                          <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center">
                            <Globe className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">T</span>
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 py-2.5 border-2 border-gray-300 rounded-full text-sm flex items-center justify-center gap-2">
                          <Share2 className="h-4 w-4" /> Share
                        </button>
                        <button 
                          className="flex-1 py-2.5 text-white rounded-full text-sm flex items-center justify-center gap-2"
                          style={{ background: cardData.gradientColor1 }}
                        >
                          <Save className="h-4 w-4" /> Save Contact
                        </button>
                        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <QrCode className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
