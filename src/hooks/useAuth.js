import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const isAuth = !!token;
        setIsAuthenticated(isAuth);

        // Redirection si authentifié et sur une page publique
        if (isAuth && ['/', '/login', '/register'].includes(window.location.pathname)) {
            navigate('/dashboard');
        }
        // Redirection si non authentifié et sur une page privée
        else if (!isAuth && window.location.pathname.startsWith('/dashboard')) {
            navigate('/');
        }

        const handleStorageChange = () => {
            const token = localStorage.getItem('authToken');
            setIsAuthenticated(!!token);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate]);

    const login = (token, userData) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setIsAuthenticated(true);
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        navigate('/');
    };

    return {
        isAuthenticated,
        login,
        logout
    };
}