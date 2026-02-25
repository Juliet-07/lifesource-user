import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("userToken");
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName:"",
    email:"",
    phone: "",
    bloodType:"",
    city: "", 
    state: "", 
    country: ""
  });

  const getMyProfile = async () => {
    const { data } = await axios.get(`${apiURL}/recipient/profile`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return data.data;
  };

  const { data: userData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
  useEffect(() => {
    if (userData) {
      setProfile({
        firstName:userData.firstName,
        lastName:userData.lastName,
        email: userData.email ?? "",
        phone: userData.phone ?? "",
        bloodType: userData.bloodType ?? "",
        city: userData.city ?? "",
        state: userData.state ?? "",
        country: userData.country ?? "",
      });
    }
  }, [userData]);
  const handleUpdateProfile = useMutation({
    mutationFn: async (payload: typeof profile) => {
      const { data } = await axios.patch(
        `${apiURL}/recipient/profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });

      toast({ title: "Changes Saved" });
      setEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update profile",
        description: error?.response?.data?.message ?? "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    handleUpdateProfile.mutate(profile);
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
              <Label>First Name</Label>
              <Input value={profile.firstName} disabled={!editing} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={profile.lastName} disabled={!editing} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} disabled={!editing} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={profile.phone} disabled={!editing} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select value={profile.bloodType} onValueChange={(v) => setProfile({ ...profile, bloodType: v })} disabled={!editing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bg) => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={profile.city} disabled={!editing} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input value={profile.state} disabled={!editing} onChange={(e) => setProfile({ ...profile, state: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={profile.country} disabled={!editing} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
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
