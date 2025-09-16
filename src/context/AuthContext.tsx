import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginService } from '../services/authService';
import { getCurrentUserProfile } from '../services/userService';
import { LoginData, User, UserRole } from '../types/auth';
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

interface DecodedToken {
  userId: number;
  role: UserRole;
  username: string;
  iat: number;
  exp: number;
}

// --- Auth Context ---

interface AuthContextData {
  user: User | null;
  token: string | null;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isProfileLoading: boolean;
  profileError: string | null;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadUserProfile = async (userId: number) => {
    console.log('🚀 Starting to load user profile for userId:', userId);
    setIsProfileLoading(true);
    setProfileError(null);
    
    try {
      const fullProfile = await getCurrentUserProfile();
      
      // РАСШИРЕННОЕ ДИАГНОСТИЧЕСКОЕ ЛОГИРОВАНИЕ
      console.log('📋 API response from /api/users/me:', fullProfile);
      console.log('🔍 Department check:', {
        hasDepartment: !!fullProfile.department,
        hasDepartmentId: !!fullProfile.departmentId,
        departmentData: fullProfile.department,
        departmentId: fullProfile.departmentId
      });
      
      // ✅ ИСПРАВЛЕННАЯ ЛОГИКА: используем departmentId из ответа сервера
      if (fullProfile.departmentId && !fullProfile.department) {
        console.log('⚠️ Department is null, mapping from departmentId:', fullProfile.departmentId);
        
        const departmentNames: Record<number, string> = {
          1: "Административный",
          2: "HR департамент", 
          3: "Департамент качества",
          4: "Коммерческий департамент",
          5: "Производственный департамент",
          6: "Финансовый департамент"
        };
        
        fullProfile.department = {
          id: fullProfile.departmentId,
          name: departmentNames[fullProfile.departmentId] || `Департамент ${fullProfile.departmentId}`
        };
        
        console.log('✅ Mapped departmentId to department:', fullProfile.department);
      } else if (fullProfile.department) {
        console.log('✅ Department already exists:', fullProfile.department);
        // Убедимся что departmentId синхронизирован с department.id
        if (!fullProfile.departmentId && fullProfile.department.id) {
          fullProfile.departmentId = fullProfile.department.id;
        }
      } else {
        console.log('⚠️ No department info available');
      }
      
      console.log('🎯 Final user profile loaded:', {
        userId: fullProfile.id,
        username: fullProfile.username,
        firstName: fullProfile.firstName,
        lastName: fullProfile.lastName,
        departmentId: fullProfile.departmentId,
        departmentName: fullProfile.department?.name || 'не указан',
        hasAllFields: !!(fullProfile.firstName && fullProfile.lastName && fullProfile.department)
      });
      
      setUser(fullProfile);
    } catch (error) {
      console.error('❌ Failed to load user profile:', error);
      setProfileError('Не удалось загрузить профиль пользователя');
      
      // В случае ошибки создаем базовый объект пользователя из токена
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          const basicUser: User = {
            id: decodedToken.userId,
            username: decodedToken.username,
            role: decodedToken.role,
            firstName: '',
            lastName: ''
          };
          setUser(basicUser);
          console.log('⚠️ Set basic user from token due to profile loading error');
        } catch (tokenError) {
          console.error('❌ Failed to create basic user from token:', tokenError);
        }
      }
    } finally {
      setIsProfileLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (user?.id) {
      console.log('🔄 Refreshing user profile for userId:', user.id);
      await loadUserProfile(user.id);
    } else {
      console.warn('⚠️ Cannot refresh profile: user or user.id is null');
    }
  };

  useEffect(() => {
    async function loadStoragedData() {
      console.log('📦 Loading stored authentication data...');
      const storedToken = await getToken();
      
      if (storedToken) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(storedToken);
          console.log('🔓 Token decoded successfully:', {
            userId: decodedToken.userId,
            username: decodedToken.username,
            role: decodedToken.role,
            exp: new Date(decodedToken.exp * 1000).toISOString()
          });
          
          // Проверяем валидность токена
          if (decodedToken.exp * 1000 < Date.now()) {
            console.log('⏰ Token expired, removing...');
            await deleteToken();
            setIsLoading(false);
            return;
          }

          // Устанавливаем токен и заголовок авторизации
          setToken(storedToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

          // Загружаем полный профиль пользователя
          await loadUserProfile(decodedToken.userId);
          
        } catch (e) {
          console.error("❌ Failed to decode token or load profile:", e);
          await deleteToken();
        }
      } else {
        console.log('📭 No stored token found');
      }
      
      setIsLoading(false);
    }

    loadStoragedData();
  }, []);

  const login = async (credentials: LoginData) => {
    console.log('🔐 Starting login process for user:', credentials.username);
    
    try {
      const response = await loginService(credentials);
      const { token: responseToken } = response;
      
      console.log('🎟️ Login service returned token, decoding...');
      const decodedToken = jwtDecode<DecodedToken>(responseToken);
      
      // Устанавливаем токен и заголовки
      setToken(responseToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${responseToken}`;
      await saveToken(responseToken);
      
      console.log('💾 Token saved, loading full user profile...');
      
      // Загружаем полный профиль после успешного логина
      await loadUserProfile(decodedToken.userId);
      
      console.log('✅ Login process completed successfully');
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('🚪 Starting logout process...');
    
    try {
      await deleteToken();
      setUser(null);
      setToken(null);
      setProfileError(null);
      setIsProfileLoading(false);
      delete api.defaults.headers.common['Authorization'];
      
      console.log('✅ Logout completed successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  const contextValue: AuthContextData = {
    user,
    token,
    login,
    logout,
    isLoading,
    isProfileLoading,
    profileError,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


