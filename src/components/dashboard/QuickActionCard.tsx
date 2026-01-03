import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color?: "primary" | "success" | "warning" | "destructive";
  className?: string;
}

const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  to,
  color = "primary",
  className 
}: QuickActionCardProps) => {
  const colorStyles = {
    primary: "group-hover:bg-primary group-hover:text-primary-foreground text-primary bg-accent",
    success: "group-hover:bg-success group-hover:text-success-foreground text-success bg-success/10",
    warning: "group-hover:bg-warning group-hover:text-warning-foreground text-warning bg-warning/10",
    destructive: "group-hover:bg-destructive group-hover:text-destructive-foreground text-destructive bg-destructive/10",
  };

  return (
    <Link 
      to={to}
      className={cn(
        "group block p-6 bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
        colorStyles[color]
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
};

export default QuickActionCard;
