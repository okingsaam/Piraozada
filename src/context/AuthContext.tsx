import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser } from '../types';

interface AuthContextData {
  user: AuthUser | null;
  login: (token: string, loginName?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

const STORAGE_KEY = 'piraozada:user';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem(STORAGE_KEY);

    if (!rawUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as AuthUser;
      if (parsedUser.token) {
        setUser(parsedUser);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback((token: string, loginName?: string) => {
    const authUser: AuthUser = {
      token,
      login: loginName ?? 'usuario',
    };

    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user?.token),
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
