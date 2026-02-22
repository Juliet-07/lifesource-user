import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, MapPin, Clock, Users, ArrowLeft, LogOut, CheckCircle2, Circle, Loader2 } from "lucide-react";

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

const currentStep = 2; // 0-indexed, "Donor accepted" is current

const urgencyLabel: Record<string, string> = {
  critical: "🔴 Critical",
  urgent: "🟠 Urgent",
  standard: "🟢 Standard",
};

const RecipientDashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <h1 className="font-heading font-semibold text-lg">Recipient Dashboard</h1>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
          </Button>
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

        {/* Simple Map Placeholder */}
        <section>
          <h3 className="font-heading font-semibold text-lg mb-3">Nearby Donors</h3>
          <Card className="border-border/50 shadow-soft overflow-hidden">
            <CardContent className="p-0">
              <div className="h-64 bg-muted/50 flex items-center justify-center relative">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-primary/40" />
                  <p className="text-sm font-medium">Map View</p>
                  <p className="text-xs">3 anonymous donors nearby</p>
                </div>
                {/* Mock donor pins */}
                <div className="absolute top-12 left-1/4 w-3 h-3 rounded-full bg-primary animate-pulse-gentle" title="Anonymous Donor" />
                <div className="absolute top-20 right-1/3 w-3 h-3 rounded-full bg-primary animate-pulse-gentle" title="Anonymous Donor" />
                <div className="absolute bottom-16 left-1/2 w-3 h-3 rounded-full bg-primary animate-pulse-gentle" title="Anonymous Donor" />
                {/* Hospital pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-destructive border-2 border-background" title="Hospital" />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default RecipientDashboard;
