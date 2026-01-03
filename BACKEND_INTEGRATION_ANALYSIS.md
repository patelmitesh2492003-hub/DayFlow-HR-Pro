# Backend Integration Analysis - Dayflow HR Pro

## 📊 **Complete Analysis of Backend Requirements**

This document identifies all frontend pages and components that need backend integration, and provides a roadmap for connecting them to the API.

---

## 🎯 **Current Status**

### ✅ **Backend API Ready**
- **Server**: Running on `http://localhost:3001`
- **Database**: In-memory storage (fully functional)
- **API Endpoints**: 16 endpoints across 6 modules
- **Authentication**: JWT-based auth system

### ⚠️ **Frontend Status**
- **Current State**: Using mock data / setTimeout simulations
- **Integration Status**: API client created but **NOT YET CONNECTED** to pages
- **What's Needed**: Replace all mock implementations with real API calls

---

## 📋 **Pages Requiring Backend Integration**

### **Priority 1: Authentication Pages** 🔐

#### 1. **LoginPage.tsx**
**Location**: `src/pages/LoginPage.tsx`  
**Current Implementation**: Lines 17-39 use `setTimeout` mock  
**Needs Backend For**:
- ✅ User authentication
- ✅ JWT token generation
- ✅ Role-based routing (admin vs employee)

**Current Code**:
```typescript
// Line 21: Simulate login - replace with actual auth
setTimeout(() => {
  // Demo: route based on email domain
  if (email.includes("admin") || email.includes("hr")) {
    navigate("/admin/dashboard");
  } else {
    navigate("/employee/dashboard");
  }
}, 1000);
```

**Required Changes**:
```typescript
import { authAPI } from '@/lib/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const response = await authAPI.login(email, password);
    
    toast({
      title: "Welcome back!",
      description: `Logged in as ${response.user.role}`,
    });
    
    // Route based on actual role from backend
    if (response.user.role === 'admin') {
      navigate("/admin/dashboard");
    } else {
      navigate("/employee/dashboard");
    }
  } catch (error) {
    toast({
      title: "Login failed",
      description: error.message,
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};
```

**Backend Endpoints Used**:
- `POST /api/auth/login`

---

#### 2. **SignupPage.tsx**
**Location**: `src/pages/SignupPage.tsx`  
**Current Implementation**: Lines 27-59 use `setTimeout` mock  
**Needs Backend For**:
- ✅ User registration
- ✅ Password validation
- ✅ Account creation

**Current Code**:
```typescript
// Line 50: Simulate signup - replace with actual auth
setTimeout(() => {
  toast({
    title: "Account created!",
    description: "Please check your email for verification.",
  });
  navigate("/login");
}, 1500);
```

**Required Changes**:
```typescript
import { authAPI } from '@/lib/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation...
  
  setIsLoading(true);
  
  try {
    await authAPI.register({
      email: formData.email,
      password: formData.password,
      name: formData.employeeId, // or collect actual name
      role: formData.role === 'hr' ? 'admin' : 'employee',
      department: '', // collect from form if needed
      position: '',
      phone: ''
    });
    
    toast({
      title: "Account created!",
      description: "You can now sign in",
    });
    navigate("/login");
  } catch (error) {
    toast({
      title: "Signup failed",
      description: error.message,
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};
```

**Backend Endpoints Used**:
- `POST /api/auth/register`

---

### **Priority 2: Dashboard Pages** 📊

#### 3. **AdminDashboard.tsx**
**Location**: `src/pages/admin/AdminDashboard.tsx`  
**Needs Backend For**:
- ✅ Total employee count
- ✅ Today's attendance statistics
- ✅ Pending leave requests count
- ✅ Recent attendance records

**Backend Endpoints Used**:
- `GET /api/stats/dashboard`
- `GET /api/employees`

---

#### 4. **EmployeeDashboard.tsx**
**Location**: `src/pages/employee/EmployeeDashboard.tsx`  
**Needs Backend For**:
- ✅ Check-in status
- ✅ Leave balance
- ✅ Recent attendance history
- ✅ Pending leave requests

**Backend Endpoints Used**:
- `GET /api/stats/dashboard`
- `GET /api/attendance`
- `GET /api/leave`

---

### **Priority 3: Attendance Management** ⏰

#### 5. **EmployeeAttendance.tsx**
**Location**: `src/pages/employee/EmployeeAttendance.tsx`  
**Needs Backend For**:
- ✅ Check-in action
- ✅ Check-out action
- ✅ Attendance history with dates
- ✅ Monthly attendance summary

**Backend Endpoints Used**:
- `POST /api/attendance/checkin`
- `POST /api/attendance/checkout`
- `GET /api/attendance?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

---

#### 6. **AdminAttendance.tsx**
**Location**: `src/pages/admin/AdminAttendance.tsx`  
**Needs Backend For**:
- ✅ View all employee attendance
- ✅ Filter by date range
- ✅ Filter by employee
- ✅ Attendance reports

**Backend Endpoints Used**:
- `GET /api/attendance`
- `GET /api/employees`

---

### **Priority 4: Leave Management** 📅

#### 7. **EmployeeLeave.tsx**
**Location**: `src/pages/employee/EmployeeLeave.tsx`  
**Needs Backend For**:
- ✅ Create leave request
- ✅ View my leave requests
- ✅ Leave request status
- ✅ Leave balance calculation

**Backend Endpoints Used**:
- `POST /api/leave`
- `GET /api/leave`

---

#### 8. **AdminLeave.tsx**
**Location**: `src/pages/admin/AdminLeave.tsx`  
**Needs Backend For**:
- ✅ View all leave requests
- ✅ Approve leave requests
- ✅ Reject leave requests
- ✅ Filter by status/employee

**Backend Endpoints Used**:
- `GET /api/leave`
- `PUT /api/leave/:id` (update status)
- `GET /api/employees`

---

### **Priority 5: Employee Management** 👥

#### 9. **AdminEmployees.tsx**
**Location**: `src/pages/admin/AdminEmployees.tsx`  
**Needs Backend For**:
- ✅ List all employees
- ✅ Add new employee
- ✅ Edit employee details
- ✅ Search/filter employees

**Backend Endpoints Used**:
- `GET /api/employees`
- `POST /api/auth/register` (for new employees)
- `PUT /api/employees/:id`

---

#### 10. **EmployeeProfile.tsx**
**Location**: `src/pages/employee/EmployeeProfile.tsx`  
**Needs Backend For**:
- ✅ View current user profile
- ✅ Update profile information
- ✅ Change password (if implemented)

**Backend Endpoints Used**:
- `GET /api/auth/me`
- `PUT /api/employees/:id`

---

### **Priority 6: Payroll Management** 💰

#### 11. **EmployeePayroll.tsx**
**Location**: `src/pages/employee/EmployeePayroll.tsx`  
**Needs Backend For**:
- ✅ View my payroll records
- ✅ View salary breakdown
- ✅ Download payslips

**Backend Endpoints Used**:
- `GET /api/payroll`

---

#### 12. **AdminPayroll.tsx**
**Location**: `src/pages/admin/AdminPayroll.tsx`  
**Needs Backend For**:
- ✅ View all payroll records
- ✅ Create payroll for employees
- ✅ Update payroll
- ✅ Generate payroll reports

**Backend Endpoints Used**:
- `GET /api/payroll`
- `POST /api/payroll`
- `GET /api/employees`

---

## 🔧 **Implementation Roadmap**

### **Step 1: Update API Client** (Already Done ✅)
- ✅ Created `src/lib/api.ts` with all API functions
- ✅ Configured environment variables
- ✅ Set up axios/fetch with auth headers

### **Step 2: Add Authentication Context**
Create `src/contexts/AuthContext.tsx`:
```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authAPI.getStoredUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    setUser(response.user);
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### **Step 3: Protect Routes**
Create `src/components/ProtectedRoute.tsx`:
```typescript
import { Navigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  const user = authAPI.getStoredUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### **Step 4: Update App.tsx**
Wrap routes with authentication:
```typescript
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

<AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Employee Routes */}
      <Route path="/employee/dashboard" element={
        <ProtectedRoute><EmployeeDashboard /></ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

### **Step 5: Update Each Page**
For each page listed above:
1. Import the appropriate API function from `@/lib/api`
2. Replace mock data with `useQuery` or `useState + useEffect`
3. Add loading states
4. Add error handling
5. Test with backend

---

## 📝 **Summary**

### **Total Pages Needing Integration**: 12

| Category | Pages | Priority |
|----------|-------|----------|
| Authentication | 2 | 🔴 Critical |
| Dashboards | 2 | 🔴 Critical |
| Attendance | 2 | 🟡 High |
| Leave Management | 2 | 🟡 High |
| Employee Management | 2 | 🟢 Medium |
| Payroll | 2 | 🟢 Medium |

### **Backend Endpoints Created**: 16
- ✅ All endpoints fully functional
- ✅ Authentication working
- ✅ Role-based access control implemented
- ✅ Error handling in place

### **Current Integration Status**: 
**0% Connected** - All pages using mock data

### **Estimated Integration Time**:
- Authentication pages: 2 hours
- Dashboard pages: 3 hours
- Attendance pages: 2 hours
- Leave pages: 2 hours
- Employee pages: 2 hours
- Payroll pages: 2 hours
- **Total**: ~13 hours for complete integration

---

## 🚀 **Quick Start Integration Guide**

To begin integration, start with these critical files:

1. **First**: `LoginPage.tsx` - Get authentication working
2. **Second**: `SignupPage.tsx` - Enable registration
3. **Third**: `EmployeeDashboard.tsx` - Test data flow
4. **Fourth**: `EmployeeAttendance.tsx` - Test CRUD operations
5. **Then**: Continue with other pages

---

## 💡 **Testing Checklist**

For each integrated page:
- [ ] API calls work correctly
- [ ] Loading states displayed
- [ ] Error messages shown
- [ ] Success messages shown
- [ ] Data refreshes after mutations
- [ ] Authentication tokens handled
- [ ] Redirects work properly
- [ ] Role-based access respected

---

**Last Updated**: 2026-01-03  
**Backend Version**: 1.0.0  
**Frontend Version**: 0.0.0  
**Integration Status**: Ready to begin
