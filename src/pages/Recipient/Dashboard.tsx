import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplets, MapPin, Clock, Users, ArrowLeft, LogOut, CheckCircle2, Circle, Loader2,
  Bell, User, PlusCircle
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const mockNotifications = [
  { id: 1, message: "A donor has accepted your request!", time: "18 min ago", read: false },
  { id: 2, message: "3 eligible donors notified nearby", time: "1 hour ago", read: false },
  { id: 3, message: "Your blood request has been created", time: "1 hour ago", read: true },
];

const request = {
  bloodGroup: "B-",
  hospital: "Lagos University Teaching Hospital",
  requestTime: "2026-02-22 09:34 AM",
  urgency: "critical",
  patientName: "David's Brother",
};

const donorSummary = { eligible: 3, notified: 3, accepted: 1 };

const timeline = [
  { label: "Request created", done: true, time: "09:34 AM" },
  { label: "Donors notified", done: true, time: "09:35 AM" },
  { label: "Donor accepted", done: true, time: "09:52 AM" },
  { label: "Hospital ready", done: false, time: null },
  { label: "Blood received", done: false, time: null },
];

const currentStep = 2;

const pastRequests = [
  { id: "REQ-001", bloodGroup: "B-", units: 2, hospital: "LUTH", urgency: "critical", status: "in_progress", date: "2026-02-22" },
  { id: "REQ-002", bloodGroup: "B-", units: 1, hospital: "St. Nicholas Hospital", urgency: "urgent", status: "completed", date: "2026-01-10" },
  { id: "REQ-003", bloodGroup: "O+", units: 3, hospital: "Reddington Hospital", urgency: "standard", status: "cancelled", date: "2025-12-05" },
];

const urgencyLabel: Record<string, string> = {
  critical: "🔴 Critical",
  urgent: "🟠 Urgent",
  standard: "🟢 Standard",
};

const statusColor: Record<string, string> = {
  in_progress: "bg-accent/15 text-accent border-accent/30",
  completed: "bg-primary/15 text-primary border-primary/30",
  cancelled: "bg-muted text-muted-foreground",
  pending: "bg-secondary text-secondary-foreground",
};

const RecipientDashboard = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getMyProfile = async () => {
    const res = await axios.get(`${apiURL}/recipient/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res.data, "profile");
    return res.data.data;
  };
  // const getNotifications = async () => {
  //   const { data } = await axios.get(`${apiURL}/recipient/notifications`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-type": "application/json; charset=UTF-8",
  //     },
  //   });
  //   console.log(data);
  //   return data.data.notifications;
  // };
  const getMyRequests = async () => {
    const { data } = await axios.get(`${apiURL}/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    console.log(data);
    return data.data.requests;
  };
  const { data: userData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
  const { data: requests = [] } = useQuery<Request[]>({
    queryKey: ["my-requests"],
    queryFn: getMyRequests,
    staleTime: 5 * 60 * 1000,
  });

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="font-heading font-semibold text-lg">Recipient Dashboard</h1>
          <div className="flex items-center gap-1">
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
                  {unreadCount > 0 && (
                    <button className="text-xs text-primary hover:underline" onClick={markAllRead}>Mark all read</button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className={`flex flex-col items-start gap-0.5 px-3 py-2 ${!n.read ? "bg-primary/5" : ""}`}>
                    <span className="text-sm">{n.message}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" asChild>
              <Link to="/recipient-profile"><User className="w-4 h-4" /></Link>
            </Button>

            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link to="/login"><LogOut className="w-4 h-4 mr-1" /> Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        {/* Active Request Card */}
        <Card className="border-border/50 shadow-soft overflow-hidden">
          <div className="h-1.5 w-full gradient-warm" />
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full gradient-warm flex items-center justify-center">
                  <Droplets className="w-7 h-7 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-xl">Active Request</h2>
                  <p className="text-muted-foreground text-sm">
                    Patient: <strong className="text-foreground">{request.patientName}</strong>
                  </p>
                </div>
              </div>
              <Badge className="bg-destructive/15 text-destructive border-destructive/30">
                {urgencyLabel[request.urgency]}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded bg-destructive/10 flex items-center justify-center font-heading font-bold text-destructive text-xs">
                  {request.bloodGroup}
                </div>
                <span>Blood Group</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{request.hospital}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{request.requestTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Request Button */}
        <Button variant="warm" asChild>
          <Link to="/recipient-new-request"><PlusCircle className="w-4 h-4 mr-1" /> New Blood Request</Link>
        </Button>

        {/* Donor Availability Summary */}
        <Card className="border-border/50 shadow-soft">
          <CardContent className="py-5">
            <div className="flex items-center gap-3 mb-1">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-semibold">Donor Availability</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <p className="text-2xl font-heading font-bold text-primary">{donorSummary.eligible}</p>
                <p className="text-xs text-muted-foreground">Eligible Nearby</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/10">
                <p className="text-2xl font-heading font-bold text-accent-foreground">{donorSummary.notified}</p>
                <p className="text-xs text-muted-foreground">Notified</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary">
                <p className="text-2xl font-heading font-bold text-foreground">{donorSummary.accepted}</p>
                <p className="text-xs text-muted-foreground">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Status Timeline */}
        <section>
          <h3 className="font-heading font-semibold text-lg mb-3">Request Status</h3>
          <Card className="border-border/50 shadow-soft">
            <CardContent className="py-6">
              <div className="space-y-0">
                {timeline.map((step, i) => {
                  const isCurrent = i === currentStep;
                  const isDone = step.done;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="w-6 h-6 text-accent animate-spin shrink-0" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground/30 shrink-0" />
                        )}
                        {i < timeline.length - 1 && (
                          <div className={`w-0.5 h-8 ${isDone ? "bg-primary/40" : "bg-border"}`} />
                        )}
                      </div>
                      <div className="-mt-0.5">
                        <p className={`text-sm font-medium ${isDone || isCurrent ? "text-foreground" : "text-muted-foreground/50"}`}>
                          {step.label}
                        </p>
                        {step.time && <p className="text-xs text-muted-foreground">{step.time}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Requests Table */}
        <section>
          <h3 className="font-heading font-semibold text-lg mb-3">My Requests</h3>
          <Card className="border-border/50 shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Blood</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead className="hidden sm:table-cell">Hospital</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastRequests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-heading font-bold text-destructive">{r.bloodGroup}</TableCell>
                    <TableCell>{r.units}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{r.hospital}</TableCell>
                    <TableCell><span className="text-xs">{urgencyLabel[r.urgency]}</span></TableCell>
                    <TableCell>
                      <Badge className={`${statusColor[r.status]} text-xs capitalize`}>
                        {r.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{r.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* Simple Map Placeholder */}
        {/* <section>
          <h3 className="font-heading font-semibold text-lg mb-3">Nearby Donors</h3>
          <Card className="border-border/50 shadow-soft overflow-hidden">
            <CardContent className="p-0">
              <div className="h-64 bg-muted/50 flex items-center justify-center relative">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-primary/40" />
                  <p className="text-sm font-medium">Map View</p>
                  <p className="text-xs">3 anonymous donors nearby</p>
                </div>
                <div className="absolute top-12 left-1/4 w-3 h-3 rounded-full bg-primary animate-pulse" title="Anonymous Donor" />
                <div className="absolute top-20 right-1/3 w-3 h-3 rounded-full bg-primary animate-pulse" title="Anonymous Donor" />
                <div className="absolute bottom-16 left-1/2 w-3 h-3 rounded-full bg-primary animate-pulse" title="Anonymous Donor" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-destructive border-2 border-background" title="Hospital" />
              </div>
            </CardContent>
          </Card>
        </section> */}
      </main>
    </div>
  );
};

export default RecipientDashboard;
