import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import HomePage from '../pages/home/HomePage';
import ChatsPage from '../pages/home/ChatsPage';
import CallsPage from '../pages/home/CallsPage';
import GamesPage from '../pages/home/GamesPage';
import StudioPage from '../pages/home/StudioPage';
import UsernamePage from '../pages/auth/UsernamePage';
import {useAuth} from '../contexts/useAuth';
import {useNavigation} from '@react-navigation/native';
import MessagingScreen from '../pages/messages/MessagingScreen';

export type MainStackParamList = {
  Homepage: undefined;
  ChatsPage: undefined;
  CallsPage: undefined;
  GamesPage: undefined;
  StudioPage: undefined;
  UsernamePage: undefined;
  MessagingScreen: {
    contactUserId: any;
    messagesArrayID: any;
    contactName: any;
    photo: any;
    myUserId: any;
    messagesApiResponse: any;
  };
};

const MainStack = createStackNavigator<MainStackParamList>();

const MainStackNavigator: React.FC = () => {
  const {user, reloadUserData} = useAuth();
  const navigation = useNavigation();

  // // Reload user data if it changes
  // useEffect(() => {
  //   if (user) {
  //     // You can reload the user data whenever user changes or username is updated
  //     reloadUserData();
  //   }
  // }, [user]);

  // // Effect to trigger navigation if user is new
  // useEffect(() => {
  //   if (user?.newUser === false) {
  //     // Navigate to Homepage once the user is no longer 'newUser'
  //     navigation.navigate('Homepage' as never);
  //   }
  // }, [user?.newUser, navigation]);

  // console.log(user?.newUser, 'mainstack')
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MainStack.Navigator initialRouteName={'Homepage'}>
        <MainStack.Screen
          name="Homepage"
          component={HomePage}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="UsernamePage"
          component={UsernamePage}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="ChatsPage"
          component={ChatsPage}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="CallsPage"
          component={CallsPage}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="GamesPage"
          component={GamesPage}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="StudioPage"
          component={StudioPage}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="MessagingScreen"
          component={MessagingScreen}
          options={{headerShown: false}}
        />
      </MainStack.Navigator>
    </GestureHandlerRootView>
  );
};

export default MainStackNavigator;
