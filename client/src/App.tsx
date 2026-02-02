import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SupabaseAuthProvider, useSupabaseAuth } from "./contexts/SupabaseAuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import ProsDashboard from "./pages/ProsDashboard";
import DigitalCardEditor from "./pages/DigitalCardEditor";
import PublicProCard from "./pages/PublicProCard";
import MessagesPage from "./pages/MessagesPage";
import AddServiceLocation from "./pages/AddServiceLocation";
import Pricing from "./pages/Pricing";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSupabaseAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f7f2]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function PublicRoute({ children, redirectToDashboard = true }: { children: React.ReactNode; redirectToDashboard?: boolean }) {
  const { isAuthenticated, loading } = useSupabaseAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && redirectToDashboard) {
      setLocation("/dashboard");
    }
  }, [loading, isAuthenticated, setLocation, redirectToDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f7f2]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (isAuthenticated && redirectToDashboard) {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public Landing Page */}
      <Route path="/">
        <PublicRoute redirectToDashboard={true}>
          <LandingPage />
        </PublicRoute>
      </Route>
      
      {/* Auth Routes */}
      <Route path="/login">
        <PublicRoute>
          <Login />
        </PublicRoute>
      </Route>
      <Route path="/signup">
        <PublicRoute redirectToDashboard={false}>
          <Signup />
        </PublicRoute>
      </Route>
      <Route path="/forgot-password">
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      </Route>
      
      {/* Protected Routes */}
      <Route path="/onboarding">
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <ProsDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/messages">
        <ProtectedRoute>
          <MessagesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/digital-card">
        <ProtectedRoute>
          <DigitalCardEditor />
        </ProtectedRoute>
      </Route>
      <Route path="/add-location">
        <ProtectedRoute>
          <AddServiceLocation />
        </ProtectedRoute>
      </Route>
      
      {/* Public Pro Card - No auth required */}
      <Route path="/pro/:slug">
        <PublicProCard />
      </Route>
      
      {/* Pricing and Subscription Routes */}
      <Route path="/pricing">
        <PublicRoute redirectToDashboard={false}>
          <Pricing />
        </PublicRoute>
      </Route>
      <Route path="/subscription/success">
        <SubscriptionSuccess />
      </Route>
      <Route path="/subscription/cancel">
        <SubscriptionCancel />
      </Route>

      {/* 404 */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <SupabaseAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SupabaseAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
