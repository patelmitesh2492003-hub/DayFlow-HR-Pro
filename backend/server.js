import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory database (for hackathon demo)
const db = {
  users: [],
  attendance: [],
  leaveRequests: [],
  payroll: []
};

// Auto-increment IDs
let userIdCounter = 1;
let attendanceIdCounter = 1;
let leaveIdCounter = 1;
let payrollIdCounter = 1;

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============= AUTH ROUTES =============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'employee', department, position, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: userIdCounter++,
      email,
      password: hashedPassword,
      name,
      role,
      department,
      position,
      phone,
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// ============= EMPLOYEE ROUTES =============

// Get all employees (admin only)
app.get('/api/employees', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const employees = db.users.map(({ password, ...user }) => user);
  res.json(employees);
});

// Get single employee
app.get('/api/employees/:id', authenticateToken, (req, res) => {
  const employee = db.users.find(u => u.id === parseInt(req.params.id));

  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const { password, ...employeeWithoutPassword } = employee;
  res.json(employeeWithoutPassword);
});

// Update employee
app.put('/api/employees/:id', authenticateToken, (req, res) => {
  const { name, department, position, phone } = req.body;
  const employeeIndex = db.users.findIndex(u => u.id === parseInt(req.params.id));

  if (employeeIndex === -1) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  db.users[employeeIndex] = {
    ...db.users[employeeIndex],
    name,
    department,
    position,
    phone
  };

  res.json({ message: 'Employee updated successfully' });
});

// ============= ATTENDANCE ROUTES =============

// Check in
app.post('/api/attendance/checkin', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  // Check if already checked in today
  const existing = db.attendance.find(a => a.user_id === req.user.id && a.date === today);

  if (existing) {
    return res.status(400).json({ error: 'Already checked in today' });
  }

  const newAttendance = {
    id: attendanceIdCounter++,
    user_id: req.user.id,
    check_in: new Date().toISOString(),
    check_out: null,
    date: today,
    status: 'present'
  };

  db.attendance.push(newAttendance);

  res.json({ message: 'Checked in successfully', attendance: newAttendance });
});

// Check out
app.post('/api/attendance/checkout', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const attendanceIndex = db.attendance.findIndex(
    a => a.user_id === req.user.id && a.date === today && !a.check_out
  );

  if (attendanceIndex === -1) {
    return res.status(400).json({ error: 'No active check-in found' });
  }

  db.attendance[attendanceIndex].check_out = new Date().toISOString();

  res.json({ message: 'Checked out successfully', attendance: db.attendance[attendanceIndex] });
});

// Get attendance records
app.get('/api/attendance', authenticateToken, (req, res) => {
  const { userId, startDate, endDate } = req.query;

  let records = db.attendance;

  // Filter by user
  if (req.user.role === 'employee') {
    records = records.filter(a => a.user_id === req.user.id);
  } else if (userId) {
    records = records.filter(a => a.user_id === parseInt(userId));
  }

  // Filter by date range
  if (startDate) {
    records = records.filter(a => a.date >= startDate);
  }
  if (endDate) {
    records = records.filter(a => a.date <= endDate);
  }

  // Sort by date descending
  records.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(records);
});

// ============= LEAVE ROUTES =============

// Create leave request
app.post('/api/leave', authenticateToken, (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;

  const newLeave = {
    id: leaveIdCounter++,
    user_id: req.user.id,
    leave_type,
    start_date,
    end_date,
    reason,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  db.leaveRequests.push(newLeave);

  res.status(201).json({
    message: 'Leave request created',
    leave: newLeave
  });
});

// Get leave requests
app.get('/api/leave', authenticateToken, (req, res) => {
  let leaves = db.leaveRequests;

  if (req.user.role === 'employee') {
    leaves = leaves.filter(l => l.user_id === req.user.id);
  }

  // Sort by created_at descending
  leaves.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(leaves);
});

// Update leave status (admin only)
app.put('/api/leave/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { status } = req.body;
  const leaveIndex = db.leaveRequests.findIndex(l => l.id === parseInt(req.params.id));

  if (leaveIndex === -1) {
    return res.status(404).json({ error: 'Leave request not found' });
  }

  db.leaveRequests[leaveIndex].status = status;

  res.json({ message: 'Leave request updated', leave: db.leaveRequests[leaveIndex] });
});

// ============= PAYROLL ROUTES =============

// Get payroll records
app.get('/api/payroll', authenticateToken, (req, res) => {
  let payroll = db.payroll;

  if (req.user.role === 'employee') {
    payroll = payroll.filter(p => p.user_id === req.user.id);
  }

  // Sort by year and month descending
  payroll.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month.localeCompare(a.month);
  });

  res.json(payroll);
});

// Create payroll (admin only)
app.post('/api/payroll', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { user_id, month, year, basic_salary, allowances = 0, deductions = 0 } = req.body;
  const net_salary = basic_salary + allowances - deductions;

  const newPayroll = {
    id: payrollIdCounter++,
    user_id,
    month,
    year,
    basic_salary,
    allowances,
    deductions,
    net_salary,
    created_at: new Date().toISOString()
  };

  db.payroll.push(newPayroll);

  res.status(201).json({
    message: 'Payroll created',
    payroll: newPayroll
  });
});

// ============= SETTINGS ROUTES =============

let systemSettings = {
  companyName: "DayFlow Inc.",
  timezone: "UTC",
  currency: "USD",
  emailNotifications: true
};

app.get('/api/settings', authenticateToken, (req, res) => {
  res.json(systemSettings);
});

app.put('/api/settings', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  systemSettings = { ...systemSettings, ...req.body };
  res.json({ message: 'Settings updated', settings: systemSettings });
});

// ============= REPORTS ROUTES =============

app.get('/api/reports', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // Mock report data
  const reportData = {
    monthlyAttendance: [85, 88, 92, 90, 95, 89], // Last 6 months
    departmentCosts: {
      Engineering: 45000,
      Design: 15000,
      Marketing: 18000,
      Sales: 12000,
      HR: 10000
    },
    hiringStats: [2, 1, 3, 0, 2, 4]
  };

  res.json(reportData);
});

// ============= DASHBOARD STATS =============

app.get('/api/stats/dashboard', authenticateToken, (req, res) => {
  const stats = {};

  if (req.user.role === 'admin') {
    // Total employees
    stats.totalEmployees = db.users.filter(u => u.role === 'employee').length;

    // Today's attendance
    const today = new Date().toISOString().split('T')[0];
    stats.presentToday = db.attendance.filter(a => a.date === today && a.status === 'present').length;

    // Pending leave requests
    stats.pendingLeaves = db.leaveRequests.filter(l => l.status === 'pending').length;

    // Recent attendance with user info
    stats.recentAttendance = db.attendance
      .slice(-10)
      .reverse()
      .map(a => {
        const user = db.users.find(u => u.id === a.user_id);
        return {
          ...a,
          name: user?.name,
          email: user?.email
        };
      });
  } else {
    // Employee stats
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = db.attendance.find(a => a.user_id === req.user.id && a.date === today);

    stats.checkedInToday = !!todayAttendance;
    stats.checkInTime = todayAttendance?.check_in || null;
    stats.checkOutTime = todayAttendance?.check_out || null;

    // Leave balance (simplified - assuming 20 days annual leave)
    const currentYear = new Date().getFullYear();
    const approvedLeaves = db.leaveRequests.filter(
      l => l.user_id === req.user.id &&
        l.status === 'approved' &&
        new Date(l.start_date).getFullYear() === currentYear
    );

    const usedDays = approvedLeaves.reduce((sum, leave) => {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }, 0);

    stats.leaveBalance = 20 - usedDays;
    stats.pendingLeaves = db.leaveRequests.filter(l => l.user_id === req.user.id && l.status === 'pending').length;
  }

  res.json(stats);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Dayflow API is running',
    users: db.users.length,
    attendance: db.attendance.length,
    leaves: db.leaveRequests.length,
    payroll: db.payroll.length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dayflow API server running on http://localhost:${PORT}`);
  console.log(`📊 In-memory database initialized`);
  console.log(`✅ Ready for hackathon demo!`);
});
