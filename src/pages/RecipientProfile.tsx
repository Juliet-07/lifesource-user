import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RecipientProfile = () => {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "David Okoro",
    bloodGroup: "B-",
    location: "Lagos, Yaba",
    contact: "david@email.com",
    phone: "+234 802 345 6789",
    hospital: "Lagos University Teaching Hospital",
  });

  const handleSave = () => {
    setEditing(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/recipient-dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="font-heading font-semibold text-lg">My Profile</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg space-y-6">
        <Card className="border-border/50 shadow-soft">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center">
                  <User className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle className="font-heading text-xl">Recipient Profile</CardTitle>
              </div>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.fullName} disabled={!editing} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select value={profile.bloodGroup} onValueChange={(v) => setProfile({ ...profile, bloodGroup: v })} disabled={!editing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Hospital</Label>
              <Input value={profile.hospital} disabled={!editing} onChange={(e) => setProfile({ ...profile, hospital: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={profile.location} disabled={!editing} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.contact} disabled={!editing} onChange={(e) => setProfile({ ...profile, contact: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={profile.phone} disabled={!editing} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>

            {editing && (
              <div className="flex gap-2 pt-2">
                <Button variant="warm" className="flex-1" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" /> Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RecipientProfile;
