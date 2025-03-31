import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Use SecureStore if you want more security
import {User} from '../types/user.auth.types';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuthData: (accessToken: string, refreshToken: string, user: User) => void;
  clearAuthData: () => void;
  reloadUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Explicitly type 'children' as ReactNode
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load authentication data from AsyncStorage on component mount
  useEffect(() => {
    const loadAuthData = async () => {
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedAccessToken && storedRefreshToken && storedUser) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      }
    };

    loadAuthData();
  }, []);

  // Function to set authentication data and store it in AsyncStorage
  const setAuthData = async (
    newAccessToken: string,
    newRefreshToken: string,
    newUser: User,
  ) => {
    try {
      // Fetch the current authentication data from AsyncStorage
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      const storedUser = await AsyncStorage.getItem('user');
      const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;

      console.log('Fetched data from AsyncStorage:', {
        storedAccessToken,
        storedRefreshToken,
        parsedStoredUser,
      });

      // Update access token if it's provided and different
      if (newAccessToken && newAccessToken !== storedAccessToken) {
        setAccessToken(newAccessToken);
        await AsyncStorage.setItem('accessToken', newAccessToken);
        console.log('Access token updated successfully');
      }

      // Update refresh token if it's provided and different
      if (newRefreshToken && newRefreshToken !== storedRefreshToken) {
        setRefreshToken(newRefreshToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        console.log('Refresh token updated successfully');
      }

      // Update user data if it's provided and different
      if (
        newUser &&
        JSON.stringify(parsedStoredUser) !== JSON.stringify(newUser)
      ) {
        setUser(newUser);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        console.log('User data updated successfully');
      }
    } catch (error) {
      console.error('Error updating authentication data:', error);
    }
  };

  // Function to clear authentication data from both state and AsyncStorage
  const clearAuthData = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');
  };

  // Function to reload user data from AsyncStorage
  const reloadUserData = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        setAuthData,
        clearAuthData,
        reloadUserData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthProvider, useAuth};
