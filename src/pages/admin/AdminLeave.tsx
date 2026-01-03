import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  MessageSquare,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { leaveAPI, employeesAPI } from "@/lib/api";

const AdminLeave = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [remarks, setRemarks] = useState("");
  const { toast } = useToast();

  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const [leaveData, userData] = await Promise.all([
        leaveAPI.getAll(),
        employeesAPI.getAll()
      ]);

      const userMap = new Map();
      userData.forEach((u: any) => userMap.set(u.id, u));

      // Combine and format
      const combined = leaveData.map((l: any) => {
        const user = userMap.get(l.user_id) || {};
        const start = new Date(l.start_date);
        const end = new Date(l.end_date);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        return {
          ...l,
          employeeName: user.name || "Unknown",
          employeeId: `EMP${user.id}`,
          department: user.department || "N/A",
          days,
          avatar: user.name ? user.name[0].toUpperCase() : "?"
        };
      });

      // Sort pending first, then by date recent
      combined.sort((a: any, b: any) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setRequests(combined);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.employeeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || request.leave_type === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

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
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const styles: any = {
      paid: "bg-primary/10 text-primary",
      sick: "bg-warning/10 text-warning",
      unpaid: "bg-muted text-muted-foreground"
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[type] || styles.unpaid}`}>
        {type ? (type.charAt(0).toUpperCase() + type.slice(1)) : 'Unknown'} Leave
      </span>
    );
  };

  const updateStatus = async (status: string) => {
    if (!selectedRequest) return;
    try {
      await leaveAPI.updateStatus(selectedRequest.id, status);
      toast({
        title: `Leave ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `${selectedRequest.employeeName}'s leave request has been ${status}.`,
        variant: status === 'rejected' ? "destructive" : "default"
      });
      setSelectedRequest(null);
      setRemarks("");
      fetchLeaves(); // Refresh list
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update status",
        variant: "destructive"
      });
    }
  };

  const handleApprove = () => updateStatus('approved');
  const handleReject = () => updateStatus('rejected');

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="pl-64">
        <DashboardHeader
          title="Leave Management"
          subtitle="Review and manage employee leave requests"
        >
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 text-warning rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{pendingCount} pending requests</span>
            </div>
          )}
        </DashboardHeader>

        <div className="p-8">
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-card rounded-xl border border-border/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
                      <p className="text-3xl font-bold text-warning">{pendingCount}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Approved Total</p>
                      <p className="text-3xl font-bold text-success">
                        {requests.filter(r => r.status === 'approved').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rejected Total</p>
                      <p className="text-3xl font-bold text-destructive">
                        {requests.filter(r => r.status === 'rejected').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-destructive" />
                    </div>
                  </div>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Paid">Paid Leave</SelectItem>
                    <SelectItem value="Sick">Sick Leave</SelectItem>
                    <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Leave Requests List */}
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`bg-card rounded-xl border shadow-sm p-6 transition-all hover:shadow-md ${request.status === 'pending' ? 'border-warning/30' : 'border-border/50'
                      }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl shadow-md text-primary font-bold">
                          {request.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{request.employeeName}</h3>
                            <span className="text-sm text-muted-foreground">({request.employeeId})</span>
                            {getTypeBadge(request.leave_type)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{request.department}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</span>
                              <span className="font-medium text-foreground">({request.days} days)</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 italic">"{request.reason}"</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">Applied: {new Date(request.created_at).toLocaleDateString()}</p>

                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No leave requests found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Leave Request</DialogTitle>
              <DialogDescription>
                {selectedRequest?.employeeName} - {selectedRequest?.leave_type?.toUpperCase()} Leave ({selectedRequest?.days} days)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Request Details</p>
                <p className="font-medium">{new Date(selectedRequest?.start_date).toLocaleDateString()} - {new Date(selectedRequest?.end_date).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground mt-2">"{selectedRequest?.reason}"</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Add Remarks (Optional)
                </label>
                <Textarea
                  placeholder="Add any comments or remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="min-h-20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleReject}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleApprove}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminLeave;
