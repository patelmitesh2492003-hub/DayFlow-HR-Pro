import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  Shield,
  BarChart3,
  ArrowRight,
  Zap,
  Menu
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Manage employee profiles and track workforce data efficiently."
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    description: "Real-time check-in/check-out with automated reports."
  },
  {
    icon: CalendarDays,
    title: "Leave Management",
    description: "Streamlined leave requests with automated approvals."
  },
  {
    icon: DollarSign,
    title: "Payroll System",
    description: "Transparent salary management and payslip generation."
  },
  {
    icon: Shield,
    title: "Secure Access",
    description: "Role-based access control for data security."
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Visual insights on attendance and workforce metrics."
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">Dayflow</span>
          </div>
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <a href="#features" className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <Link to="/login">
              <Button size="sm" variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Start</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />

        {/* Floating Elements - Hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-1/4 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="hidden sm:block absolute bottom-1/4 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="opacity-0 animate-slide-up">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/20 text-primary-foreground/90 text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-primary-foreground/20">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                HR Management System
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 sm:mb-6 opacity-0 animate-slide-up stagger-1 px-4">
              Every workday,{" "}
              <span className="bg-gradient-to-r from-primary-foreground via-primary-glow to-primary-foreground bg-clip-text text-transparent">
                perfectly aligned.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/70 mb-8 sm:mb-10 max-w-2xl mx-auto opacity-0 animate-slide-up stagger-2 px-4">
              Streamline your HR operations with Dayflow. Manage your entire workforce efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center opacity-0 animate-slide-up stagger-3 px-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="hero-outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-4">
              Everything you need to manage your workforce
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Comprehensive HR tools designed to simplify operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="stat-card group p-6"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-sidebar border-t border-sidebar-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-sidebar-foreground">Dayflow</span>
            </div>
            <p className="text-sidebar-foreground/60 text-xs sm:text-sm text-center">
              © 2026 Dayflow HRMS. Built for Hackathon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
