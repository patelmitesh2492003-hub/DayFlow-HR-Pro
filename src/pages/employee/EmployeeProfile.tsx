import EmployeeSidebar from "@/components/layout/EmployeeSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Briefcase,
  Calendar,
  Edit2,
  Camera,
  FileText
} from "lucide-react";
import { useState } from "react";

const EmployeeProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock employee data
  const employee = {
    id: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, San Francisco, CA 94102",
    department: "Engineering",
    designation: "Senior Software Engineer",
    joinDate: "March 15, 2023",
    manager: "Sarah Johnson",
    employeeType: "Full-time",
    salary: {
      basic: 8000,
      hra: 2000,
      allowances: 1500,
      gross: 11500,
    },
    documents: [
      { name: "Employment Contract", date: "Mar 15, 2023" },
      { name: "ID Proof", date: "Mar 15, 2023" },
      { name: "Tax Declaration", date: "Jan 5, 2026" },
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <EmployeeSidebar />
      
      <main className="pl-64">
        <DashboardHeader 
          title="My Profile"
          subtitle="View and manage your personal information"
        />
        
        <div className="p-8">
          {/* Profile Header */}
          <div className="bg-card rounded-xl border border-border/50 shadow-sm p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl gradient-primary flex items-center justify-center text-4xl shadow-lg">
                  👨‍💻
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
                <p className="text-muted-foreground">{employee.designation}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    {employee.department}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {employee.id}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {employee.joinDate}
                  </span>
                </div>
              </div>
              
              <Button 
                variant={isEditing ? "default" : "outline"} 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="bg-muted p-1">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="job">Job Details</TabsTrigger>
              <TabsTrigger value="salary">Salary Structure</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            {/* Personal Details */}
            <TabsContent value="personal" className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="name" 
                      value={employee.name} 
                      className="pl-11" 
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="email" 
                      value={employee.email} 
                      className="pl-11" 
                      disabled
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      value={employee.phone} 
                      className="pl-11" 
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="address" 
                      value={employee.address} 
                      className="pl-11" 
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Job Details */}
            <TabsContent value="job" className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Job Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Employee ID</p>
                  <p className="font-semibold text-foreground">{employee.id}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Department</p>
                  <p className="font-semibold text-foreground">{employee.department}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Designation</p>
                  <p className="font-semibold text-foreground">{employee.designation}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Reporting Manager</p>
                  <p className="font-semibold text-foreground">{employee.manager}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Employment Type</p>
                  <p className="font-semibold text-foreground">{employee.employeeType}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Join Date</p>
                  <p className="font-semibold text-foreground">{employee.joinDate}</p>
                </div>
              </div>
            </TabsContent>
            
            {/* Salary Structure */}
            <TabsContent value="salary" className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Salary Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span className="font-semibold text-foreground">${employee.salary.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-foreground">${employee.salary.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Other Allowances</span>
                  <span className="font-semibold text-foreground">${employee.salary.allowances.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-primary/5 rounded-lg px-4 -mx-4">
                  <span className="font-semibold text-foreground">Gross Salary</span>
                  <span className="text-xl font-bold text-primary">${employee.salary.gross.toLocaleString()}/month</span>
                </div>
              </div>
            </TabsContent>
            
            {/* Documents */}
            <TabsContent value="documents" className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Uploaded Documents</h3>
              <div className="space-y-3">
                {employee.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">Uploaded: {doc.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default EmployeeProfile;
