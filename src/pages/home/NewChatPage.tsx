import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {ContactsContext} from '../../contexts/ContactsContext';
import getContacts from '../../utils/getContacts';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';
import SearchIcon from '../../components/Icons/SearchIcon/SearchIcon';
import AddIcon from '../../components/Icons/AddIcon/AddIcon';
import {Colors} from '../../components/Colors/Colors';
import MarkItemIcon from '../../components/Icons/MarkItemIcon/MarkItemIcon';
import {logoImage} from '../../components/Images/DefinedImages';
import {useNavigation} from '@react-navigation/native';
import ArrowLeftIcon from '../../components/Icons/Arrows/ArrowLeftIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {};

const ChatsPage = (props: Props) => {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem(
          'online_user_contacts',
        );
        if (storedContacts) {
          const parsedContacts = JSON.parse(storedContacts);
          setOnlineUsers(parsedContacts);
          console.log('📥 Retrieved online users:', parsedContacts);
        } else {
          console.log('⚠️ No online users found in AsyncStorage.');
        }
      } catch (error) {
        console.error('❌ Error retrieving online users:', error);
      }
    };

    fetchOnlineUsers();
  }, []);

  const {contacts, setContacts} = useContext(ContactsContext)!;
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const sortedContacts = [...contacts].sort((a, b) =>
    a.contactName.localeCompare(b.contactName),
  );
  const filteredContacts = sortedContacts.filter(contact =>
    contact.contactName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const fetchContacts = async () => {
      await getContacts(setContacts);
      setIsLoading(false);
    };

    fetchContacts();
  }, [setContacts]);

  const handleContactPress = (contactIndex: number) => {
    if (isSelectionMode) {
      // Toggle selection state
      setSelectedContacts(prevState => {
        if (prevState.includes(contactIndex)) {
          return prevState.filter(id => id !== contactIndex);
        } else {
          return [...prevState, contactIndex];
        }
      });
    } else {
      // If not in selection mode, log contact details
      console.log('Contact Details:', contacts[contactIndex]);
    }
  };

  const handleMarkAsRead = () => {
    console.log('Marking selected contacts as read:', selectedContacts);
    // You can add the logic to mark selected contacts as read
    setIsSelectionMode(false); // Exit selection mode after marking as read
    setSelectedContacts([]); // Clear the selection
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]); // Deselect all if all are selected
    } else {
      setSelectedContacts(filteredContacts.map((_, index) => index)); // Select all contacts
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: {contactName: string; phoneNumber: string; contactImage?: string};
    index: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedContacts.includes(index) && styles.selectedContact, // Highlight selected contacts
      ]}
      onPress={() => handleContactPress(index)}>
      <View style={styles.contactImageContainer}>
        <Image
          source={item.contactImage ? {uri: item.contactImage} : logoImage}
          style={styles.contactImage}
        />
      </View>
      <View style={styles.contactTextContainer}>
        <BoldText style={styles.contactName}>{item.contactName}</BoldText>
        <RegularText style={styles.contactNumber}>
          {item.phoneNumber}
        </RegularText>
      </View>
      {isSelectionMode && (
        <TouchableOpacity
          onPress={() => handleContactPress(index)}
          style={[
            styles.checkbox,
            selectedContacts.includes(index) && styles.checkboxSelected,
          ]}
        />
      )}
    </TouchableOpacity>
  );

  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{padding: 12}}>
        <ArrowLeftIcon color={Colors.whiteColor} width={32} />
      </TouchableOpacity>
      <View style={{padding: 12, marginBottom: 120}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <BoldText style={styles.pageTitle}>Chats</BoldText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
            }}>
            <TouchableOpacity onPress={() => setIsSelectionMode(prev => !prev)}>
              <MarkItemIcon color={Colors.whiteColor} />
            </TouchableOpacity>
            <AddIcon color={Colors.whiteColor} />
          </View>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Contacts"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <SearchIcon size={30} color={Colors.whiteColor} />

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={onlineUsers}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}


        {isSelectionMode && selectedContacts.length > 0 && (
          <View style={[styles.optionsContainer, {width: width}]}>
            <TouchableOpacity
              onPress={() => {
                console.log('Delete contacts:', selectedContacts);
     
              }}
              style={styles.optionButton}>
              <RegularText style={styles.optionText}>Delete</RegularText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log('Hide contacts:', selectedContacts);
           
              }}
              style={styles.optionButton}>
              <RegularText style={styles.optionText}>Hide</RegularText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSelectAll}
              style={styles.optionButton}>
              <RegularText style={styles.optionText}>
                {selectedContacts.length === filteredContacts.length
                  ? 'Deselect All'
                  : 'Select All'}
              </RegularText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  pageTitle: {
    fontSize: 24,
    marginBottom: 16,
    color: '#fff',
  },
  contactItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff12',
    marginBottom: 10,
    borderRadius: 8,
  },
  selectedContact: {
    backgroundColor: '#3a3a3a', // Highlight selected contacts
  },
  contactImageContainer: {
    marginRight: 12,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  contactNumber: {
    fontSize: 14,
    color: '#555',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  markAsReadButton: {
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  markAsReadText: {
    color: '#fff',
    fontSize: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primaryColor,
  },
  optionsContainer: {
    marginTop: 16,
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
    padding: 12,
    position: 'absolute',
    bottom: -24,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    paddingBottom: 48,
  },
  optionButton: {
    padding: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
});
