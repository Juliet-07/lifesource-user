import logo from "@/assets/logo.svg";
import logoText from "@/assets/logo-text.svg";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="LifeSource" className="h-8 w-auto" />
              <img src={logoText} alt="LifeSource" className="h-4 w-auto brightness-[5]" />
            </div>
            <p className="text-background/60 max-w-sm leading-relaxed">
              Connecting donors and recipients securely. Every donation is a lifeline. Your privacy, our priority.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Platform</h4>
            <ul className="space-y-2 text-background/60">
              <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-background transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-background transition-colors">For Hospitals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Company</h4>
            <ul className="space-y-2 text-background/60">
              <li><a href="#" className="hover:text-background transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">© 2026 LifeSourceApp. All rights reserved.</p>
          <p className="text-background/40 text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent" /> for humanity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
