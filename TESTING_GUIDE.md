# 🧪 Testing Guide - Dayflow HR Pro

Follow these steps to verify the newly implemented backend integration.

## ⚠️ Important Note
Since we are using an **in-memory database**, all data is reset if you restart the backend server. You must create new accounts every time the backend restarts.

---

## 🔐 1. Authentication Flow Testing

### **A. Admin Registration**
1. Navigate to [http://localhost:8080/signup](http://localhost:8080/signup)
2. Fill in the form:
   - **Employee ID**: `ADMIN01`
   - **Email**: `admin@company.com`
   - **Password**: `password123`
   - **Confirm Password**: `password123`
   - **Role**: Select **HR / Admin**
3. Click **Create Account**
   - ✅ Expect: "Account created" toast message
   - ✅ Expect: Redirect to Login page

### **B. Admin Login**
1. On Login page:
   - **Email**: `admin@company.com`
   - **Password**: `password123`
2. Click **Sign In**
   - ✅ Expect: "Welcome back" toast
   - ✅ Expect: Redirect to `/admin/dashboard`
3. **Verify Dashboard**:
   - Check "Total Employees" card. It should show `1`.
   - Check URL is `/admin/dashboard`.

### **C. Employee Registration**
1. Log out (Click "Sign Out" in sidebar)
2. Go to [http://localhost:8080/signup](http://localhost:8080/signup)
3. Fill in the form:
   - **Employee ID**: `EMP001`
   - **Email**: `john@company.com`
   - **Password**: `password123`
   - **Confirm Password**: `password123`
   - **Role**: Select **Employee**
4. Click **Create Account**
   - ✅ Expect: Success message and redirect

### **D. Employee Login**
1. Login with `john@company.com` / `password123`
2. Click **Sign In**
   - ✅ Expect: Redirect to `/employee/dashboard`
3. **Verify Dashboard**:
   - Check the "Welcome back, John!" header (or similar).
   - Check "Today's Status" card says "Not Started" or "Check in now".

---

## 📊 2. Dashboard Data Verification

### **Admin Dashboard** (`/admin/dashboard`)
- **Total Employees**: Should reflect the number of registered users.
- **Present Today**: Should be 0 initially.
- **On Leave**: Should be 0 initially.

### **Employee Dashboard** (`/employee/dashboard`)
- **Today's Status**: Defaults to "Not Started".
- **Leave Balance**: Defaults to 0 (or backend default).
- **Pending Requests**: Defaults to 0.

---

## 🕒 3. Attendance Flow Testing

### **A. Employee Check-In/Out**
1. Log in as **Employee**.
2. Navigate to **Attendance** (Sidebar).
3. **Check In**:
   - Click the big **"Check In"** button.
   - ✅ Expect: "Checked In Successfully" toast.
   - ✅ Expect: "Today's Status" updates with time.
   - ✅ Expect: Button changes to "Check Out".
4. **Check Out**:
   - Click **"Check Out"**.
   - ✅ Expect: "Checked Out Successfully" toast.
   - ✅ Expect: Status changes to "Shift Completed".

### **B. Admin Verification**
1. Log in as **Admin**.
2. Navigate to **Attendance**.
3. **Verify Date**:
   - Check the table list.
   - ✅ Expect: See the Employee's record with Check-In/Out times.
   - ✅ Expect: "Present Today" card count increases.

---

## 📅 4. Leave Management Testing

### **A. Employee Leave Application**
1. Log in as **Employee**.
2. Navigate to **Leave** (Sidebar).
3. **Apply for Leave**:
   - Click **"Apply Leave"**.
   - Fill form (e.g., Sick Leave, Tomorrow's date).
   - Click **"Submit Request"**.
   - ✅ Expect: "Leave Request Submitted" toast.
   - ✅ Expect: New request appears in list with status **Pending**.

### **B. Admin Approval Workflow**
1. Log in as **Admin**.
2. Navigate to **Leave**.
3. **Review Request**:
   - Find the pending request from Step A.
   - Click **"Approve"**.
   - ✅ Expect: "Leave Approved" toast.
   - ✅ Expect: Status badge changes to **Approved**.

### **C. Balance Verification**
1. Log back in as **Employee**.
2. Navigate to **Leave**.
3. **Check Balance**:
   - ✅ Expect: The relevant leave balance (e.g., Sick Leave) should decrease by the number of days applied.
   - ✅ Expect: Status of request is **Approved**.

---

## 💰 5. Payroll Management Testing

### **A. Admin Process Payroll**
1. Log in as **Admin**.
2. Navigate to **Payroll**.
3. **Generate Payroll**:
   - Click **"Process Payroll"**.
   - Select an **Employee** (e.g., John).
   - Enter **Basic Salary** (e.g., 5000), **Allowances**, **Deductions**.
   - Review calculated **Net Pay**.
   - Click **"Confirm Payment"**.
   - ✅ Expect: "Payroll record created successfully" toast.
   - ✅ Expect: New record appears in the table.

### **B. Employee View Payslip**
1. Log in as **Employee** (the one you processed payroll for).
2. Navigate to **Payroll**.
3. **Check History**:
   - ✅ Expect: See the newly created payroll record in the list.
   - ✅ Expect: Correct Net Pay, Basic, Allowances displayed.
   - ✅ Expect: Current Payslip card updates with latest data.

---

## 🛠️ Troubleshooting

- **Login Fails?**
  - Check browser console (F12) for red error messages.
  - Ensure backend is running on port 3001.
  - Remember data is wiped on server restart!

- **"Network Error"?**
  - Verify backend is running: `http://localhost:3001/api/health` should return `{"status":"ok"}`.

---

## 🔜 Next Steps implemented by AI

- [x] **Authentication** (Login/Signup)
- [x] **Dashboards** (Admin/Employee real stats)
- [x] **Attendance** (Check-in/Check-out)
- [x] **Leave Management** (Apply/Approve)
- [x] **Payroll** (View/Admin List/Process Wizard)
