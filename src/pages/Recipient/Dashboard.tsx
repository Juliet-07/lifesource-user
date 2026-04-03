import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, PlusCircle, Clock } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";

const urgencyLabel: Record<string, string> = {
  critical: "🔴 Critical",
  high: "🔴 High",
  urgent: "🟠 Urgent",
  medium: "🟠 Medium",
  standard: "🟢 Standard",
  low: "🟢 Low",
};

const statusColor: Record<string, string> = {
  in_progress: "bg-accent/15 text-accent border-accent/30",
  active: "bg-accent/15 text-accent border-accent/30",
  completed: "bg-primary/15 text-primary border-primary/30",
  fulfilled: "bg-primary/15 text-primary border-primary/30",
  cancelled: "bg-red-600/75 text-white",
  pending: "bg-secondary text-secondary-foreground",
};

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface BloodRequest {
  _id: string;
  bloodType: string;
  unitsNeeded: number;
  hospitalName: string;
  urgency: string;
  status: string;
  createdAt: string;
  patientName?: string;
}

const RecipientDashboard = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const { data: userData } = useQuery({
    queryKey: ["recipient-profile"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiURL}/recipient/profile`, { headers });
      return data.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const { data: requests = [], isLoading: requestsLoading } = useQuery<BloodRequest[]>({
    queryKey: ["recipient-requests"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiURL}/requests`, { headers });
      return data.data.requests ?? data.data ?? [];
    },
    enabled: !!token,
    staleTime: 60 * 1000,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["recipient-notifications"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiURL}/recipient/notifications`, { headers });
      return data.data.notifications ?? data.data ?? [];
    },
    enabled: !!token,
    staleTime: 30 * 1000,
  });

  const activeRequest = requests.find(
    (r) => r.status === "active" || r.status === "in_progress" || r.status === "pending"
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader notifications={notifications} />

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-semibold text-xl">
              Welcome{userData?.firstName ? `, ${userData.firstName}` : ""}
            </h2>
            <p className="text-muted-foreground text-sm">Manage your blood requests and track their progress.</p>
          </div>
          <Button variant="warm" asChild>
            <Link to="/recipient-new-request"><PlusCircle className="w-4 h-4 mr-1" /> New Blood Request</Link>
          </Button>
        </div>

        {/* Active Request Card */}
        {activeRequest && (
          <Card className="border-border/50 shadow-soft overflow-hidden">
            <div className="h-1.5 w-full gradient-warm" />
            <CardContent className="pt-6">
              <Link to={`/recipient-request/${activeRequest._id}`} className="block hover:opacity-80 transition-opacity">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full gradient-warm flex items-center justify-center">
                      <Droplets className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg">Active Request</h3>
                      {activeRequest.patientName && (
                        <p className="text-muted-foreground text-sm">
                          Patient: <strong className="text-foreground">{activeRequest.patientName}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className="bg-destructive/15 text-destructive border-destructive/30">
                    {urgencyLabel[activeRequest.urgency] ?? activeRequest.urgency}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded bg-destructive/10 flex items-center justify-center font-heading font-bold text-destructive text-xs">
                      {activeRequest.bloodType}
                    </div>
                    <span>{activeRequest.unitsNeeded} unit(s)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground truncate">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="truncate">{activeRequest.hospitalName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(activeRequest.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Requests Table */}
        <section>
          <h3 className="font-heading font-semibold text-lg mb-3">My Requests</h3>
          <Card className="border-border/50 shadow-soft overflow-hidden">
            {requestsLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <Droplets className="w-10 h-10 mx-auto text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">You haven't made any blood requests yet.</p>
                <Button variant="warm" size="sm" asChild>
                  <Link to="/recipient-new-request"><PlusCircle className="w-4 h-4 mr-1" /> Create Your First Request</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blood</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead className="hidden sm:table-cell">Hospital</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r._id} className="cursor-pointer" onClick={() => navigate(`/recipient-request/${r._id}`)}>
                      <TableCell className="font-heading font-bold text-destructive">{r.bloodType}</TableCell>
                      <TableCell>{r.unitsNeeded}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{r.hospitalName}</TableCell>
                      <TableCell><span className="text-xs">{urgencyLabel[r.urgency] ?? r.urgency}</span></TableCell>
                      <TableCell>
                        <Badge className={`${statusColor[r.status] ?? "bg-muted text-muted-foreground"} text-xs capitalize`}>
                          {r.status?.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-primary hover:underline">View</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </section>
      </main>
    </div>
  );
};

export default RecipientDashboard;
