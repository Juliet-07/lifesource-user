import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.svg";
import logoText from "@/assets/logo-text.svg";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="LifeSource" className="h-8 w-auto" />
          <img src={logoText} alt="LifeSource" className="h-3.5 w-auto" />
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">For Hospitals</a>
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          <Button variant="hero" size="sm" asChild><Link to="/donate">Get Started</Link></Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <a href="#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground">Features</a>
          <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-foreground">How It Works</a>
          <a href="#" className="block text-sm font-medium text-muted-foreground hover:text-foreground">For Hospitals</a>
          <Button variant="hero" size="sm" className="w-full">Get Started</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
