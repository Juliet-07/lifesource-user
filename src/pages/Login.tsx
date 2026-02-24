import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Droplets } from "lucide-react";
import logo from "@/assets/logo.svg";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { handleSubmit } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"donor" | "recipient">("donor");

  const [loginDetails, setLoginDetails] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const { email, password } = loginDetails;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post(`${apiURL}/auth/login`, loginDetails);
      const accessToken = response.data.data.accessToken
      const role = response.data.data.user.role;
      console.log(response.data.data)
      localStorage.setItem("userToken", accessToken);

      if (role === "donor") {
        navigate("/donor-dashboard");
      } else if (role === "recipient") {
        navigate("/recipient-dashboard");
      } else {
        // Fallback for any unexpected role value
        setErrorMessage("Unrecognised account type. Please contact support.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
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
            <img src={logo} alt="LifeSource" className="h-10 w-auto mx-auto mb-3" />
            <CardTitle className="font-heading text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your LifeSource account</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "donor" | "recipient")}
              className="mb-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="donor" className="gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Donor
                </TabsTrigger>
                <TabsTrigger value="recipient" className="gap-1.5">
                  <Droplets className="w-3.5 h-3.5" /> Recipient
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {errorMessage && (
              <p className="text-sm text-destructive text-center mb-4">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Phone</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="e.g. sarah@email.com"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
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

              <Button
                type="submit"
                variant={activeTab === "donor" ? "hero" : "warm"}
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in…" : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{" "}
              <Link
                to={activeTab === "donor" ? "/donate" : "/request-blood"}
                className="text-primary hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;