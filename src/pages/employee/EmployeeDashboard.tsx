import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardAPI } from "@/lib/api";
import EmployeeSidebar from "@/components/layout/EmployeeSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import {
  Clock,
  CalendarDays,
  DollarSign,
  User,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2
} from "lucide-react";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({
    checkedInToday: false,
    checkInTime: null,
    checkOutTime: null,
    leaveBalance: 0,
    pendingLeaves: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <EmployeeSidebar />

      <main className="pl-64">
        <DashboardHeader
          title={`Welcome back, ${user?.name?.split(' ')[0] || 'Employee'}!`}
          subtitle="Here's what's happening with your account today."
        />

        <div className="p-8">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            /* Stats Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Today's Status"
                value={stats.checkedInToday ? (stats.checkOutTime ? "Checked Out" : "Checked In") : "Not Started"}
                subtitle={stats.checkedInToday ? (stats.checkOutTime ? `at ${new Date(stats.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : `at ${new Date(stats.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`) : "Check in now"}
                icon={<Clock className="w-5 h-5 text-primary" />}
                variant={stats.checkedInToday && !stats.checkOutTime ? "primary" : "default"}
              />
              <StatCard
                title="Leave Balance"
                value={stats.leaveBalance}
                subtitle="Days remaining"
                icon={<CalendarDays className="w-5 h-5 text-success" />}
              />
              <StatCard
                title="Pending Requests"
                value={stats.pendingLeaves}
                subtitle="Awaiting approval"
                icon={<AlertCircle className="w-5 h-5 text-warning" />}
              />
              <StatCard
                title="Next Payday"
                value="Jan 31"
                subtitle="2026"
                icon={<DollarSign className="w-5 h-5 text-muted-foreground" />}
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickActionCard
                title="My Profile"
                description="View and update your personal information"
                icon={User}
                to="/employee/profile"
                color="primary"
              />
              <QuickActionCard
                title="Attendance"
                description="Check-in, check-out and view history"
                icon={Clock}
                to="/employee/attendance"
                color="success"
              />
              <QuickActionCard
                title="Apply Leave"
                description="Submit a new leave request"
                icon={CalendarDays}
                to="/employee/leave"
                color="warning"
              />
              <QuickActionCard
                title="View Payroll"
                description="Access salary details and payslips"
                icon={DollarSign}
                to="/employee/payroll"
                color="primary"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Attendance Overview */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">This Week's Attendance</h3>
              <div className="space-y-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm font-medium text-foreground">{day}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {index < 3 ? '09:00 AM - 06:00 PM' : index === 3 ? '09:15 AM - 06:30 PM' : '--:-- - --:--'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${index < 3 ? 'bg-success/10 text-success' :
                          index === 3 ? 'bg-warning/10 text-warning' :
                            'bg-muted text-muted-foreground'
                        }`}>
                        {index < 3 ? 'Present' : index === 3 ? 'Late' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Requests */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Leave Requests</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div>
                    <p className="font-medium text-foreground">Sick Leave</p>
                    <p className="text-sm text-muted-foreground">Jan 8-9, 2026 (2 days)</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                    Pending
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg border border-success/20">
                  <div>
                    <p className="font-medium text-foreground">Paid Leave</p>
                    <p className="text-sm text-muted-foreground">Dec 25-26, 2025 (2 days)</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    Approved
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div>
                    <p className="font-medium text-foreground">Unpaid Leave</p>
                    <p className="text-sm text-muted-foreground">Nov 15, 2025 (1 day)</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                    Rejected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
