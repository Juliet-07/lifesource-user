import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HospitalDropdown } from "@/components/Dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DonorNewAppointment = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hospitalId, setHospitalId] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [form, setForm] = useState({
    date: "",
    time: "",
    bloodGroup: "O+",
    donationType: "whole_blood",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build ISO scheduledAt from separate date + time fields
    const scheduledAt = new Date(`${form.date}T${form.time}:00.000Z`).toISOString();

    const payload = {
      hospitalId,
      scheduledAt,
      donationType: form.donationType,
      bloodType: form.bloodGroup,
      notes: form.notes,
    };

    try {
      await axios.post(`${apiURL}/donor/appointments`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      toast({
        title: "Appointment booked!",
        description: `Your appointment at ${selectedHospital} has been scheduled.`,
      });
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        title: "Booking failed",
        description: error?.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="font-heading font-semibold text-lg">Book Appointment</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <Card className="border-border/50 shadow-elevated">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full gradient-teal flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl">Book a Donation Appointment</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Schedule a time to donate blood at a hospital near you.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <HospitalDropdown
                  value={hospitalId}
                  onChange={(name, id) => {
                    setSelectedHospital(name);
                    setHospitalId(id);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Preferred Date *</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Time *</Label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    required
                  />
                </div>
              </div>
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
                <Label>Notes <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea
                  placeholder="Any special requirements or information…"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full mt-2"
                disabled={!hospitalId || !form.date || !form.time}
              >
                Book Appointment
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DonorNewAppointment;