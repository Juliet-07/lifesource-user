import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart, CalendarDays, MapPin, Clock, CheckCircle2, XCircle, ArrowLeft, LogOut,
  Bell, User, PlusCircle, AlertTriangle, ShieldCheck
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const donorProfile = {
  name: "Sarah Johnson",
  bloodGroup: "O+",
  eligible: true,
  lastDonation: "2025-12-10",
  nextEligible: "2026-01-24",
};

const nearbyRequests = [
  { id: 1, bloodGroup: "O+", distance: "2.3 km", hospital: "Lagos University Teaching Hospital", urgency: "critical" },
  { id: 2, bloodGroup: "O+", distance: "5.1 km", hospital: "St. Nicholas Hospital", urgency: "urgent" },
  { id: 3, bloodGroup: "O-", distance: "8.7 km", hospital: "Reddington Hospital", urgency: "standard" },
];

const donationHistory = [
  { date: "2025-12-10", hospital: "Lagos University Teaching Hospital", bloodGroup: "O+" },
  { date: "2025-09-05", hospital: "St. Nicholas Hospital", bloodGroup: "O+" },
  { date: "2025-05-22", hospital: "Reddington Hospital", bloodGroup: "O+" },
];

const mockNotifications = [
  { id: 1, message: "Urgent request for O+ blood at LUTH", time: "5 min ago", read: false },
  { id: 2, message: "Your donation eligibility is restored!", time: "2 days ago", read: false },
  { id: 3, message: "Thank you for your last donation 🩸", time: "1 week ago", read: true },
];

const urgencyColor: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  urgent: "bg-accent text-accent-foreground",
  standard: "bg-secondary text-secondary-foreground",
};

type Request = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  parentEmail: string;
  grade: string;
  age: string;
  image: string;
};

const DonorDashboard = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deferOpen, setDeferOpen] = useState(false);
  const [deferReason, setDeferReason] = useState("");
  const [deferRequestId, setDeferRequestId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleAccept = (id: number) => {
    toast({ title: "Request accepted!", description: "Please proceed to the hospital. Directions will be shared shortly." });
  };

  const openDefer = (id: number) => {
    setDeferRequestId(id);
    setDeferReason("");
    setDeferOpen(true);
  };

  const submitDefer = () => {
    setDeferOpen(false);
    toast({ title: "Request deferred", description: "Your reason has been noted. Thank you." });
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getMyProfile = async () => {
    const res = await axios.get(`${apiURL}/donor/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(res.data, "profile");
    return res.data.data;
  };
  const getMyRequests = async () => {
    const { data } = await axios.get(`${apiURL}/donor/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    console.log(data);
    return data.data.notifications;
  };
  const { data: userData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
  const { data: requests = [] } = useQuery<Request[]>({
    queryKey: ["requests"],
    queryFn: getMyRequests,
    staleTime: 5 * 60 * 1000,
  });

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="font-heading font-semibold text-lg hidden md:inline-block">Donor Dashboard</h1>
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

            {/* Profile */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/donor-profile"><User className="w-4 h-4" /></Link>
            </Button>

            {/* Sign Out */}
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link to="/login"><LogOut className="w-4 h-4 mr-1" /> Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        {/* Eligibility Card */}
        <Card className="border-border/50 shadow-soft overflow-hidden">
          <div className={`h-1.5 w-full ${userData?.isEligible === true ? "gradient-teal" : "bg-destructive"}`} />
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full gradient-teal flex items-center justify-center">
                  <Heart className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-xl">{userData?.name}</h2>
                  <p className="text-muted-foreground text-sm">Blood Group: <strong className="text-foreground">{userData?.bloodType}</strong></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {userData?.isEligible === true ? (
                  <Badge className="bg-primary/15 text-primary border-primary/30 gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Eligible to Donate
                  </Badge>
                ) : (
                  <Badge className={`${urgencyColor.critical} gap-1`}>
                    <AlertTriangle className="w-3.5 h-3.5" /> Not eligible until {donorProfile.nextEligible}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Last donation: {donorProfile.lastDonation}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Next eligible: {donorProfile.nextEligible}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button variant="hero" asChild>
            <Link to="/donor-log-donation"><PlusCircle className="w-4 h-4 mr-1" /> Log a Donation</Link>
          </Button>
        </div>

        {/* Nearby Requests */}
        <section>
          <h3 className="font-heading font-semibold text-lg mb-3">Nearby Blood Requests</h3>
          <div className="space-y-3">
            {nearbyRequests.map((req) => (
              <Card key={req.id} className="border-border/50 shadow-soft">
                <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center font-heading font-bold text-destructive text-sm">
                      {req.bloodGroup}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{req.hospital}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Badge className={`${urgencyColor[req.urgency]} text-xs capitalize`}>{req.urgency}</Badge>
                    <div className="flex gap-2 ml-auto sm:ml-0">
                      <Button size="sm" variant="hero" className="text-xs h-8 px-3" onClick={() => handleAccept(req.id)}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-8 px-3" onClick={() => openDefer(req.id)}>
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Defer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Donation History */}
        <section>
          <h3 className="font-heading font-semibold text-lg mb-3">Donation History</h3>
          <Card className="border-border/50 shadow-soft">
            <CardContent className="py-2">
              <div className="divide-y divide-border">
                {donationHistory.map((d, i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <span>{d.date}</span>
                    </div>
                    <span className="text-muted-foreground hidden sm:inline">{d.hospital}</span>
                    <Badge variant="outline" className="text-xs">{d.bloodGroup}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Defer Reason Dialog */}
      <Dialog open={deferOpen} onOpenChange={setDeferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Defer Request</DialogTitle>
            <DialogDescription>Please let us know why you're deferring this request.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g. I recently donated, I'm feeling unwell, travel constraints…"
            value={deferReason}
            onChange={(e) => setDeferReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeferOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={submitDefer} disabled={!deferReason.trim()}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonorDashboard;
