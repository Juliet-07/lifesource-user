import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = [
  { value: "critical", label: "🔴 Critical – Needed Now" },
  { value: "urgent", label: "🟠 Urgent – Within 24 hours" },
  { value: "standard", label: "🟢 Standard – Within a week" },
];

const RecipientRequest = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "",
    hospital: "",
    urgency: "",
    contactPerson: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/recipient-dashboard");
  };

  const isValid = form.bloodGroup && form.hospital && form.urgency && form.contactPerson;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="border-border/50 shadow-elevated">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center mx-auto mb-3">
              <Droplets className="w-6 h-6 text-accent-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl">Request Blood</CardTitle>
            <CardDescription>Submit a request and we'll notify nearby donors immediately</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input
                  id="patientName"
                  placeholder="e.g. David's Brother"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group Needed *</Label>
                <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital *</Label>
                <Input
                  id="hospital"
                  placeholder="e.g. Lagos University Teaching Hospital"
                  value={form.hospital}
                  onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency *</Label>
                <Select value={form.urgency} onValueChange={(v) => setForm({ ...form, urgency: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="How urgent is the need?" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((u) => (
                      <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person (Phone / Email) *</Label>
                <Input
                  id="contactPerson"
                  placeholder="e.g. +234... or david@email.com"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="warm"
                size="lg"
                className="w-full mt-2"
                disabled={!isValid}
              >
                Submit & View Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipientRequest;
