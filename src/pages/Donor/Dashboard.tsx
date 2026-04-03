import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart, CalendarDays, MapPin, Clock, CheckCircle2, XCircle,
  PlusCircle, AlertTriangle, ShieldCheck
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/DashboardHeader";

const nearbyRequests = [
  { id: 1, bloodGroup: "O+", distance: "2.3 km", hospital: "Lagos University Teaching Hospital", urgency: "critical" },
  { id: 2, bloodGroup: "O+", distance: "5.1 km", hospital: "St. Nicholas Hospital", urgency: "urgent" },
  { id: 3, bloodGroup: "O-", distance: "8.7 km", hospital: "Reddington Hospital", urgency: "standard" },
];

const urgencyColor: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  urgent: "bg-accent text-accent-foreground",
  standard: "bg-secondary text-secondary-foreground",
};

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const DonorDashboard = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const { token } = useAuth();
  const { toast } = useToast();
  const [deferOpen, setDeferOpen] = useState(false);
  const [deferReason, setDeferReason] = useState("");
  const [deferRequestId, setDeferRequestId] = useState<number | null>(null);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const { data: userData } = useQuery({
    queryKey: ["donor-profile"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiURL}/donor/profile`, { headers });
      return data.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["donor-notifications"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiURL}/donor/notifications`, { headers });
      return data.data.notifications ?? data.data ?? [];
    },
    enabled: !!token,
    staleTime: 30 * 1000,
  });

  const handleAccept = (id: number) => {
    toast({ title: "Request accepted!", description: "Please proceed to the hospital." });
  };

  const openDefer = (id: number) => {
    setDeferRequestId(id);
    setDeferReason("");
    setDeferOpen(true);
  };

  const submitDefer = () => {
    setDeferOpen(false);
    toast({ title: "Request deferred", description: "Your reason has been noted." });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader notifications={notifications} />

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
                  <h2 className="font-heading font-semibold text-xl">{userData?.name ?? `${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`.trim()}</h2>
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
                    <AlertTriangle className="w-3.5 h-3.5" /> Not Eligible
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
              {userData?.lastDonation && (
                <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Last donation: {userData.lastDonation}</span>
              )}
              {userData?.nextEligible && (
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Next eligible: {userData.nextEligible}</span>
              )}
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
      </main>

      {/* Defer Reason Dialog */}
      <Dialog open={deferOpen} onOpenChange={setDeferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Defer Request</DialogTitle>
            <DialogDescription>Please let us know why you're deferring this request.</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g. I recently donated, I'm feeling unwell…"
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
