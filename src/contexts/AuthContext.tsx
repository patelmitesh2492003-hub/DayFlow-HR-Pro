import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    department?: string;
    position?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(authAPI.getStoredUser());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Verify token validity on load
        const verifyAuth = async () => {
            if (authAPI.isAuthenticated()) {
                try {
                    const userData = await authAPI.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error("Auth verification failed:", error);
                    authAPI.logout();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        verifyAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authAPI.login(email, password);
        setUser(response.user);
    };

    const register = async (data: any) => {
        const response = await authAPI.register(data);
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
            isLoading,
            login,
            register,
            logout
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
