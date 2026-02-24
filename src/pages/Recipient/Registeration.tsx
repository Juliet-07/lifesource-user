import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, ArrowLeft } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = [
  { value: "critical", label: "🔴 Critical – Needed Now" },
  { value: "urgent", label: "🟠 Urgent – Within 24 hours" },
  { value: "standard", label: "🟢 Standard – Within a week" },
];

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  bloodType: string;
  city: string;
  state: string;
  country: string;
  longitude: number;
  latitude: number;
  consentGiven: boolean;
  age: number;
  role: string;
}
const RecipientRegisteration = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { handleSubmit } = useForm<RegistrationForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formDetails, setFormDetails] = useState<RegistrationForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "recipient",
    bloodType: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    latitude: 0,
    longitude: 0,
    consentGiven: false,
    age: 0,
  });

  const {
    firstName, lastName, email, password, phone,
    bloodType, city, state, country, consentGiven,
    age
  } = formDetails;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof RegistrationForm, value: string) => {
    setFormDetails((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await axios.post(`${apiURL}/auth/register`, formDetails);
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      const message = error?.response?.data?.message ?? "Registration failed. Please check your details.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    firstName && lastName && email && password &&
    phone && bloodType && city && country &&
    age;


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="e.g. David"
                  value={firstName}
                  name="firstName"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name </Label>
                <Input
                  id="lastName"
                  placeholder="e.g. Jackson"
                  name="lastName"
                  value={lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email </Label>
                <Input
                  id="email"
                  placeholder="e.g. david@email.com"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password </Label>
                <Input
                  id="password"
                  placeholder="*******"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number </Label>
                <Input
                  id="phone"
                  placeholder="e.g. +234589644785"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Group Needed *</Label>
                <Select value={bloodType} onValueChange={(v) => handleSelectChange("bloodType", v)}>
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
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="e.g. 28"
                  value={age || ""}
                  onChange={handleChange}
                  min={18}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g. Ikeja"
                    value={city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="e.g. Lagos"
                    value={state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="e.g. Nigeria"
                  value={country}
                  onChange={handleChange}
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
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipientRegisteration;
