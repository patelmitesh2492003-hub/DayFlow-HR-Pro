import { useEffect, useState } from "react";
import EmployeeSidebar from "@/components/layout/EmployeeSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { attendanceAPI, dashboardAPI } from "@/lib/api";

type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave' | 'weekend';

const EmployeeAttendance = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState("January 2026");
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayRecord, setTodayRecord] = useState<any>(null);

  // Stats
  const [stats, setStats] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    leaves: 0,
    halfDays: 0,
    avgHours: "--"
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch attendance history
      const data = await attendanceAPI.getRecords();
      setRecords(data);

      // Calculate stats based on data
      const presentCount = data.filter((r: any) => r.status === 'present').length;
      setStats(prev => ({
        ...prev,
        totalDays: data.length, // Simplified for now
        present: presentCount
      }));

      // Find today's record
      const todayStr = new Date().toISOString().split('T')[0];
      const today = data.find((r: any) => r.date === todayStr);
      setTodayRecord(today || null);

    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async () => {
    try {
      await attendanceAPI.checkIn();
      toast({
        title: "Checked In Successfully",
        description: `You checked in at ${new Date().toLocaleTimeString()}`,
      });
      fetchData(); // Refresh data
    } catch (error: any) {
      toast({
        title: "Check-in Failed",
        description: error.message || "Could not check in",
        variant: "destructive"
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceAPI.checkOut();
      toast({
        title: "Checked Out Successfully",
        description: `You checked out at ${new Date().toLocaleTimeString()}`,
      });
      fetchData(); // Refresh data
    } catch (error: any) {
      toast({
        title: "Check-out Failed",
        description: error.message || "Could not check out",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    let style = "bg-muted text-muted-foreground";

    if (s === 'present') style = "bg-success/10 text-success";
    else if (s === 'absent') style = "bg-destructive/10 text-destructive";
    else if (s === 'leave') style = "bg-primary/10 text-primary";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
      <EmployeeSidebar />

      <main className="pl-64">
        <DashboardHeader
          title="Attendance"
          subtitle="Track your daily attendance and working hours"
        />

        <div className="p-8">
          {/* Check In/Out Card */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-8 mb-8 text-primary-foreground">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-primary-foreground/80 mb-2">Today's Status</p>
                <h2 className="text-3xl font-bold mb-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                {todayRecord?.check_in && (
                  <p className="text-primary-foreground/80">
                    Checked in at {new Date(todayRecord.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (!todayRecord || !todayRecord.check_in) ? (
                  <Button
                    variant="hero-outline"
                    size="xl"
                    onClick={handleCheckIn}
                    className="min-w-40"
                  >
                    <LogIn className="w-5 h-5" />
                    Check In
                  </Button>
                ) : (!todayRecord.check_out) ? (
                  <Button
                    variant="hero-outline"
                    size="xl"
                    onClick={handleCheckOut}
                    className="min-w-40"
                  >
                    <LogOut className="w-5 h-5" />
                    Check Out
                  </Button>
                ) : (
                  <div className="bg-white/20 px-6 py-3 rounded-lg backdrop-blur-sm">
                    <p className="font-semibold">Shift Completed</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Stats - Simplified for now */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Working Days</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalDays}</p>
            </div>
            <div className="bg-card rounded-xl border border-border/50 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Present</p>
              <p className="text-2xl font-bold text-success">{stats.present}</p>
            </div>
            {/* Placeholders for other stats until API supports them */}
          </div>

          {/* Attendance Table */}
          <div className="bg-card rounded-xl border border-border/50 shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Attendance History</h3>
              <div className="flex items-center gap-2">
                {/* Pagination Placeholders */}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check In</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Check Out</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Hours Worked</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    records.map((record, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-foreground">{new Date(record.date).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <LogIn className="w-4 h-4 text-success" />
                            <span className="text-foreground">
                              {record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <LogOut className="w-4 h-4 text-destructive" />
                            <span className="text-foreground">
                              {record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                            </span>
                          </div>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeAttendance;
