import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./lib/language-context";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute, AdminRoute, EditorRoute } from "./components/PrivateRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NewsDetail from "./pages/NewsDetail";
import CategoryPage from "./pages/CategoryPage";
import Search from "./pages/Search";
import AuthCallback from "./pages/AuthCallback";
import PricingPage from "./pages/PricingPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Editor from "./pages/Editor";
import Contact from "./pages/Contact";
import SocialLogin from "./pages/SocialLogin";
import Profile from "./pages/Profile";
import TagPage from "./pages/TagPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user/forgot-password" element={<ForgotPassword />} />
              <Route path="/social-login" element={<SocialLogin />} />
              <Route path="/user/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/user/setting" element={<Profile />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/tag/:slug" element={<TagPage />} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/admin/:tab" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/editor" element={<EditorRoute><Editor /></EditorRoute>} />
              <Route path="/editor/:tab" element={<EditorRoute><Editor /></EditorRoute>} />
              <Route path="/search" element={<Search />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/checkout/:planId" element={<CheckoutPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
