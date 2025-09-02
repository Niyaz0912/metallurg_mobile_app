import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginService } from '../services/authService';
import { LoginData, User } from '../types/auth';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';

// --- Helper functions for platform-specific storage ---

async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem('userToken', token);
    } catch (e) {
      console.error("Failed to save token to localStorage", e);
    }
  } else {
    await SecureStore.setItemAsync('userToken', token);
  }
}

async function getToken() {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem('userToken');
    } catch (e) {
      console.error("Failed to get token from localStorage", e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync('userToken');
  }
}

async function deleteToken() {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem('userToken');
    } catch (e) {
      console.error("Failed to remove token from localStorage", e);
    }
  } else {
    await SecureStore.deleteItemAsync('userToken');
  }
}


// --- Auth Context ---

interface AuthContextData {
  user: User | null;
  token: string | null;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const storedToken = await getToken();
      
      if (storedToken) {
        try {
          const decodedToken: { user: User } = jwtDecode(storedToken);
          setUser(decodedToken.user);
          setToken(storedToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } catch (e) {
          console.error("Failed to decode token", e);
          // Token is invalid, so we clear it
          await deleteToken();
        }
      }
      setIsLoading(false);
    }

    loadStoragedData();
  }, []);

  const login = async (credentials: LoginData) => {
    const response = await loginService(credentials);
    const { token: responseToken } = response;

    const decodedToken: User = jwtDecode(responseToken);
    setUser(decodedToken);
    setToken(responseToken);

    api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;

    await saveToken(responseToken);
  };

  const logout = async () => {
    await deleteToken();
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}