const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
};

// ============= AUTH API =============

export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    register: async (userData: {
        email: string;
        password: string;
        name: string;
        role?: string;
        department?: string;
        position?: string;
        phone?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        return fetchWithAuth('/auth/me');
    },

    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!getAuthToken();
    },
};

// ============= EMPLOYEES API =============

export const employeesAPI = {
    getAll: async () => {
        return fetchWithAuth('/employees');
    },

    getById: async (id: number) => {
        return fetchWithAuth(`/employees/${id}`);
    },

    update: async (id: number, data: any) => {
        return fetchWithAuth(`/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};

// ============= ATTENDANCE API =============

export const attendanceAPI = {
    checkIn: async () => {
        return fetchWithAuth('/attendance/checkin', {
            method: 'POST',
        });
    },

    checkOut: async () => {
        return fetchWithAuth('/attendance/checkout', {
            method: 'POST',
        });
    },

    getRecords: async (params?: {
        userId?: number;
        startDate?: string;
        endDate?: string;
    }) => {
        const queryParams = new URLSearchParams();
        if (params?.userId) queryParams.append('userId', params.userId.toString());
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);

        const queryString = queryParams.toString();
        return fetchWithAuth(`/attendance${queryString ? `?${queryString}` : ''}`);
    },
};

// ============= LEAVE API =============

export const leaveAPI = {
    create: async (data: {
        leave_type: string;
        start_date: string;
        end_date: string;
        reason: string;
    }) => {
        return fetchWithAuth('/leave', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getAll: async () => {
        return fetchWithAuth('/leave');
    },

    updateStatus: async (id: number, status: string) => {
        return fetchWithAuth(`/leave/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

// ============= PAYROLL API =============

export const payrollAPI = {
    getAll: async () => {
        return fetchWithAuth('/payroll');
    },

    create: async (data: {
        user_id: number;
        month: string;
        year: number;
        basic_salary: number;
        allowances?: number;
        deductions?: number;
    }) => {
        return fetchWithAuth('/payroll', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============= DASHBOARD API =============

export const dashboardAPI = {
    getStats: async () => {
        return fetchWithAuth('/stats/dashboard');
    },
};

// ============= SETTINGS API =============

export const settingsAPI = {
    get: async () => {
        return fetchWithAuth('/settings');
    },
    update: async (settings: any) => {
        return fetchWithAuth('/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }
};

// ============= REPORTS API =============

export const reportsAPI = {
    getSummary: async () => {
        return fetchWithAuth('/reports');
    }
};

// ============= HEALTH CHECK =============

export const healthAPI = {
    check: async () => {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.json();
    },
};
