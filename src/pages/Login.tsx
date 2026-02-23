import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Droplets } from "lucide-react";
import logo from "@/assets/logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"donor" | "recipient">("donor");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "donor") {
      navigate("/donor-dashboard");
    } else {
      navigate("/recipient-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
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
            <Tabs value={role} onValueChange={(v) => setRole(v as "donor" | "recipient")} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="donor" className="gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Donor
                </TabsTrigger>
                <TabsTrigger value="recipient" className="gap-1.5">
                  <Droplets className="w-3.5 h-3.5" /> Recipient
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Phone</Label>
                <Input
                  id="email"
                  placeholder="e.g. sarah@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                variant={role === "donor" ? "hero" : "warm"}
                size="lg"
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{" "}
              <Link to={role === "donor" ? "/donate" : "/request-blood"} className="text-primary hover:underline font-medium">
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
