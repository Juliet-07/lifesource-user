import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DonorRegistration from "./pages/DonorRegistration";
import DonorDashboard from "./pages/DonorDashboard";
import DonorProfile from "./pages/DonorProfile";
import DonorLogDonation from "./pages/DonorLogDonation";
import RecipientRequest from "./pages/RecipientRequest";
import RecipientDashboard from "./pages/RecipientDashboard";
import RecipientProfile from "./pages/RecipientProfile";
import RecipientNewRequest from "./pages/RecipientNewRequest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donate" element={<DonorRegistration />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/donor-profile" element={<DonorProfile />} />
          <Route path="/donor-log-donation" element={<DonorLogDonation />} />
          <Route path="/request-blood" element={<RecipientRequest />} />
          <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
          <Route path="/recipient-profile" element={<RecipientProfile />} />
          <Route path="/recipient-new-request" element={<RecipientNewRequest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
