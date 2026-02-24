import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DonorRegistration from "./pages/Donor/Registration";
import DonorDashboard from "./pages/Donor/Dashboard";
import DonorProfile from "./pages/Donor/Profile";
import DonorLogDonation from "./pages/Donor/LogDonation";
import RecipientRequest from "./pages/Recipient/Registeration";
import RecipientDashboard from "./pages/Recipient/Dashboard";
import RecipientProfile from "./pages/Recipient/Profile";
import RecipientNewRequest from "./pages/Recipient/NewRequest";
import RecipientRequestDetail from "./pages/Recipient/RequestDetail";
import NotFound from "./pages/NotFound";
import RecipientRegisteration from "./pages/Recipient/Registeration";

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
          <Route path="/request-blood" element={<RecipientRegisteration />} />
          <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
          <Route path="/recipient-profile" element={<RecipientProfile />} />
          <Route path="/recipient-new-request" element={<RecipientNewRequest />} />
          <Route path="/recipient-request/:id" element={<RecipientRequestDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
