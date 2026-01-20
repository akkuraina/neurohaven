import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield, Heart, Users, Calendar, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-meditation.jpg";

const features = [
  {
    icon: Brain,
    title: "EmotionTwin AI",
    description: "AI-powered mood tracking with personalized insights and coping strategies tailored to your emotional patterns.",
  },
  {
    icon: Shield,
    title: "Confidential Care Bridge",
    description: "Anonymous counselor booking with encrypted sessions, ensuring complete privacy for your mental health journey.",
  },
  {
    icon: Heart,
    title: "Silent SOS",
    description: "Intelligent stress detection that provides gentle nudges for self-care or emergency support when needed.",
  },
  {
    icon: Users,
    title: "Peer Pods",
    description: "Safe community spaces with AI moderation, connecting you with others who share similar experiences.",
  },
  {
    icon: BookOpen,
    title: "Mind Journal Heatmap",
    description: "Visual tracking of your mental wellness journey with color-coded insights and exportable trends.",
  },
  {
    icon: Calendar,
    title: "Calmscapes VR/AR",
    description: "Immersive meditation environments accessible right from your browser, no special equipment needed.",
  },
];

const benefits = [
  "Reduce anxiety and stress by up to 40%",
  "24/7 AI support and human counselor access",
  "Complete privacy with end-to-end encryption",
  "Evidence-based therapeutic techniques",
  "Seamless integration with your daily routine",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            backgroundBlendMode: 'multiply'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground mb-6 text-shadow-soft">
              Your Personal
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Mental Wellness
              </span>
              Sanctuary
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of mental health support with AI-powered insights, 
              anonymous counseling, and a caring community—all in one elegant platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/dashboard">
                <Button size="lg" className="btn-hero px-8 py-4 text-lg">
                  Begin Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Button size="lg" variant="outline" className="btn-ghost-gold px-8 py-4 text-lg">
                Learn More
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Comprehensive Mental Wellness Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed with your privacy, comfort, and growth in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-premium hover-lift">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-6">
            Ready to Transform Your Mental Wellness?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands who have already begun their journey to better mental health 
            with our AI-powered, privacy-first platform.
          </p>

          <Link to="/dashboard">
            <Button size="lg" className="btn-hero px-12 py-4 text-lg">
              Start Your Free Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Complete privacy guaranteed
          </p>
        </div>
      </section>
    </div>
  );
}