import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorLogDonation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    hospital: "",
    bloodGroup: "O+",
    units: "1",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Donation logged!", description: "Thank you for saving a life 🩸" });
    navigate("/donor-dashboard");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/donor-dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="font-heading font-semibold text-lg">Log Donation</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="border-border/50 shadow-elevated">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full gradient-teal flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl">Log a Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Date of Donation *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Hospital / Donation Center *</Label>
                <Input placeholder="e.g. Lagos University Teaching Hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Units</Label>
                  <Input type="number" min="1" max="5" value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea placeholder="Any extra details…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full mt-2">
                Log Donation
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DonorLogDonation;
