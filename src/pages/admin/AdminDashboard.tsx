import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardAPI } from "@/lib/api";
import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import {
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Keep chart data mock for now until analytics API is ready
const attendanceData = [
  { name: 'Mon', present: 45, absent: 3 },
  { name: 'Tue', present: 46, absent: 2 },
  { name: 'Wed', present: 44, absent: 4 },
  { name: 'Thu', present: 47, absent: 1 },
  { name: 'Fri', present: 43, absent: 5 },
];

const leaveDistribution = [
  { name: 'Approved', value: 45, color: 'hsl(160, 84%, 39%)' },
  { name: 'Pending', value: 12, color: 'hsl(38, 92%, 50%)' },
  { name: 'Rejected', value: 8, color: 'hsl(0, 84%, 60%)' },
];

const recentEmployees = [
  { id: 'EMP001', name: 'Sarah Johnson', department: 'Engineering', status: 'Active', avatar: '👩‍💻' },
  { id: 'EMP002', name: 'Michael Chen', department: 'Design', status: 'Active', avatar: '👨‍🎨' },
  { id: 'EMP003', name: 'Emily Davis', department: 'Marketing', status: 'On Leave', avatar: '👩‍💼' },
  { id: 'EMP004', name: 'James Wilson', department: 'Sales', status: 'Active', avatar: '👨‍💻' },
];

const pendingApprovals = [
  { type: 'Leave Request', employee: 'John Smith', date: 'Jan 8-9, 2026', urgency: 'medium' },
  { type: 'Leave Request', employee: 'Lisa Anderson', date: 'Jan 15-17, 2026', urgency: 'low' },
  { type: 'Attendance Correction', employee: 'Mike Brown', date: 'Jan 2, 2026', urgency: 'high' },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({
    totalEmployees: 0,
    presentToday: 0,
    onLeaveToday: 0,
    pendingApprovals: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="pl-64">
        <DashboardHeader
          title="HR Dashboard"
          subtitle="Overview of your organization's workforce metrics"
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
                title="Total Employees"
                value={stats.totalEmployees}
                subtitle="Active workforce"
                icon={<Users className="w-5 h-5 text-primary" />}
                trend={{ value: 8.3, isPositive: true }}
              />
              <StatCard
                title="Present Today"
                value={stats.presentToday}
                subtitle={`${stats.totalEmployees > 0 ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0}% attendance`}
                icon={<UserCheck className="w-5 h-5 text-success" />}
                variant="success"
              />
              <StatCard
                title="On Leave"
                value={stats.onLeaveToday}
                subtitle="Approved Status"
                icon={<CalendarDays className="w-5 h-5 text-warning" />}
              />
              <StatCard
                title="Pending Approvals"
                value={stats.pendingApprovals}
                subtitle="Requires attention"
                icon={<AlertTriangle className="w-5 h-5 text-warning" />}
                variant="warning"
              />
            </div>
          )}

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Attendance Chart */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Attendance Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(243, 75%, 59%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(243, 75%, 59%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                    <XAxis dataKey="name" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(0, 0%, 100%)',
                        border: '1px solid hsl(215, 20%, 90%)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="present"
                      stroke="hsl(243, 75%, 59%)"
                      fillOpacity={1}
                      fill="url(#colorPresent)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leave Distribution */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Leave Requests</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {leaveDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {leaveDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Employees */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Employees</h3>
                <a href="/admin/employees" className="text-sm text-primary hover:underline">View all</a>
              </div>
              <div className="space-y-3">
                {recentEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg">
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{emp.name}</p>
                        <p className="text-sm text-muted-foreground">{emp.department}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                      {emp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Pending Approvals</h3>
                <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                  {pendingApprovals.length} pending
                </span>
              </div>
              <div className="space-y-3">
                {pendingApprovals.map((approval, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${approval.urgency === 'high' ? 'border-destructive/30 bg-destructive/5' :
                      approval.urgency === 'medium' ? 'border-warning/30 bg-warning/5' :
                        'border-border bg-muted/30'
                    }`}>
                    <div>
                      <p className="font-medium text-foreground">{approval.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {approval.employee} • {approval.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-success text-success-foreground text-sm font-medium rounded-lg hover:bg-success/90 transition-colors">
                        Approve
                      </button>
                      <button className="px-3 py-1.5 bg-destructive/10 text-destructive text-sm font-medium rounded-lg hover:bg-destructive/20 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
