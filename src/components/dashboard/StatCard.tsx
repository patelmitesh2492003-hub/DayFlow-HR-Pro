import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  variant = "default",
  className 
}: StatCardProps) => {
  const variantStyles = {
    default: "bg-card",
    primary: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
    success: "bg-gradient-to-br from-success to-success/80 text-success-foreground",
    warning: "bg-gradient-to-br from-warning to-warning/80 text-warning-foreground",
    destructive: "bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground",
  };

  const isColored = variant !== "default";

  return (
    <div className={cn(
      "rounded-xl p-6 shadow-md border border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <p className={cn(
          "text-sm font-medium",
          isColored ? "opacity-90" : "text-muted-foreground"
        )}>
          {title}
        </p>
        {icon && (
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isColored ? "bg-white/20" : "bg-accent"
          )}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className={cn(
            "text-3xl font-bold",
            isColored ? "" : "text-foreground"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-sm mt-1",
              isColored ? "opacity-80" : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            trend.isPositive 
              ? isColored ? "bg-white/20" : "bg-success/10 text-success" 
              : isColored ? "bg-white/20" : "bg-destructive/10 text-destructive"
          )}>
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
