import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
    user: string | null;
    login: (name: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('ecowallet_user'));

    const login = (name: string) => {
        localStorage.setItem('ecowallet_user', name);
        setUser(name);
    };

    const logout = () => {
        localStorage.removeItem('ecowallet_user');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};