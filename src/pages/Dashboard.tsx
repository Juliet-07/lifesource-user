import { useAuth } from "@/contexts/AuthContext";
import DonorDashboard from "./Donor/Dashboard";
import RecipientDashboard from "./Recipient/Dashboard";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated, activeRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return activeRole === "recipient" ? <RecipientDashboard /> : <DonorDashboard />;
};

export default Dashboard;
