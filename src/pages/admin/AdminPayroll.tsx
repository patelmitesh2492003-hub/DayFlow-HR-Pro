import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Loader2,
  Plus,
  Calculator
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { payrollAPI, employeesAPI } from "@/lib/api";

const departmentData = [
  { name: 'Engineering', value: 45000, color: 'hsl(243, 75%, 59%)' },
  { name: 'Design', value: 15000, color: 'hsl(160, 84%, 39%)' },
  { name: 'Marketing', value: 18000, color: 'hsl(38, 92%, 50%)' },
  { name: 'Sales', value: 12000, color: 'hsl(280, 65%, 60%)' },
  { name: 'HR', value: 10000, color: 'hsl(190, 80%, 45%)' },
];

const AdminPayroll = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const { toast } = useToast();

  const [payrollRecords, setPayrollRecords] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Process Payroll State
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newPayroll, setNewPayroll] = useState({
    user_id: "",
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    basic_salary: "",
    allowances: "0",
    deductions: "0",
  });

  const fetchPayroll = async () => {
    try {
      setIsLoading(true);
      const [payrollData, userData] = await Promise.all([
        payrollAPI.getAll(),
        employeesAPI.getAll()
      ]);

      setEmployees(userData);

      const userMap = new Map();
      userData.forEach((u: any) => userMap.set(u.id, u));

      const combined = payrollData.map((p: any) => {
        const user = userMap.get(p.user_id) || {};
        return {
          ...p,
          employeeName: user.name || "Unknown",
          employeeId: `EMP${p.user_id}`,
          department: user.department || "N/A",
          designation: user.position || "Employee",
          basic: p.basic_salary,
          netPay: p.net_salary,
          avatar: user.name ? user.name[0].toUpperCase() : "?"
        };
      });
      setPayrollRecords(combined);

    } catch (error) {
      console.error("Failed to fetch payroll:", error);
      toast({
        title: "Error",
        description: "Failed to load payroll data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const totalPayroll = payrollRecords.reduce((sum, p) => sum + p.netPay, 0);
  const pendingCount = payrollRecords.filter(p => !p.status || p.status === 'Pending').length;
  const paidCount = payrollRecords.filter(p => p.status === 'Paid').length;

  const departments = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2024, 2025, 2026, 2027];

  const filteredPayroll = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || (record.status || 'Pending') === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const s = status || 'Pending';
    const styles: any = {
      'Paid': "bg-success/10 text-success",
      'Pending': "bg-warning/10 text-warning",
      'Processing': "bg-primary/10 text-primary"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[s] || styles['Pending']}`}>
        {s}
      </span>
    );
  };

  const handleProcessSubmit = async () => {
    if (!newPayroll.user_id || !newPayroll.basic_salary) {
      toast({
        title: "Missing Information",
        description: "Please select an employee and enter basic salary.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      await payrollAPI.create({
        user_id: parseInt(newPayroll.user_id),
        month: newPayroll.month,
        year: parseInt(newPayroll.year),
        basic_salary: parseFloat(newPayroll.basic_salary),
        allowances: parseFloat(newPayroll.allowances || "0"),
        deductions: parseFloat(newPayroll.deductions || "0"),
      });

      toast({
        title: "Success",
        description: "Payroll record created successfully!",
        className: "bg-success text-white border-none"
      });

      setIsProcessDialogOpen(false);
      setNewPayroll({
        user_id: "",
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear().toString(),
        basic_salary: "",
        allowances: "0",
        deductions: "0",
      });
      fetchPayroll();

    } catch (error) {
      console.error("Failed to process payroll:", error);
      toast({
        title: "Error",
        description: "Failed to create payroll record.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateNetPay = () => {
    const basic = parseFloat(newPayroll.basic_salary) || 0;
    const allowances = parseFloat(newPayroll.allowances) || 0;
    const deductions = parseFloat(newPayroll.deductions) || 0;
    return basic + allowances - deductions;
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="pl-64">
        <DashboardHeader
          title="Payroll Management"
          subtitle="Manage employee salaries and payments"
        >
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={() => setIsProcessDialogOpen(true)}>
              <DollarSign className="w-4 h-4" />
              Process Payroll
            </Button>
          </div>
        </DashboardHeader>

        <div className="p-8">
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-1 bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <p className="text-3xl font-bold">${totalPayroll.toLocaleString()}</p>
                  <p className="opacity-80">Total Payroll (Jan 2026)</p>
                </div>

                <div className="bg-card rounded-xl border border-border/50 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{payrollRecords.length}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>

                <div className="bg-card rounded-xl border border-border/50 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                  </div>
                  <p className="text-2xl font-bold text-warning">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                </div>

                <div className="bg-card rounded-xl border border-border/50 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                  <p className="text-2xl font-bold text-success">{paidCount}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Department Distribution */}
                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Payroll by Department</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => `$${value.toLocaleString()}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {departmentData.slice(0, 4).map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button onClick={() => setIsProcessDialogOpen(true)} className="p-4 bg-muted/50 rounded-xl text-left hover:bg-muted transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <DollarSign className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <p className="font-medium text-foreground">Generate Payslips</p>
                      <p className="text-sm text-muted-foreground">Create payslips for employees</p>
                    </button>
                    <button className="p-4 bg-muted/50 rounded-xl text-left hover:bg-muted transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-3 group-hover:bg-success group-hover:text-success-foreground transition-colors">
                        <TrendingUp className="w-5 h-5 text-success group-hover:text-success-foreground" />
                      </div>
                      <p className="font-medium text-foreground">Salary Revision</p>
                      <p className="text-sm text-muted-foreground">Update salary structures</p>
                    </button>
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
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payroll Table */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Basic</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Allowances</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Deductions</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Net Pay</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPayroll.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                          No payroll records found.
                        </td>
                      </tr>
                    ) : (
                      filteredPayroll.map((record) => (
                        <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                                {record.avatar}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{record.employeeName}</p>
                                <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-foreground">{record.department}</td>
                          <td className="px-6 py-4 text-right text-foreground">${record.basic.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-success">+${record.allowances.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right text-destructive">-${record.deductions.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right font-semibold text-foreground">${record.netPay.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">{getStatusBadge(record.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-1">
                              <Button variant="ghost" size="icon-sm" onClick={() => setSelectedRecord(record)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* View Dialog */}
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Salary Details</DialogTitle>
              <DialogDescription>
                {selectedRecord?.employeeName} - {selectedRecord?.designation}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {selectedRecord?.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedRecord?.employeeName}</p>
                  <p className="text-sm text-muted-foreground">{selectedRecord?.department} • {selectedRecord?.employeeId}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span className="font-medium">${selectedRecord?.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Allowances</span>
                  <span className="font-medium text-success">+${selectedRecord?.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Deductions</span>
                  <span className="font-medium text-destructive">-${selectedRecord?.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-3">
                  <span className="font-semibold">Net Pay</span>
                  <span className="text-xl font-bold text-primary">${selectedRecord?.netPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedRecord(null)}>
                  Close
                </Button>
                <Button className="flex-1">
                  <Download className="w-4 h-4" />
                  Download Payslip
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Process Payroll Dialog */}
        <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Process Payroll</DialogTitle>
              <DialogDescription>
                Create a new payroll record for an employee.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select
                  value={newPayroll.user_id}
                  onValueChange={(val) => setNewPayroll({ ...newPayroll, user_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.name} ({emp.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select
                    value={newPayroll.month}
                    onValueChange={(val) => setNewPayroll({ ...newPayroll, month: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select
                    value={newPayroll.year}
                    onValueChange={(val) => setNewPayroll({ ...newPayroll, year: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Basic Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-9"
                    value={newPayroll.basic_salary}
                    onChange={(e) => setNewPayroll({ ...newPayroll, basic_salary: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Allowances</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
                    <Input
                      type="number"
                      className="pl-9"
                      value={newPayroll.allowances}
                      onChange={(e) => setNewPayroll({ ...newPayroll, allowances: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Deductions</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive rotate-180" />
                    <Input
                      type="number"
                      className="pl-9"
                      value={newPayroll.deductions}
                      onChange={(e) => setNewPayroll({ ...newPayroll, deductions: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Net Pay</span>
                </div>
                <span className="text-xl font-bold text-primary">
                  ${calculateNetPay().toLocaleString()}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleProcessSubmit} disabled={isProcessing}>
                {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminPayroll;
