import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-95" />
      <div className="relative container mx-auto px-4 text-center">
        <Heart className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6 animate-pulse-gentle" />
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-4">
          Save a Life Near You
        </h2>
        <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
          Every drop counts. Join thousands of donors and recipients building a healthier, more connected community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-card text-primary hover:bg-card/90 font-heading font-semibold text-base px-8" asChild>
            <Link to="/donate">Become a Donor</Link>
          </Button>
          <Button size="lg" className="border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 font-heading font-semibold text-base px-8" asChild>
            <Link to="/request-blood">Request Blood</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
