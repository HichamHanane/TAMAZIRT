import { UserPlus, MapPin, Users, Plane, Star } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Sign Up",
      description: "Create your free account in minutes",
      number: "01",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Choose a City",
      description: "Select your destination in Morocco",
      number: "02",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Get Matched",
      description: "Connect with perfect local navigator",
      number: "03",
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Enjoy Your Journey",
      description: "Experience authentic Morocco",
      number: "04",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Leave a Review",
      description: "Share your amazing experience",
      number: "05",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-b from-sand to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey starts in five simple steps
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform -translate-y-1/2"></div>
          <div className="grid grid-cols-5 gap-4 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white shadow-xl mb-6 hover:scale-110 transition-transform duration-300">
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Stack */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-6 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white shadow-lg">
                {step.icon}
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {step.number}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-card-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
