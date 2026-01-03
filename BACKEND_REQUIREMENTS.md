# Backend Requirements - Quick Reference

## 📊 **Where Backend Integration is Required**

```
┌─────────────────────────────────────────────────────────────────┐
│                     DAYFLOW HR PRO                               │
│                  Backend Integration Map                         │
└─────────────────────────────────────────────────────────────────┘

🌐 PUBLIC PAGES (No Backend)
├── LandingPage.tsx ........................... ✅ Static (No API)
│
🔐 AUTHENTICATION (Backend Required)
├── LoginPage.tsx ............................. ⚠️ NEEDS: POST /api/auth/login
└── SignupPage.tsx ............................ ⚠️ NEEDS: POST /api/auth/register

👤 EMPLOYEE PAGES (Backend Required)
├── EmployeeDashboard.tsx ..................... ⚠️ NEEDS: GET /api/stats/dashboard
├── EmployeeProfile.tsx ....................... ⚠️ NEEDS: GET /api/auth/me, PUT /api/employees/:id
├── EmployeeAttendance.tsx .................... ⚠️ NEEDS: POST /api/attendance/checkin|checkout
│                                                         GET /api/attendance
├── EmployeeLeave.tsx ......................... ⚠️ NEEDS: POST /api/leave, GET /api/leave
└── EmployeePayroll.tsx ....................... ⚠️ NEEDS: GET /api/payroll

🔧 ADMIN PAGES (Backend Required)
├── AdminDashboard.tsx ........................ ⚠️ NEEDS: GET /api/stats/dashboard
├── AdminEmployees.tsx ........................ ⚠️ NEEDS: GET /api/employees
│                                                         PUT /api/employees/:id
├── AdminAttendance.tsx ....................... ⚠️ NEEDS: GET /api/attendance
│                                                         GET /api/employees
├── AdminLeave.tsx ............................ ⚠️ NEEDS: GET /api/leave
│                                                         PUT /api/leave/:id
└── AdminPayroll.tsx .......................... ⚠️ NEEDS: GET /api/payroll
                                                          POST /api/payroll
```

---

## 🎯 **Integration Priority Matrix**

| Page | Current Status | Backend Needs | Priority | Complexity |
|------|---------------|---------------|----------|------------|
| **LoginPage** | Mock setTimeout | POST /auth/login | 🔴 P0 | ⭐ Low |
| **SignupPage** | Mock setTimeout | POST /auth/register | 🔴 P0 | ⭐ Low |
| **EmployeeDashboard** | Mock data | GET /stats/dashboard | 🔴 P1 | ⭐⭐ Medium |
| **AdminDashboard** | Mock data | GET /stats/dashboard | 🔴 P1 | ⭐⭐ Medium |
| **EmployeeAttendance** | Mock data | POST /attendance/*, GET /attendance | 🟡 P2 | ⭐⭐ Medium |
| **AdminAttendance** | Mock data | GET /attendance, /employees | 🟡 P2 | ⭐⭐ Medium |
| **EmployeeLeave** | Mock data | POST /leave, GET /leave | 🟡 P2 | ⭐⭐ Medium |
| **AdminLeave** | Mock data | GET /leave, PUT /leave/:id | 🟡 P2 | ⭐⭐⭐ High |
| **AdminEmployees** | Mock data | GET /employees, PUT /employees/:id | 🟢 P3 | ⭐⭐⭐ High |
| **EmployeeProfile** | Mock data | GET /auth/me, PUT /employees/:id | 🟢 P3 | ⭐⭐ Medium |
| **EmployeePayroll** | Mock data | GET /payroll | 🟢 P3 | ⭐ Low |
| **AdminPayroll** | Mock data | GET /payroll, POST /payroll | 🟢 P3 | ⭐⭐⭐ High |

---

## 🔌 **Backend API Endpoint Coverage**

### Available Endpoints:
```
Authentication (3 endpoints)
├── POST   /api/auth/register ........... Create new user account
├── POST   /api/auth/login .............. User login with credentials
└── GET    /api/auth/me ................. Get current user info

Employees (3 endpoints)
├── GET    /api/employees ............... List all employees (admin)
├── GET    /api/employees/:id ........... Get specific employee
└── PUT    /api/employees/:id ........... Update employee info

Attendance (3 endpoints)
├── POST   /api/attendance/checkin ...... Check in to work
├── POST   /api/attendance/checkout ..... Check out from work
└── GET    /api/attendance .............. Get attendance records

Leave Management (3 endpoints)
├── POST   /api/leave ................... Create leave request
├── GET    /api/leave ................... Get leave requests
└── PUT    /api/leave/:id ............... Update leave status (admin)

Payroll (2 endpoints)
├── GET    /api/payroll ................. Get payroll records
└── POST   /api/payroll ................. Create payroll (admin)

Dashboard Stats (1 endpoint)
└── GET    /api/stats/dashboard ......... Get dashboard statistics

Health Check (1 endpoint)
└── GET    /api/health .................. Server health status
```

**Total**: 16 endpoints ✅ All implemented and tested

---

## 📦 **Files to Modify**

### Core Files (Already Created ✅)
```
src/lib/api.ts ............................ ✅ API client functions
.env ...................................... ✅ API URL configuration
backend/server.js ......................... ✅ Express server
backend/.env .............................. ✅ Backend config
```

### Files Needing Updates (⚠️ Todo)
```
src/pages/LoginPage.tsx ................... ⚠️ Lines 17-39
src/pages/SignupPage.tsx .................. ⚠️ Lines 27-59
src/pages/employee/EmployeeDashboard.tsx .. ⚠️ Full page
src/pages/employee/EmployeeProfile.tsx .... ⚠️ Full page
src/pages/employee/EmployeeAttendance.tsx . ⚠️ Full page
src/pages/employee/EmployeeLeave.tsx ...... ⚠️ Full page
src/pages/employee/EmployeePayroll.tsx .... ⚠️ Full page
src/pages/admin/AdminDashboard.tsx ........ ⚠️ Full page
src/pages/admin/AdminEmployees.tsx ........ ⚠️ Full page
src/pages/admin/AdminAttendance.tsx ....... ⚠️ Full page
src/pages/admin/AdminLeave.tsx ............ ⚠️ Full page
src/pages/admin/AdminPayroll.tsx .......... ⚠️ Full page
```

### New Files to Create (📝 Todo)
```
src/contexts/AuthContext.tsx .............. 📝 Auth state management
src/components/ProtectedRoute.tsx ......... 📝 Route protection
src/hooks/useAuth.ts ...................... 📝 Auth hook (optional)
```

---

## 🎓 **Implementation Example**

### Before (Current - Mock):
```typescript
// LoginPage.tsx - Line 17-39
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  // ⚠️ MOCK: Simulate login - replace with actual auth
  setTimeout(() => {
    if (email.includes("admin")) {
      navigate("/admin/dashboard");
    } else {
      navigate("/employee/dashboard");
    }
    setIsLoading(false);
  }, 1000);
};
```

### After (With Backend):
```typescript
// LoginPage.tsx - Updated
import { authAPI } from '@/lib/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    // ✅ REAL: Call actual backend API
    const response = await authAPI.login(email, password);
    
    toast({
      title: "Welcome back!",
      description: `Logged in as ${response.user.name}`,
    });
    
    // Route based on actual role from backend
    if (response.user.role === 'admin') {
      navigate("/admin/dashboard");
    } else {
      navigate("/employee/dashboard");
    }
  } catch (error: any) {
    toast({
      title: "Login failed",
      description: error.message || "Invalid credentials",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};
```

---

## ⚡ **Quick Integration Steps**

1. **Import API client** in page:
   ```typescript
   import { authAPI, employeesAPI, attendanceAPI, leaveAPI, payrollAPI, dashboardAPI } from '@/lib/api';
   ```

2. **Replace mock with real API call**:
   ```typescript
   // Replace setTimeout/mock data with:
   const data = await employeesAPI.getAll();
   ```

3. **Add error handling**:
   ```typescript
   try {
     const data = await api.call();
   } catch (error) {
     toast({ title: "Error", description: error.message });
   }
   ```

4. **Update state**:
   ```typescript
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   
   useEffect(() => {
     const fetchData = async () => {
       setLoading(true);
       try {
         const result = await api.call();
         setData(result);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     };
     fetchData();
   }, []);
   ```

---

## ✅ **Testing Checklist**

After integrating each page:
- [ ] Backend API returns data successfully
- [ ] Loading state shows during API call
- [ ] Error messages display on API failure
- [ ] Success toasts show after mutations
- [ ] Auth token is sent with requests
- [ ] Role-based access works correctly
- [ ] Page refreshes data after updates
- [ ] Browser console shows no errors

---

## 📊 **Current Progress**

```
Backend API:     ████████████████████ 100% (16/16 endpoints)
API Client:      ████████████████████ 100% (Created src/lib/api.ts)
Page Integration: ░░░░░░░░░░░░░░░░░░░░   0% (0/12 pages)
Testing:         ░░░░░░░░░░░░░░░░░░░░   0%
```

**Next Step**: Start with LoginPage.tsx integration!

---

**Need detailed implementation?** See `BACKEND_INTEGRATION_ANALYSIS.md` for complete guide.
