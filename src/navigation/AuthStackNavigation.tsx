import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import WelcomeAuthPage from '../pages/auth/WelcomeAuthPage';
import AuthPage from '../pages/auth/AuthPage';
import OTPPage from '../pages/auth/OTPPage';
import UsernamePage from '../pages/auth/UsernamePage';

export type AuthStackParamList = {
  WelcomeAuthPage: undefined;
  AuthPage: undefined;
  OTPPage: {phoneNumber: string};
  UsernamePage: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthStack.Navigator initialRouteName="WelcomeAuthPage">
        <AuthStack.Screen
          name="WelcomeAuthPage"
          component={WelcomeAuthPage}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="AuthPage"
          component={AuthPage}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="OTPPage"
          component={OTPPage}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="UsernamePage"
          component={UsernamePage}
          options={{headerShown: false}}
        />
      </AuthStack.Navigator>
    </GestureHandlerRootView>
  );
};

export default AuthStackNavigator;
