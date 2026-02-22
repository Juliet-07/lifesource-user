import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-heading font-medium mb-6 backdrop-blur-sm border border-primary-foreground/10">
            🩸 Anonymous • Secure • Life-Saving
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-6">
            Your Blood Can
            <br />
            <span className="text-accent">Save a Life</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-lg mb-8 leading-relaxed">
            LifeSourceApp connects blood donors and recipients privately and securely. 
            Find matches near you, donate with confidence, and track your impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="warm" size="lg" className="text-base px-8" asChild>
              <Link to="/donate">Donate Blood</Link>
            </Button>
            <Button size="lg" className="border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 font-heading font-semibold text-base px-8" asChild>
              <Link to="/request-blood">I Need Blood</Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6 text-primary-foreground/60 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-gentle" />
              1,200+ Active Donors
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-gentle" />
              50+ Partner Hospitals
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
