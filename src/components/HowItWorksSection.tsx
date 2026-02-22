import { Droplets, UserCheck, MapPin, Send, Building2, CheckCircle2, MessageCircle } from "lucide-react";

const donorSteps = [
  { icon: UserCheck, title: "Sign Up as Donor", description: "Create your anonymous profile in under 2 minutes" },
  { icon: Droplets, title: "Set Blood Type", description: "Input your blood group and donation preferences" },
  { icon: MapPin, title: "Get Matched", description: "Receive alerts when someone nearby needs your type" },
  { icon: CheckCircle2, title: "Donate & Earn", description: "Visit the hospital, save a life, earn badges" },
];

const recipientSteps = [
  { icon: Send, title: "Submit Request", description: "Enter blood type needed and hospital location" },
  { icon: MapPin, title: "Find Donors", description: "See eligible donors nearby on the map" },
  { icon: Building2, title: "Hospital Sync", description: "Partner hospital confirms readiness" },
  { icon: MessageCircle, title: "Receive & Thank", description: "Get blood, share gratitude in-app" },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-muted/50" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-heading font-semibold text-accent uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
            Simple. Secure. <span className="text-gradient">Life-Saving.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Donor Journey */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center">
                <Droplets className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground">For Donors</h3>
            </div>
            <div className="space-y-6">
              {donorSteps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    {i < donorSteps.length - 1 && (
                      <div className="w-0.5 h-8 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-heading font-semibold text-foreground">{step.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient Journey */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
                <Send className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground">For Recipients</h3>
            </div>
            <div className="space-y-6">
              {recipientSteps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-accent" />
                    </div>
                    {i < recipientSteps.length - 1 && (
                      <div className="w-0.5 h-8 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-heading font-semibold text-foreground">{step.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
