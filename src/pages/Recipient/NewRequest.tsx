import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Droplets, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const donationTypes = [
  { value: "whole_blood", label: "Whole Blood" },
  { value: "plasma", label: "Plasma" },
  { value: "platelets", label: "Platelets" },
  { value: "red_cells", label: "Red Cells" },
];
const urgencyLevels = [
  { value: "critical", label: "🔴 Critical – Needed Now" },
  { value: "high", label: "🟠 High – Within 24 hours" },
  { value: "medium", label: "🟡 Medium – Within a few days" },
  { value: "low", label: "🟢 Low – Within a week" },
];

const RecipientNewRequest = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["recipient-profile"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiURL}/recipient/profile`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return data.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  const [form, setForm] = useState({
    bloodType: "",
    donationType: "whole_blood",
    unitsNeeded: "1",
    urgency: "",
    patientName: "",
    patientAge: "",
    medicalCondition: "",
    requiredBy: "",
    notes: "",
    hospitalId: "",
    hospitalName: "",
    longitude: "",
    latitude: "",
    city: "",
  });

  // Prefill from profile once loaded
  const [prefilled, setPrefilled] = useState(false);
  if (profile && !prefilled) {
    setForm((prev) => ({
      ...prev,
      bloodType: profile.bloodType || prev.bloodType,
      city: profile.city || prev.city,
      hospitalName: profile.hospital || profile.hospitalName || prev.hospitalName,
      patientName: `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || prev.patientName,
      longitude: profile.longitude?.toString() || prev.longitude,
      latitude: profile.latitude?.toString() || prev.latitude,
    }));
    setPrefilled(true);
  }

  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        bloodType: form.bloodType,
        donationType: form.donationType,
        unitsNeeded: Number(form.unitsNeeded),
        urgency: form.urgency,
        patientName: form.patientName,
        patientAge: form.patientAge ? Number(form.patientAge) : 0,
        medicalCondition: form.medicalCondition,
        requiredBy: form.requiredBy,
        notes: form.notes,
        hospitalId: form.hospitalId,
        hospitalName: form.hospitalName,
        longitude: form.longitude ? Number(form.longitude) : 0,
        latitude: form.latitude ? Number(form.latitude) : 0,
        city: form.city,
      };
      const { data } = await axios.post(`${apiURL}/requests`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipient-requests"] });
      toast({ title: "Request submitted", description: "Nearby donors will be notified." });
      navigate("/recipient-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit",
        description: error?.response?.data?.message ?? "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const isValid = form.bloodType && form.hospitalName && form.urgency && form.unitsNeeded;

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
                <Input value={form.patientName} onChange={(e) => update("patientName", e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Blood Type *</Label>
                  <Select value={form.bloodType} onValueChange={(v) => update("bloodType", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Units Needed *</Label>
                  <Input type="number" min="1" max="10" value={form.unitsNeeded} onChange={(e) => update("unitsNeeded", e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Donation Type</Label>
                  <Select value={form.donationType} onValueChange={(v) => update("donationType", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {donationTypes.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Patient Age</Label>
                  <Input type="number" min="0" value={form.patientAge} onChange={(e) => update("patientAge", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Urgency *</Label>
                <Select value={form.urgency} onValueChange={(v) => update("urgency", v)}>
                  <SelectTrigger><SelectValue placeholder="How urgent?" /></SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((u) => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hospital Name *</Label>
                <Input value={form.hospitalName} onChange={(e) => update("hospitalName", e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Required By <span className="text-muted-foreground text-xs">(date)</span></Label>
                <Input type="date" value={form.requiredBy} onChange={(e) => update("requiredBy", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Medical Condition <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea
                  placeholder="e.g. Surgery scheduled, sickle cell crisis…"
                  value={form.medicalCondition}
                  onChange={(e) => update("medicalCondition", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea
                  placeholder="Any additional information…"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={2}
                />
              </div>

              <Button type="submit" variant="warm" size="lg" className="w-full mt-2" disabled={!isValid || submitMutation.isPending}>
                {submitMutation.isPending ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Submitting…</> : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RecipientNewRequest;
