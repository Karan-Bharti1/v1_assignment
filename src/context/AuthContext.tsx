import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isManager: boolean;
  isEngineer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }, [user, token]);

  function login(token: string, user: User) {
    setUser(user);
    setToken(token);
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isManager: user?.role === 'manager',
        isEngineer: user?.role === 'engineer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
