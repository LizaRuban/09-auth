'use client';

import { useEffect, type ReactNode } from 'react';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    let isActive = true;

    const initializeAuth = async () => {
      try {
        const isValidSession = await checkSession();

        if (!isValidSession) {
          if (isActive) {
            clearIsAuthenticated();
          }
          return;
        }

        const user = await getMe();

        if (isActive) {
          setUser(user);
        }
      } catch (error) {
        if (isActive) {
          clearIsAuthenticated();
        }

        console.error('Authentication check failed:', error);
      }
    };

    initializeAuth();

    return () => {
      isActive = false;
    };
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
};

export default AuthProvider;
