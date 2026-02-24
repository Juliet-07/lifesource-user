import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplets, ArrowLeft, LogOut, Bell, User, PlusCircle, Clock,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

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
  cancelled: "bg-muted text-muted-foreground",
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
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  const getMyProfile = async () => {
    const { data } = await axios.get(`${apiURL}/recipient/profile`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return data.data;
  };

  const getMyRequests = async () => {
    const { data } = await axios.get(`${apiURL}/requests`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return data.data.requests ?? data.data ?? [];
  };

  const getNotifications = async () => {
    const { data } = await axios.get(`${apiURL}/recipient/notifications`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return data.data.notifications ?? data.data ?? [];
  };

  const { data: userData } = useQuery({
    queryKey: ["recipient-profile"],
    queryFn: getMyProfile,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const { data: requests = [], isLoading: requestsLoading } = useQuery<BloodRequest[]>({
    queryKey: ["recipient-requests"],
    queryFn: getMyRequests,
    enabled: !!token,
    staleTime: 60 * 1000,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["recipient-notifications"],
    queryFn: getNotifications,
    enabled: !!token,
    staleTime: 30 * 1000,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  const activeRequest = requests.find(
    (r) => r.status === "active" || r.status === "in_progress" || r.status === "pending"
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="font-heading font-semibold text-lg">Recipient Dashboard</h1>
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="font-heading font-semibold text-sm">Notifications</span>
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">No notifications yet</div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <DropdownMenuItem key={n._id} className={`flex flex-col items-start gap-0.5 px-3 py-2 ${!n.read ? "bg-primary/5" : ""}`}>
                      <span className="text-sm">{n.message}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" asChild>
              <Link to="/recipient-profile"><User className="w-4 h-4" /></Link>
            </Button>

            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

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

        {/* Active Request Card (if any) */}
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
