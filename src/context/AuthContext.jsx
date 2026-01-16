/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('cndes_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (username, password) => {
        // Simple mock auth for demonstration
        if (username === 'admin' && password === 'admin123') {
            const userData = { name: 'Administrador', role: 'admin' };
            setUser(userData);
            localStorage.setItem('cndes_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cndes_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
