import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Droplets } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = [
  { value: "critical", label: "🔴 Critical – Needed Now" },
  { value: "urgent", label: "🟠 Urgent – Within 24 hours" },
  { value: "standard", label: "🟢 Standard – Within a week" },
];

const RecipientNewRequest = () => {
  const navigate = useNavigate();
  // Prefilled from "profile" registration data
  const [form, setForm] = useState({
    patientName: "David's Brother",
    bloodGroup: "B-",
    hospital: "Lagos University Teaching Hospital",
    contactPerson: "david@email.com",
    urgency: "",
    unitsNeeded: "1",
    medicalCondition: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/recipient-dashboard");
  };

  const isValid = form.bloodGroup && form.hospital && form.urgency && form.unitsNeeded;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/recipient-dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="font-heading font-semibold text-lg">New Blood Request</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="border-border/50 shadow-elevated">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center mx-auto mb-3">
              <Droplets className="w-6 h-6 text-accent-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl">Request Blood</CardTitle>
            <CardDescription>Some fields are prefilled from your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient Name</Label>
                <Input value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Blood Group *</Label>
                  <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Units Needed *</Label>
                  <Input type="number" min="1" max="10" value={form.unitsNeeded} onChange={(e) => setForm({ ...form, unitsNeeded: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Urgency *</Label>
                <Select value={form.urgency} onValueChange={(v) => setForm({ ...form, urgency: v })}>
                  <SelectTrigger><SelectValue placeholder="How urgent?" /></SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((u) => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hospital *</Label>
                <Input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label>Medical Condition <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea
                  placeholder="e.g. Surgery scheduled, sickle cell crisis, accident victim…"
                  value={form.medicalCondition}
                  onChange={(e) => setForm({ ...form, medicalCondition: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
              </div>

              <Button type="submit" variant="warm" size="lg" className="w-full mt-2" disabled={!isValid}>
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RecipientNewRequest;
