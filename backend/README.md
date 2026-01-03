# Dayflow HR Pro - Backend API

RESTful API backend for Dayflow HR Management System built with Express.js and in-memory storage.

## Features

- 🔐 JWT Authentication
- 👥 Employee Management
- ⏰ Attendance Tracking (Check-in/Check-out)
- 📅 Leave Management
- 💰 Payroll System
- 📊 Dashboard Statistics
- 🗄️ In-memory Database (zero configuration, perfect for hackathons!)

## Quick Start

### Installation

```bash
cd backend
npm install
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Employees

- `GET /api/employees` - Get all employees (admin only)
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee

### Attendance

- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance` - Get attendance records

### Leave

- `POST /api/leave` - Create leave request
- `GET /api/leave` - Get leave requests
- `PUT /api/leave/:id` - Update leave status (admin only)

### Payroll

- `GET /api/payroll` - Get payroll records
- `POST /api/payroll` - Create payroll (admin only)

### Dashboard

- `GET /api/stats/dashboard` - Get dashboard statistics

### Health

- `GET /api/health` - Health check

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Default Test Accounts

You can create accounts via the `/api/auth/register` endpoint.

**Admin Account:**
```json
{
  "email": "admin@dayflow.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "admin",
  "department": "Management",
  "position": "HR Manager"
}
```

**Employee Account:**
```json
{
  "email": "employee@dayflow.com",
  "password": "employee123",
  "name": "John Doe",
  "role": "employee",
  "department": "Engineering",
  "position": "Software Developer"
}
```

## Database

The application uses **in-memory storage** for the hackathon demo. This means:

- ✅ **Zero Configuration**: No database setup required
- ✅ **Fast**: Instant read/write operations
- ✅ **Cross-Platform**: Works on Windows, Mac, Linux
- ⚠️ **Temporary**: Data resets when server restarts
- 💡 **Perfect for Demos**: Great for hackathons and presentations

The in-memory database stores:
- `users` - User accounts
- `attendance` - Attendance records
- `leaveRequests` - Leave requests
- `payroll` - Payroll records

**Note**: For production use, you would replace this with a persistent database like PostgreSQL, MongoDB, or MySQL.

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Tech Stack

- **Express.js** - Web framework
- **In-memory Storage** - Fast, zero-config data storage
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **dotenv** - Environment variables
