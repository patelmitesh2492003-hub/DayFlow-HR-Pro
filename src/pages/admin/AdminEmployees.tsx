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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Eye,
  Edit2,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
  avatar: string;
}

const mockEmployees: Employee[] = [
  { id: "EMP001", name: "John Doe", email: "john.doe@company.com", phone: "+1 555-0101", department: "Engineering", designation: "Senior Software Engineer", status: "Active", joinDate: "Mar 15, 2023", avatar: "👨‍💻" },
  { id: "EMP002", name: "Sarah Johnson", email: "sarah.j@company.com", phone: "+1 555-0102", department: "Engineering", designation: "Tech Lead", status: "Active", joinDate: "Jan 10, 2022", avatar: "👩‍💻" },
  { id: "EMP003", name: "Michael Chen", email: "m.chen@company.com", phone: "+1 555-0103", department: "Design", designation: "UI/UX Designer", status: "Active", joinDate: "Jun 20, 2023", avatar: "👨‍🎨" },
  { id: "EMP004", name: "Emily Davis", email: "emily.d@company.com", phone: "+1 555-0104", department: "Marketing", designation: "Marketing Manager", status: "On Leave", joinDate: "Feb 5, 2022", avatar: "👩‍💼" },
  { id: "EMP005", name: "James Wilson", email: "j.wilson@company.com", phone: "+1 555-0105", department: "Sales", designation: "Sales Executive", status: "Active", joinDate: "Aug 12, 2023", avatar: "👨‍💼" },
  { id: "EMP006", name: "Lisa Anderson", email: "lisa.a@company.com", phone: "+1 555-0106", department: "HR", designation: "HR Coordinator", status: "Active", joinDate: "Apr 3, 2023", avatar: "👩‍💼" },
  { id: "EMP007", name: "David Brown", email: "d.brown@company.com", phone: "+1 555-0107", department: "Finance", designation: "Financial Analyst", status: "Active", joinDate: "Sep 1, 2022", avatar: "👨‍💼" },
  { id: "EMP008", name: "Jennifer Martinez", email: "j.martinez@company.com", phone: "+1 555-0108", department: "Engineering", designation: "Frontend Developer", status: "Inactive", joinDate: "Nov 15, 2021", avatar: "👩‍💻" },
];

const AdminEmployees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const departments = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"];

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: Employee['status']) => {
    const styles = {
      'Active': "bg-success/10 text-success",
      'On Leave': "bg-warning/10 text-warning",
      'Inactive': "bg-muted text-muted-foreground"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Employee Added",
      description: "New employee has been successfully added to the system.",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="pl-64">
        <DashboardHeader 
          title="Employees"
          subtitle="Manage your organization's workforce"
        >
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the details for the new employee
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="empId">Employee ID</Label>
                    <Input id="empId" placeholder="EMP009" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empName">Full Name</Label>
                    <Input id="empName" placeholder="John Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empEmail">Email</Label>
                  <Input id="empEmail" type="email" placeholder="john@company.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empPhone">Phone</Label>
                  <Input id="empPhone" type="tel" placeholder="+1 555-0100" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="empDept">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empDesig">Designation</Label>
                    <Input id="empDesig" placeholder="Software Engineer" required />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Employee
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </DashboardHeader>
        
        <div className="p-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Employee Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <div 
                key={employee.id}
                className="bg-card rounded-xl border border-border/50 shadow-sm p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl shadow-md">
                    {employee.avatar}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground text-lg">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.designation}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">{employee.id}</span>
                  {getStatusBadge(employee.status)}
                </div>
              </div>
            ))}
          </div>
          
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No employees found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminEmployees;
