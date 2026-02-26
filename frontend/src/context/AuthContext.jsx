import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                // Verify token is still valid FIRST
                const response = await authAPI.getMe();

                // Only set authenticated state after successful verification
                setUser(response.data.data);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(response.data.data));
            }
        } catch (error) {
            // Token is invalid or expired, clear everything
            console.error('Auth verification failed:', error);
            logout(true); // Silent logout since this is automatic
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { user, token, refreshToken } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setIsAuthenticated(true);

            toast.success('Login successful!');
            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            const response = await authAPI.register({ name, email, password, role });
            const { user, token, refreshToken } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setIsAuthenticated(true);

            toast.success('Registration successful!');
            return { success: true, user };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const logout = async (silent = false) => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
            if (!silent) {
                toast.success('Logged out successfully');
            }
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await authAPI.updateProfile(data);
            const updatedUser = response.data.data;

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success('Profile updated successfully');
            return { success: true, user: updatedUser };
        } catch (error) {
            const message = error.response?.data?.message || 'Update failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        checkAuth
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
