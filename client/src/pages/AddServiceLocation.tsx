import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { 
  ArrowLeft,
  MapPin, 
  Loader2, 
  Plus,
  ChevronDown,
  ChevronUp,
  Building2,
  Phone,
  Globe,
  Mail,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Category definitions with icons - focused on service businesses
const CATEGORIES = [
  { slug: 'automotive', name: 'Automotive', icon: '🚗' },
  { slug: 'beauty', name: 'Beauty & Personal Care', icon: '💅' },
  { slug: 'business', name: 'Business Services', icon: '💼' },
  { slug: 'education', name: 'Education', icon: '📚' },
  { slug: 'financial', name: 'Financial Services', icon: '🏦' },
  { slug: 'fitness', name: 'Fitness & Sports', icon: '🏋️' },
  { slug: 'health', name: 'Health & Medical', icon: '🏥' },
  { slug: 'home', name: 'Home Services', icon: '🏠' },
  { slug: 'legal', name: 'Legal Services', icon: '⚖️' },
  { slug: 'pets', name: 'Pets & Animals', icon: '🐾' },
  { slug: 'professional', name: 'Professional Services', icon: '👔' },
  { slug: 'real_estate', name: 'Real Estate', icon: '🏘️' },
  { slug: 'other', name: 'Other', icon: '📍' },
];

// Initial form state
const initialFormState = {
  name: "",
  tavvy_category: "",
  description: "",
  address: "",
  city: "",
  region: "",
  postcode: "",
  country: "US",
  phone: "",
  email: "",
  website: "",
  hours_display: "",
};

export default function AddServiceLocation() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState(initialFormState);
  const [showOptional, setShowOptional] = useState(false);
  
  // Create place mutation
  const createPlace = trpc.places.create.useMutation({
    onSuccess: (data) => {
      toast.success(`"${data.name}" has been added successfully!`);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create location");
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Please enter a name for this location.");
      return;
    }
    
    if (!formData.tavvy_category) {
      toast.error("Please select a category.");
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: formData.name.trim(),
      tavvy_category: formData.tavvy_category,
      description: formData.description || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      region: formData.region || undefined,
      postcode: formData.postcode || undefined,
      country: formData.country || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      website: formData.website || undefined,
      hours_display: formData.hours_display || undefined,
    };

    createPlace.mutate(submitData);
  };

  const selectedCategory = CATEGORIES.find(c => c.slug === formData.tavvy_category);

  return (
    <div className="min-h-screen bg-[#f9f7f2]">
      {/* Header */}
      <header className="bg-[#0f172a] text-white py-4 px-6">
        <div className="container mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img src="/logo-horizontal.png" alt="Tavvy" className="h-8" />
            <span className="text-orange-500 font-semibold">Pros</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Service Location</h1>
          <p className="text-gray-600 mt-1">Add a new location where you provide services</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Required Fields Card */}
          <Card className="mb-6 border-0 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-orange-500" />
                Basic Information
              </CardTitle>
              <CardDescription>Tell us about your service location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Service Category *</Label>
                <Select
                  value={formData.tavvy_category}
                  onValueChange={(value) => handleInputChange("tavvy_category", value)}
                >
                  <SelectTrigger id="category" className="bg-white">
                    <SelectValue placeholder="What type of service do you provide?" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <Badge variant="secondary" className="mt-2 bg-orange-100 text-orange-700">
                    {selectedCategory.icon} {selectedCategory.name}
                  </Badge>
                )}
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Business / Location Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Mike's Plumbing Services"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="text-lg bg-white"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
              </div>

              {/* City, State, Zip Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Miami"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">State</Label>
                  <Input
                    id="region"
                    placeholder="FL"
                    value={formData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postcode">ZIP Code</Label>
                  <Input
                    id="postcode"
                    placeholder="33101"
                    value={formData.postcode}
                    onChange={(e) => handleInputChange("postcode", e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information - Collapsible */}
          <Collapsible open={showOptional} onOpenChange={setShowOptional} className="mb-6">
            <Card className="border-0 shadow-md">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-orange-500" />
                      <CardTitle className="text-lg">Contact & Details</CardTitle>
                    </div>
                    {showOptional ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                  <CardDescription>Phone, email, website, and hours (optional)</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="website"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell customers about your services..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={3}
                      className="bg-white"
                    />
                  </div>

                  {/* Hours */}
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours of Operation</Label>
                    <Input
                      id="hours"
                      placeholder="Mon-Fri 8am-6pm, Sat 9am-2pm"
                      value={formData.hours_display}
                      onChange={(e) => handleInputChange("hours_display", e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPlace.isPending || !formData.name || !formData.tavvy_category}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {createPlace.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Location
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
