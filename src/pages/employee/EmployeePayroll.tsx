import EmployeeSidebar from "@/components/layout/EmployeeSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  Calendar,
  CreditCard,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { payrollAPI } from "@/lib/api";

const EmployeePayroll = () => {
  const [payrollHistory, setPayrollHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        setIsLoading(true);
        const data = await payrollAPI.getAll();
        setPayrollHistory(data);
      } catch (error) {
        console.error("Failed to fetch payroll:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  // Use the most recent record as current payslip
  const currentPayslip = payrollHistory.length > 0 ? payrollHistory[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <EmployeeSidebar />

      <main className="pl-64">
        <DashboardHeader
          title="Payroll"
          subtitle="View your salary details and payslips"
        />

        <div className="p-8">
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !currentPayslip ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border/50">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">No payroll records found.</p>
              <p className="text-muted-foreground">Your salary details will appear here once processed.</p>
            </div>
          ) : (
            <>
              {/* Current Month Overview */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-8 mb-8 text-primary-foreground">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 opacity-80" />
                      <span className="opacity-80">{currentPayslip.month} {currentPayslip.year}</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-1">
                      ${currentPayslip.net_salary.toLocaleString()}
                    </h2>
                    <p className="opacity-80">Net Payable Amount</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="text-center px-6 py-3 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
                      <p className="text-sm opacity-80 mb-1">Pay Date</p>
                      <p className="font-semibold">{new Date(currentPayslip.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-center px-6 py-3 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
                      <p className="text-sm opacity-80 mb-1">Status</p>
                      <p className="font-semibold">{currentPayslip.status || "Paid"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Earnings */}
                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Earnings</h3>
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Basic Salary</span>
                      <span className="font-medium text-foreground">${currentPayslip.basic_salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Allowances</span>
                      <span className="font-medium text-foreground">${currentPayslip.allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-success/5 rounded-lg px-3 -mx-3">
                      <span className="font-semibold text-foreground">Gross Earnings</span>
                      <span className="text-lg font-bold text-success">
                        ${(currentPayslip.basic_salary + currentPayslip.allowances).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Deductions</h3>
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-destructive" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Total Deductions</span>
                      <span className="font-medium text-foreground">-${currentPayslip.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-destructive/5 rounded-lg px-3 -mx-3">
                      <span className="font-semibold text-foreground">Total Deductions</span>
                      <span className="text-lg font-bold text-destructive">-${currentPayslip.deductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-card rounded-xl border border-border/50 shadow-sm">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                    Download All
                  </Button>
                </div>

                <div className="divide-y divide-border">
                  {payrollHistory.map((pay, index) => (
                    <div key={index} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{pay.month} {pay.year}</p>
                          <p className="text-sm text-muted-foreground">Paid on {new Date(pay.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-foreground">${pay.net_salary.toLocaleString()}</p>
                          <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                            {pay.status || "Paid"}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeePayroll;
