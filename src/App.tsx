import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Registration from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DonorProfile from "./pages/Donor/Profile";
import DonorLogDonation from "./pages/Donor/LogDonation";
import DonorNewAppointment from "./pages/Donor/NewAppointment";
import RecipientProfile from "./pages/Recipient/Profile";
import RecipientNewRequest from "./pages/Recipient/NewRequest";
import RecipientRequestDetail from "./pages/Recipient/RequestDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/donor-profile" element={<DonorProfile />} />
            <Route path="/donor-log-donation" element={<DonorLogDonation />} />
            <Route path="/recipient-profile" element={<RecipientProfile />} />
            <Route path="/recipient-new-request" element={<RecipientNewRequest />} />
            <Route path="/recipient-request/:id" element={<RecipientRequestDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
