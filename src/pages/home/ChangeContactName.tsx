import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeContactName = () => {
  const [contactName, setContactName] = useState('');
  const [savedName, setSavedName] = useState('');

  // Function to fetch the saved contact name from AsyncStorage
  const getSavedContactName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('contactName');
      if (storedName) {
        setSavedName(storedName);
        setContactName(storedName);
      }
    } catch (error) {
      console.error('Error fetching contact name:', error);
    }
  };

  // Function to update the contact name in AsyncStorage
  const updateContactName = async () => {
    if (!contactName.trim()) {
      Alert.alert('Validation', 'Please enter a valid name');
      return;
    }

    try {
      await AsyncStorage.setItem('contactName', contactName);
      Alert.alert('Success', 'Contact name updated successfully!');
      setSavedName(contactName);
    } catch (error) {
      console.error('Error saving contact name:', error);
      Alert.alert('Error', 'Failed to update contact name');
    }
  };

  // Fetch the saved name when the component mounts
  React.useEffect(() => {
    getSavedContactName();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Contact Name</Text>

      <Text style={styles.label}>Saved Name:</Text>
      <Text style={styles.savedName}>{savedName || 'No name saved yet'}</Text>

      <Text style={styles.label}>New Name:</Text>
      <TextInput
        style={styles.input}
        value={contactName}
        onChangeText={setContactName}
        placeholder="Enter new contact name"
      />

      <Button title="Save Name" onPress={updateContactName} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  savedName: {
    fontSize: 18,
    marginBottom: 16,
    color: '#555',
    fontStyle: 'italic',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    fontSize: 16,
  },
});

export default ChangeContactName;
