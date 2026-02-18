import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    branch?: string;
    year?: number;
    skills?: string[];
    avatar?: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    branch?: string;
    year?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_URL = '/api';

// Axios instance with auth header
const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.user);
                } catch (error: any) {
                    console.error('Failed to load user:', error.message);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email: string, password: string) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token: newToken, user: userData } = res.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
        } catch (error: any) {
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        const res = await api.post('/auth/register', data);
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (data: Partial<User>) => {
        const res = await api.put('/auth/profile', data);
        setUser(res.data.user);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { api };
