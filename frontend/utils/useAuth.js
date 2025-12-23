import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated on mount
        const authStatus = localStorage.getItem('isAuthenticated');
        setIsAuthenticated(authStatus === 'true');
        setIsLoading(false);
    }, []);

    const login = (username, password) => {
        // Hardcoded credentials
        if (username === 'admin' && password === 'admin@123') {
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        router.push('/login');
    };

    const requireAuth = () => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    };

    return {
        isAuthenticated,
        isLoading,
        login,
        logout,
        requireAuth
    };
};
