import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStackNavigator from './AuthStackNavigation';
import MainStackNavigator from './MainStackNavigation';
import {useAuth} from '../contexts/useAuth';
import {ContactsContext} from '../contexts/ContactsContext';
import getContacts from '../utils/getContacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PagesNavigator = () => {
  const { accessToken, } = useAuth();
  const {contacts, setContacts} = useContext(ContactsContext)!;
  const [isLoading, setIsLoading] = useState(true);
  const CONTACTS_STORAGE_KEY = 'user_contacts';

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  useEffect(() => {
    getContacts(setContacts);
  }, []);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);
        if (storedContacts) {
          const parsedContacts = JSON.parse(storedContacts);
          console.log('Loaded Contacts:', contacts, parsedContacts);
        } else {
          console.log('No contacts found in storage.');
        }
      } catch (error) {
        console.error('Error loading stored contacts:', error);
      }
    };

    loadContacts();
  }, []);

  // Keep the early return below all hooks
  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {accessToken ? <MainStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default PagesNavigator;
