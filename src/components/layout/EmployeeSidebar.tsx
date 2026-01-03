import { Link, useLocation } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  DollarSign,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, isActive }: SidebarLinkProps) => (
  <Link
    to={to}
    className={cn(
      "nav-link",
      isActive && "nav-link-active"
    )}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

const EmployeeSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: "/employee/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/employee/profile", icon: User, label: "My Profile" },
    { to: "/employee/attendance", icon: Clock, label: "Attendance" },
    { to: "/employee/leave", icon: CalendarDays, label: "Leave Requests" },
    { to: "/employee/payroll", icon: DollarSign, label: "Payroll" },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-sidebar-foreground">Dayflow</span>
            <p className="text-xs text-sidebar-foreground/60">Employee Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            {...link}
            isActive={location.pathname === link.to}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link to="/" className="nav-link text-sidebar-foreground/60 hover:text-sidebar-foreground">
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={logout}
          className="w-full nav-link text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
