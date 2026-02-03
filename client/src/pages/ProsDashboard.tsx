import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useProProfile } from "@/hooks/useProProfile";
import { useProLeads } from "@/hooks/useProLeads";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { NotificationBadge } from "@/components/NotificationBadge";
import { 
  User, 
  ThumbsUp,
  Sparkles,
  AlertTriangle,
  MessageSquare, 
  TrendingUp, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  ExternalLink,
  CreditCard,
  LogOut,
  Loader2,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  Link,
  Copy,
  Share2,
  Send
} from "lucide-react";
import { useLocation } from "wouter";

export default function ProsDashboard() {
  const { user, signOut } = useSupabaseAuth();
  const { profile, loading: profileLoading, getProfileCompletion, getStats: getProfileStats } = useProProfile();
  const { leads, loading: leadsLoading, getRecentLeads, getStats: getLeadStats } = useProLeads();
  const { unreadCount } = useUnreadMessages();
  const [, setLocation] = useLocation();
  const [linkCopied, setLinkCopied] = useState(false);

  const profileComplete = getProfileCompletion();
  const profileStats = getProfileStats();
  const leadStats = getLeadStats();
  const recentLeads = getRecentLeads(5);

  const loading = profileLoading || leadsLoading;

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-green-500">New</Badge>;
      case 'viewed':
        return <Badge variant="secondary">Viewed</Badge>;
      case 'contacted':
        return <Badge className="bg-blue-500">Contacted</Badge>;
      case 'quoted':
        return <Badge className="bg-purple-500">Quoted</Badge>;
      case 'won':
        return <Badge className="bg-emerald-500">Won</Badge>;
      case 'lost':
        return <Badge variant="outline">Lost</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Redirect to onboarding if no profile exists
  useEffect(() => {
    if (!profileLoading && !profile) {
      setLocation('/onboarding');
    }
  }, [profileLoading, profile, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f7f2] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // If no profile, don't render dashboard (will redirect)
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f9f7f2] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const displayName = profile?.business_name || profile?.first_name || user?.email?.split('@')[0] || 'Pro';

  return (
    <div className="min-h-screen bg-[#f9f7f2]">
      {/* Header */}
      <header className="bg-[#0f172a] text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-horizontal.png" alt="Tavvy" className="h-8" />
            <span className="text-orange-500 font-semibold">Pros</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10 relative"
              onClick={() => setLocation('/messages')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
            <span className="text-sm text-gray-300">{user?.email}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {displayName}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your Tavvy Pro account.</p>
        </div>

        {/* Profile Completion Alert */}
        {profileComplete < 100 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Complete your profile</p>
                    <p className="text-sm text-gray-600">Profiles that are 100% complete get 3x more leads</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-600">{profileComplete}%</span>
                    <p className="text-xs text-gray-500">complete</p>
                  </div>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setLocation('/onboarding')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Leads Alert */}
        {leadStats.pending > 0 && (
          <Card className="mb-6 border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => setLocation('/dashboard')}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">You have {leadStats.pending} new lead{leadStats.pending !== 1 ? 's' : ''}!</p>
                    <p className="text-sm text-gray-600">Click here to view and respond to your leads</p>
                  </div>
                </div>
                <NotificationBadge count={leadStats.pending} size="lg" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Unread Messages Alert */}
        {unreadCount > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => setLocation('/messages')}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
                    <p className="text-sm text-gray-600">Click here to view your messages</p>
                  </div>
                </div>
                <NotificationBadge count={unreadCount} size="lg" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{leadStats.total || profileStats.totalLeads}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              {leadStats.pending > 0 && (
                <p className="text-xs text-green-600 mt-2">{leadStats.pending} new leads awaiting response</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{leadStats.pending + leadStats.viewed + leadStats.contacted + leadStats.quoted}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Response Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {leadStats.total > 0 
                      ? Math.round(((leadStats.contacted + leadStats.quoted + leadStats.won) / leadStats.total) * 100)
                      : profileStats.responseRate}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                {(leadStats.total > 0 ? ((leadStats.contacted + leadStats.quoted + leadStats.won) / leadStats.total) * 100 : profileStats.responseRate) >= 80 
                  ? 'Excellent!' 
                  : 'Keep improving!'}
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Tavvy Review System - The Good, The Vibe, Heads Up */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Reputation</CardTitle>
            <CardDescription>How customers describe their experience with you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* The Good */}
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <ThumbsUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">The Good</h3>
                <p className="text-sm text-blue-700 mb-3">What customers love</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">✨ Clean</Badge>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">😊 Friendly</Badge>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">⚡ Fast Service</Badge>
                </div>
                <p className="text-xs text-blue-600 mt-3">No reviews yet</p>
              </div>

              {/* The Vibe */}
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">The Vibe</h3>
                <p className="text-sm text-gray-600 mb-3">Your business personality</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-300">💼 Professional</Badge>
                  <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-300">🛋️ Casual</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-3">No reviews yet</p>
              </div>

              {/* Heads Up */}
              <div className="text-center p-4 rounded-lg bg-orange-50">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-orange-900 mb-1">Heads Up</h3>
                <p className="text-sm text-orange-700 mb-3">Things to know</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-sm text-orange-600">Nothing reported</span>
                </div>
                <p className="text-xs text-orange-600 mt-3">Great job! 🎉</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Reviews Section */}
        <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Send className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-900">Request Reviews</CardTitle>
                <CardDescription>Share this link with your customers to collect reviews</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Review Link */}
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-white rounded-lg border border-green-200 font-mono text-sm text-gray-700 truncate">
                  {`${window.location.origin}/review/${profile?.id || user?.id}`}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-300 hover:bg-green-100"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/review/${profile?.id || user?.id}`);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                >
                  {linkCopied ? (
                    <><CheckCircle className="h-4 w-4 mr-1 text-green-600" /> Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-1" /> Copy</>
                  )}
                </Button>
              </div>
              
              {/* Share Options */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-300 hover:bg-green-100"
                  onClick={() => {
                    const url = `${window.location.origin}/review/${profile?.id || user?.id}`;
                    const text = `I'd love to hear your feedback! Please leave a review: ${url}`;
                    window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Send via SMS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-300 hover:bg-green-100"
                  onClick={() => {
                    const url = `${window.location.origin}/review/${profile?.id || user?.id}`;
                    const subject = `Please leave a review for ${profile?.business_name || 'my business'}`;
                    const body = `Hi!\n\nThank you for choosing ${profile?.business_name || 'us'}! I'd really appreciate it if you could take a moment to share your experience.\n\nClick here to leave a review: ${url}\n\nThank you!`;
                    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                  }}
                >
                  <Mail className="h-4 w-4 mr-1" /> Send via Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-300 hover:bg-green-100"
                  onClick={() => {
                    const url = `${window.location.origin}/review/${profile?.id || user?.id}`;
                    const text = `I'd love to hear your feedback! Please leave a review for ${profile?.business_name || 'my business'}: ${url}`;
                    if (navigator.share) {
                      navigator.share({ title: 'Leave a Review', text, url });
                    } else {
                      navigator.clipboard.writeText(text);
                      setLinkCopied(true);
                      setTimeout(() => setLinkCopied(false), 2000);
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </div>
              
              <p className="text-xs text-green-700">
                💡 Tip: Send this link to customers after completing a job to collect authentic reviews
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Leads</CardTitle>
                    <CardDescription>Customers looking for your services</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setLocation('/dashboard')}>
                    View All
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentLeads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No leads yet. Complete your profile to start receiving leads!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => { /* Lead detail - coming soon */ }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {lead.project_request?.customer_name || 'Anonymous Customer'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {lead.project_request?.description?.substring(0, 50) || 'Service Request'}
                              {(lead.project_request?.description?.length || 0) > 50 ? '...' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {lead.project_request?.city || lead.project_request?.zip_code || 'Unknown'}
                            {lead.project_request?.state ? `, ${lead.project_request.state}` : ''}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{formatDate(lead.created_at)}</span>
                            {getStatusBadge(lead.pro_status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600" 
                  onClick={() => setLocation('/add-location')}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Service Location
                </Button>
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600" 
                  onClick={() => setLocation('/digital-card')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Digital Business Card
                </Button>
                <Button 
                  className="w-full justify-between" 
                  variant="outline"
                  onClick={() => setLocation('/messages')}
                >
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                  </span>
                  {unreadCount > 0 && (
                    <NotificationBadge count={unreadCount} size="sm" />
                  )}
                </Button>
                <Button 
                  className="w-full justify-between" 
                  variant="outline"
                  onClick={() => setLocation('/dashboard')}
                >
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View All Leads
                  </span>
                  {leadStats.pending > 0 && (
                    <NotificationBadge count={leadStats.pending} size="sm" />
                  )}
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setLocation('/onboarding')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Business Profile
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Update Service Areas
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Set Availability
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Lead Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      New
                    </span>
                    <span className="font-semibold">{leadStats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      Contacted
                    </span>
                    <span className="font-semibold">{leadStats.contacted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-500" />
                      Quoted
                    </span>
                    <span className="font-semibold">{leadStats.quoted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Won
                    </span>
                    <span className="font-semibold text-emerald-600">{leadStats.won}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Badge className={profile?.subscription_status === 'active' ? "bg-green-500" : "bg-gray-500"}>
                    {profile?.subscription_status || 'Inactive'}
                  </Badge>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {profile?.subscription_plan === 'pro_plus' ? '$599' : '$199'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {profile?.subscription_plan === 'pro_plus' ? 'Pro+ Plan' : 'Founding Pro Rate'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    First year pricing • Then {profile?.subscription_plan === 'pro_plus' ? '$1,299' : '$599'}/year
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
