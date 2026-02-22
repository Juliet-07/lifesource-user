import { Heart, Shield, MapPin, Bell, Award, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your identity is protected. Donate anonymously with full control over your data.",
  },
  {
    icon: MapPin,
    title: "Location-Based Matching",
    description: "Find nearby donors or recipients with our intelligent location mapping system.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get instant notifications when someone nearby needs your blood type.",
  },
  {
    icon: Award,
    title: "Rewards & Badges",
    description: "Earn recognition for every donation. Track your impact with badges and milestones.",
  },
  {
    icon: Users,
    title: "Hospital Network",
    description: "Connected with trusted hospitals and blood banks for verified, safe donations.",
  },
  {
    icon: Heart,
    title: "Impact Stories",
    description: "See the lives you've touched. Every donation creates a story of hope and survival.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-heading font-semibold text-accent uppercase tracking-widest">
            Why LifeSource
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
            Built for <span className="text-gradient">Trust & Speed</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Every feature is designed to make blood donation faster, safer, and more rewarding.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
