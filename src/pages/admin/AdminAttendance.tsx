import Link from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  UserCheck,
  UserX,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { attendanceAPI, employeesAPI } from "@/lib/api";

const weeklyData = [
  { day: 'Mon', present: 45, absent: 3, late: 2 },
  { day: 'Tue', present: 46, absent: 2, late: 2 },
  { day: 'Wed', present: 44, absent: 4, late: 2 },
  { day: 'Thu', present: 47, absent: 1, late: 2 },
  { day: 'Fri', present: 43, absent: 5, late: 2 },
];

const AdminAttendance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [usersData, attendanceData] = await Promise.all([
          employeesAPI.getAll(),
          attendanceAPI.getRecords()
        ]);

        // Map users for easy lookup
        const userMap = new Map();
        usersData.forEach((u: any) => userMap.set(u.id, u));

        // Combine attendance with user info
        const combinedRecords = attendanceData.map((record: any) => {
          const user = userMap.get(record.user_id) || {};
          return {
            ...record,
            employeeName: user.name || "Unknown",
            department: user.department || "N/A",
          };
        });

        setRecords(combinedRecords);

        // Calculate stats for "today"
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecords = combinedRecords.filter((r: any) => r.date === todayStr);

        setStats({
          total: usersData.length,
          present: todayRecords.filter((r: any) => r.status === 'present').length,
          absent: usersData.length - todayRecords.length, // Rough approximation
          late: 0,
          onLeave: todayRecords.filter((r: any) => r.status === 'leave').length
        });

      } catch (error) {
        console.error("Failed to fetch admin attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const s = status ? status.toLowerCase() : 'absent';
    let style = "bg-muted text-muted-foreground";

    if (s === 'present') style = "bg-success/10 text-success";
    else if (s === 'absent') style = "bg-destructive/10 text-destructive";
    else if (s === 'late') style = "bg-warning/10 text-warning";
    else if (s === 'half day') style = "bg-primary/10 text-primary";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  // Helper to format hours worked
  const getHoursWorked = (inTime: string, outTime: string | null) => {
    if (!outTime) return "In progress";
    const start = new Date(inTime);
    const end = new Date(outTime);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="pl-64">
        <DashboardHeader
          title="Attendance Management"
          subtitle="Monitor and manage employee attendance"
        >
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </DashboardHeader>

        <div className="p-8">
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                </div>
                <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-2">
                    <UserCheck className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-2xl font-bold text-success">{stats.present}</p>
                  <p className="text-sm text-muted-foreground">Present Today</p>
                </div>
                <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                    <UserX className="w-5 h-5 text-destructive" />
                  </div>
                  <p className="text-2xl font-bold text-destructive">{stats.absent}</p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </div>
                {/* Static placeholders for now */}
                <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <p className="text-2xl font-bold text-warning">{stats.late}</p>
                  <p className="text-sm text-muted-foreground">Late Arrivals</p>
                </div>
                <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.onLeave}</p>
                  <p className="text-sm text-muted-foreground">On Leave</p>
                </div>
              </div>

              {/* Weekly Chart - Static for now */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6 mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Attendance Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                      <XAxis dataKey="day" stroke="hsl(215, 16%, 47%)" fontSize={12} />
                      <YAxis stroke="hsl(215, 16%, 47%)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(0, 0%, 100%)',
                          border: '1px solid hsl(215, 20%, 90%)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="present" name="Present" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="absent" name="Absent" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="late" name="Late" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2 bg-card rounded-lg border border-border px-2">
                  <Button variant="ghost" size="icon-sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium px-2">{new Date().toLocaleDateString()}</span>
                  <Button variant="ghost" size="icon-sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Attendance Table */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check In</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check Out</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Hours</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                          No attendance records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((record) => (
                        <tr key={record.id || Math.random()} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                {record.employeeName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{record.employeeName}</p>
                                <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground">{record.department}</td>
                          <td className="px-6 py-4 text-foreground">
                            {record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                          </td>
                          <td className="px-6 py-4 text-foreground">
                            {record.check_in ? getHoursWorked(record.check_in, record.check_out) : "--"}
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAttendance;
