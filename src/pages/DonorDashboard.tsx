import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, CalendarDays, MapPin, Clock, CheckCircle2, XCircle, ArrowLeft, LogOut } from "lucide-react";

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

const urgencyColor: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  urgent: "bg-accent text-accent-foreground",
  standard: "bg-secondary text-secondary-foreground",
};

const DonorDashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <h1 className="font-heading font-semibold text-lg">Donor Dashboard</h1>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        {/* Eligibility Card */}
        <Card className="border-border/50 shadow-soft overflow-hidden">
          <div className={`h-1.5 w-full ${donorProfile.eligible ? "gradient-teal" : "bg-destructive"}`} />
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full gradient-teal flex items-center justify-center">
                  <Heart className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-xl">{donorProfile.name}</h2>
                  <p className="text-muted-foreground text-sm">Blood Group: <strong className="text-foreground">{donorProfile.bloodGroup}</strong></p>
                </div>
              </div>
              <Badge className={donorProfile.eligible ? "bg-primary/15 text-primary border-primary/30" : urgencyColor.critical}>
                {donorProfile.eligible ? "✓ Eligible to Donate" : `Not eligible until ${donorProfile.nextEligible}`}
              </Badge>
            </div>
            <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Last donation: {donorProfile.lastDonation}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Next eligible: {donorProfile.nextEligible}</span>
            </div>
          </CardContent>
        </Card>

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
                      <Button size="sm" variant="hero" className="text-xs h-8 px-3">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-8 px-3">
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
    </div>
  );
};

export default DonorDashboard;
