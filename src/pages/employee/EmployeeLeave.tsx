import EmployeeSidebar from "@/components/layout/EmployeeSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { leaveAPI, dashboardAPI } from "@/lib/api";

type LeaveStatus = 'pending' | 'approved' | 'rejected';
type LeaveType = 'paid' | 'sick' | 'unpaid';

const EmployeeLeave = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Leave Form State
  const [formData, setFormData] = useState({
    leave_type: 'paid',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const [leaveBalance, setLeaveBalance] = useState({
    paid: { total: 15, used: 0, remaining: 15 },
    sick: { total: 10, used: 0, remaining: 10 },
    unpaid: { total: 5, used: 0, remaining: 5 },
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch leave history
      const data = await leaveAPI.getAll();
      setRequests(data);

      // Fetch dashboard stats for accurate balance calculation from backend (optional, or calc here)
      // Since backend has simple logic (Total 20), let's calculate locally for more detail per type
      // Filter approved requests
      const approved = data.filter((r: any) => r.status === 'approved');

      const calculateUsed = (type: string) => {
        return approved
          .filter((r: any) => r.leave_type === type)
          .reduce((acc: number, r: any) => {
            const start = new Date(r.start_date);
            const end = new Date(r.end_date);
            const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
            return acc + days;
          }, 0);
      };

      setLeaveBalance({
        paid: { total: 15, used: calculateUsed('paid'), remaining: 15 - calculateUsed('paid') },
        sick: { total: 10, used: calculateUsed('sick'), remaining: 10 - calculateUsed('sick') },
        unpaid: { total: 5, used: calculateUsed('unpaid'), remaining: 5 - calculateUsed('unpaid') },
      });

    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leaveAPI.create(formData);
      toast({
        title: "Leave Request Submitted",
        description: "Your leave request has been sent for approval.",
      });
      setIsDialogOpen(false);
      fetchData(); // Refresh list
      setFormData({ leave_type: 'paid', start_date: '', end_date: '', reason: '' }); // Reset form
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Could not submit leave request",
        variant: "destructive"
      });
    }
  };

  // Helper to calculate days between dates
  const getDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-destructive" />;
      default: return <AlertCircle className="w-5 h-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-warning/10 text-warning border-warning/20",
      approved: "bg-success/10 text-success border-success/20",
      rejected: "bg-destructive/10 text-destructive border-destructive/20"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getLeaveTypeBadge = (type: string) => {
    const styles: any = {
      paid: "bg-primary/10 text-primary",
      sick: "bg-warning/10 text-warning",
      unpaid: "bg-muted text-muted-foreground"
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type] || styles.unpaid}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Leave
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <EmployeeSidebar />

      <main className="pl-64">
        <DashboardHeader
          title="Leave Management"
          subtitle="Apply for leave and track your requests"
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select
                    value={formData.leave_type}
                    onValueChange={(val) => setFormData({ ...formData, leave_type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Leave ({leaveBalance.paid.remaining} days remaining)</SelectItem>
                      <SelectItem value="sick">Sick Leave ({leaveBalance.sick.remaining} days remaining)</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave ({leaveBalance.unpaid.remaining} days remaining)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave request"
                    className="min-h-24"
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </DashboardHeader>

        <div className="p-8">
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Leave Balance Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Paid Leave</h3>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">{leaveBalance.paid.remaining}</span>
                    <span className="text-muted-foreground mb-1">/ {leaveBalance.paid.total} days</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(leaveBalance.paid.remaining / leaveBalance.paid.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Sick Leave</h3>
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-warning">{leaveBalance.sick.remaining}</span>
                    <span className="text-muted-foreground mb-1">/ {leaveBalance.sick.total} days</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning rounded-full transition-all duration-500"
                      style={{ width: `${(leaveBalance.sick.remaining / leaveBalance.sick.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Unpaid Leave</h3>
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-foreground">{leaveBalance.unpaid.remaining}</span>
                    <span className="text-muted-foreground mb-1">/ {leaveBalance.unpaid.total} days</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground/50 rounded-full transition-all duration-500"
                      style={{ width: `${(leaveBalance.unpaid.remaining / leaveBalance.unpaid.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Leave Requests */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Leave Requests</h3>
                </div>

                <div className="divide-y divide-border">
                  {requests.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      No leave requests found.
                    </div>
                  ) : (
                    requests.map((request) => (
                      <div key={request.id} className="p-6 hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {getStatusIcon(request.status)}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {getLeaveTypeBadge(request.leave_type)}
                                <span className="text-sm text-muted-foreground">#{request.id}</span>
                              </div>
                              <p className="font-medium text-foreground mb-1">
                                {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()} ({getDays(request.start_date, request.end_date)} days)
                              </p>
                              <p className="text-sm text-muted-foreground">{request.reason}</p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(request.status)}
                            <span className="text-xs text-muted-foreground">Applied: {new Date(request.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeLeave;
