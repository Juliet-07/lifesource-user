import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const donationTypes = [
  { value: "whole_blood", label: "Whole Blood" },
  { value: "platelet", label: "Platelets" },
  { value: "plasma", label: "Plasma" },
  { value: "double_red_cells", label: "Double Red Cells" },
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
  weight: number;
  role: string;
  preferredDonationType: string;
}

const DonorRegistration = () => {
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
    role: "donor",
    bloodType: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    latitude: 0,
    longitude: 0,
    consentGiven: false,
    preferredDonationType: "",
    weight: 0,
    age: 0,
  });

  const {
    firstName, lastName, email, password, phone,
    bloodType, city, state, country, consentGiven,
    age, weight, preferredDonationType,
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
    age > 0 && weight > 0 && consentGiven;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="border-border/50 shadow-elevated">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full gradient-teal flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl">Become a Donor</CardTitle>
            <CardDescription>Fill in your details to start saving lives</CardDescription>
          </CardHeader>

          <CardContent>
            {errorMessage && (
              <p className="text-sm text-destructive text-center mb-4">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="e.g. Sarah"
                    value={firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="e.g. Johnson"
                    value={lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. sarah@email.com"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. +2341234567890"
                  value={phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Blood Type */}
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Group *</Label>
                <Select
                  value={bloodType}
                  onValueChange={(v) => handleSelectChange("bloodType", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred Donation Type */}
              <div className="space-y-2">
                <Label htmlFor="preferredDonationType">Preferred Donation Type</Label>
                <Select
                  value={preferredDonationType}
                  onValueChange={(v) => handleSelectChange("preferredDonationType", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select donation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((dt) => (
                      <SelectItem key={dt.value} value={dt.value}>{dt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
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
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="e.g. Nigeria"
                  value={country}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Age & Weight */}
              <div className="grid grid-cols-2 gap-3">
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
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="e.g. 70"
                    value={weight || ""}
                    onChange={handleChange}
                    min={50}
                    required
                  />
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="consentGiven"
                  checked={consentGiven}
                  onCheckedChange={(checked) =>
                    setFormDetails((prev) => ({ ...prev, consentGiven: checked === true }))
                  }
                />
                <Label
                  htmlFor="consentGiven"
                  className="text-sm leading-snug text-muted-foreground cursor-pointer"
                >
                  I consent to being contacted for blood donation requests and agree to the privacy policy.
                </Label>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full mt-2"
                disabled={!isValid || isLoading}
              >
                {isLoading ? "Creating account…" : "Continue to Dashboard"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonorRegistration;