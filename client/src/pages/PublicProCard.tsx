import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { createClient } from "@supabase/supabase-js";
import {
  Phone,
  MessageSquare,
  Mail,
  FileText,
  Share2,
  Download,
  Check,
  Globe,
  Instagram,
  Facebook,
  Briefcase,
  MapPin,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://scasgwrikoqdwlwlwcff.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjYXNnd3Jpa29xZHdsd2x3Y2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODUxODEsImV4cCI6MjA4MjU2MTE4MX0.83ARHv2Zj6oJpbojPCIT0ljL8Ze2JqMBztLVueGXXhs";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProCardData {
  id: string;
  slug: string;
  company_name: string;
  tagline: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  category: string;
  gradient_color_1: string;
  gradient_color_2: string;
  profile_photo_url: string | null;
  logo_url: string | null;
  verified: boolean;
  enabled_tabs: string[];
  services: string[];
  social_instagram: string | null;
  social_facebook: string | null;
  social_website: string | null;
  social_tiktok: string | null;
  about_text: string | null;
  is_published: boolean;
}

// Generate vCard string
function generateVCard(pro: ProCardData): string {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${pro.company_name}`,
    `ORG:${pro.company_name}`,
    pro.phone ? `TEL;TYPE=WORK,VOICE:${pro.phone}` : "",
    pro.email ? `EMAIL;TYPE=WORK:${pro.email}` : "",
    pro.city || pro.state ? `ADR;TYPE=WORK:;;${pro.city || ""};${pro.state || ""};;;` : "",
    pro.social_website ? `URL:${pro.social_website.startsWith("http") ? pro.social_website : "https://" + pro.social_website}` : "",
    `NOTE:${pro.category || ""} - ${pro.tagline || ""}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
  return vcard;
}

// Download vCard
function downloadVCard(pro: ProCardData) {
  const vcard = generateVCard(pro);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${pro.company_name.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Share card
async function shareCard(pro: ProCardData, cardUrl: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: pro.company_name,
        text: `Check out ${pro.company_name}${pro.tagline ? " - " + pro.tagline : ""}`,
        url: cardUrl,
      });
      return true;
    } catch (err) {
      return false;
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(cardUrl);
    return true;
  }
}

export default function PublicProCard() {
  const [, params] = useRoute("/pro/:slug");
  const slug = params?.slug;

  const [proData, setProData] = useState<ProCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("contact");
  const [showQR, setShowQR] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const cardUrl = `${window.location.origin}/pro/${slug}`;

  // Load pro data from database
  useEffect(() => {
    const fetchProCard = async () => {
      if (!slug) {
        setError("Card not found");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("pro_cards")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            setError("Card not found or not published");
          } else {
            throw fetchError;
          }
        } else {
          setProData(data);
          // Set default active tab
          if (data.enabled_tabs && data.enabled_tabs.length > 0) {
            setActiveTab(data.enabled_tabs[0]);
          }
        }
      } catch (err: any) {
        console.error("Error fetching card:", err);
        setError("Failed to load card");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProCard();
  }, [slug]);

  // Handle save contact
  const handleSaveContact = () => {
    if (!proData) return;
    downloadVCard(proData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Handle share
  const handleShare = async () => {
    if (!proData) return;
    const success = await shareCard(proData, cardUrl);
    if (success && !navigator.share) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  // Social link click
  const openSocialLink = (type: string, value: string | null) => {
    if (!value) return;
    let url = "";
    switch (type) {
      case "instagram":
        url = value.startsWith("http") ? value : `https://instagram.com/${value}`;
        break;
      case "facebook":
        url = value.startsWith("http") ? value : `https://facebook.com/${value}`;
        break;
      case "website":
        url = value.startsWith("http") ? value : `https://${value}`;
        break;
      case "tiktok":
        url = value.startsWith("http") ? value : `https://tiktok.com/@${value.replace("@", "")}`;
        break;
    }
    if (url) window.open(url, "_blank");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Error state
  if (error || !proData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Card Not Found</h1>
          <p className="text-gray-500">{error || "This card doesn't exist or is not published."}</p>
        </div>
      </div>
    );
  }

  const gradient = `linear-gradient(135deg, ${proData.gradient_color_1 || "#8B5CF6"}, ${proData.gradient_color_2 || "#6366F1"})`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Card Container */}
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Gradient Header */}
        <div className="pt-10 pb-8 px-6 text-white relative" style={{ background: gradient }}>
          {/* Tavvy Badge */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-xs font-medium">Tavvy Pro</span>
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/50 overflow-hidden flex items-center justify-center">
              {proData.profile_photo_url ? (
                <img src={proData.profile_photo_url} alt={proData.company_name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-white/60">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
            </div>
          </div>

          {/* Company Info */}
          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              {proData.company_name}
              {proData.verified && (
                <span className="bg-blue-500 rounded-full p-1">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </h1>
            {proData.tagline && <p className="text-white/80 text-sm mt-1">{proData.tagline}</p>}
            <div className="flex items-center justify-center gap-2 mt-2 text-white/70 text-sm">
              <MapPin className="h-3 w-3" />
              <span>
                {proData.category}
                {proData.city && ` • ${proData.city}`}
                {proData.state && `, ${proData.state}`}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {proData.enabled_tabs && proData.enabled_tabs.length > 0 && (
          <div className="bg-white border-b px-4 py-3 flex gap-2">
            {proData.enabled_tabs.map((tabId) => (
              <button
                key={tabId}
                className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all ${
                  activeTab === tabId ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={activeTab === tabId ? { background: gradient } : {}}
                onClick={() => setActiveTab(tabId)}
              >
                {tabId.charAt(0).toUpperCase() + tabId.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        <div className="p-4 space-y-3">
          {activeTab === "contact" && (
            <>
              {proData.phone && (
                <a
                  href={`tel:${proData.phone}`}
                  className="w-full py-3.5 px-4 bg-slate-800 text-white rounded-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
              )}
              {proData.phone && (
                <a
                  href={`sms:${proData.phone}`}
                  className="w-full py-3.5 px-4 bg-slate-800 text-white rounded-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Send Text
                </a>
              )}
              {proData.email && (
                <a
                  href={`mailto:${proData.email}`}
                  className="w-full py-3.5 px-4 bg-slate-800 text-white rounded-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              )}
              <button className="w-full py-3.5 px-4 bg-slate-800 text-white rounded-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-slate-700 transition-colors">
                <FileText className="h-4 w-4" />
                Request Quote
              </button>
            </>
          )}

          {activeTab === "services" && (
            <div className="space-y-2">
              {proData.services && proData.services.length > 0 ? (
                proData.services.map((service, i) => (
                  <div
                    key={i}
                    className="py-3.5 px-4 bg-gray-50 rounded-xl text-sm text-gray-700 flex items-center justify-between"
                  >
                    <span>{service}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-8">No services listed</p>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="py-4">
              {proData.about_text ? (
                <p className="text-gray-600 leading-relaxed">{proData.about_text}</p>
              ) : (
                <p className="text-center text-gray-400">No about information available</p>
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="py-4 text-center">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">Portfolio coming soon</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="py-4 text-center">
              <p className="text-gray-400">Reviews coming soon</p>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="px-4 py-4 flex justify-center gap-3 border-t">
          {proData.social_instagram && (
            <button
              onClick={() => openSocialLink("instagram", proData.social_instagram)}
              className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <Instagram className="h-5 w-5 text-white" />
            </button>
          )}
          {proData.social_facebook && (
            <button
              onClick={() => openSocialLink("facebook", proData.social_facebook)}
              className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <Facebook className="h-5 w-5 text-white" />
            </button>
          )}
          {proData.social_website && (
            <button
              onClick={() => openSocialLink("website", proData.social_website)}
              className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <Globe className="h-5 w-5 text-white" />
            </button>
          )}
          {proData.social_tiktok && (
            <button
              onClick={() => openSocialLink("tiktok", proData.social_tiktok)}
              className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <span className="text-white text-xs font-bold">TT</span>
            </button>
          )}
          {/* Tavvy Profile */}
          <button className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
            <span className="text-white text-sm font-bold">T</span>
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="px-4 pb-6 pt-2 flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-3.5 px-4 border-2 border-gray-300 text-gray-700 rounded-full flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {shareSuccess ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Share Card
              </>
            )}
          </button>
          <button
            onClick={handleSaveContact}
            className="flex-1 py-3.5 px-4 text-white rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-colors"
            style={{ background: gradient }}
          >
            {saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Save Contact
              </>
            )}
          </button>
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <QRCodeSVG value={cardUrl} size={32} />
          </button>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQR(false)}
          >
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-center mb-4">Scan to Save</h3>
              <div className="flex justify-center mb-4">
                <QRCodeSVG value={cardUrl} size={200} level="H" includeMargin />
              </div>
              <p className="text-sm text-gray-500 text-center mb-4">
                Scan this QR code to open {proData.company_name}'s digital card
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="w-full py-3 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Save to Wallet Banner */}
        <div className="px-4 pb-4">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-colors"
            onClick={() => {
              // Deep link to Tavvy app or app store
              window.open("https://tavvy.com/app", "_blank");
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Save to Tavvy Wallet</p>
                <p className="text-white/70 text-xs">Keep all your contractors in one place</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
