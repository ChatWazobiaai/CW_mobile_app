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
import React, {useEffect, useContext, useState, useMemo} from 'react';
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
import {logoImage, userImage} from '../../components/Images/DefinedImages';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import ArrowLeftIcon from '../../components/Icons/Arrows/ArrowLeftIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainStackParamList} from '../../navigation/MainStackNavigation';
import {useSockets} from '../../contexts/SocketProvider';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/Store';
import {fetchMessages} from '../../redux/messages/messagesSlice';
import {Message} from '../../types/Messages.types';
import {handleApiResponse} from '../../utils/apiRes';

type Props = {};

type ContactType = {
  _id: number;
  contactName: string;
  phoneNumber: string;
  contactImage?: string;
  contactUserId?: string;
  messagesArrayID?: any;
};

const ChatsPage = (props: Props) => {
  const {socket} = useSockets(); // Get the socket instance
  const [isLoading, setIsLoading] = useState(true);
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
          setIsLoading(false);
          console.log('📥 Retrieved online users:', parsedContacts);
        } else {
          console.log('⚠️ No online users found in AsyncStorage.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Error retrieving online users:', error);
      }
    };

    fetchOnlineUsers();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const sortedContacts = useMemo(() => {
    const usersWithId = onlineUsers
      .filter(item => item?.contactUserId)
      .sort((a, b) => a?.contactName?.localeCompare(b?.contactName));

    const usersWithoutId = onlineUsers
      .filter(item => !item.contactUserId)
      .sort((a, b) => a?.contactName?.localeCompare(b?.contactName));

    return [...usersWithId, ...usersWithoutId];
  }, [onlineUsers]);

  const filteredContacts = sortedContacts.filter(contact =>
    contact.contactName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [myUserId, setMyUserId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Local state to store API response separately
  const [apiResponse, setApiResponse] = useState<{messages: Message[]} | null>(
    null,
  );

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setMyUserId(user?._id);
          console.log('📌 Retrieved User ID:', user?._id);
        } else {
          console.error('⚠️ No user found in AsyncStorage');
        }
      } catch (error) {
        console.error('❌ Error retrieving user:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleContactPress = async (selectedContact: ContactType) => {
    console.log('📝 Contact Selected:', selectedContact);
    if (myUserId)
      if (isSelectionMode) {
        setSelectedContacts(prevState =>
          prevState.includes(selectedContact._id)
            ? prevState.filter(id => id !== selectedContact._id)
            : [...prevState, selectedContact._id],
        );
      } else {
        if (selectedContact.contactUserId && selectedContact.messagesArrayID) {
          console.log(
            `🔗 Joining Group: ${selectedContact.messagesArrayID} as User ${selectedContact.contactUserId}`,
          );

          if (socket) {
            socket.emit('joinGroup', {
              groupId: selectedContact.messagesArrayID,
              userId: selectedContact.contactUserId,
            });
            console.log(
              `✅ Emitted joinGroup for Group ${selectedContact.messagesArrayID}`,
            );
          } else {
            console.error('❌ Socket connection is missing!');
          }

          if (myUserId) {
            setApiResponse(null);
            dispatch(fetchMessages(selectedContact?.messagesArrayID))
              .then(response => {
                const apiResult = handleApiResponse(response.payload);

                if (apiResult.success) {
                  setApiResponse(apiResult.data?.messages || []);
                  console.log('✅ API Response:', apiResult);

                  navigation.navigate('MessagingScreen', {
                    contactUserId: selectedContact.contactUserId,
                    messagesArrayID: selectedContact.messagesArrayID,
                    contactName: selectedContact?.contactName,
                    photo: logoImage,
                    myUserId: myUserId,
                    messagesApiResponse: apiResult.data?.messages,
                  });
                } else {
                  console.warn('⚠️', apiResult.message);
                }
              })
              .catch(err => {
                console.error('❌ API Error:', err);
              });

            //   navigation.navigate('MessagingScreen', {
            //     contactUserId: selectedContact.contactUserId,
            //     messagesArrayID: selectedContact.messagesArrayID,
            //     contactName: selectedContact?.contactName,
            //     photo: logoImage,
            //     myUserId: myUserId,
            //     messagesApiResponse: apiResponse,
            //   });
          } else {
            console.error('⚠️ User ID is not available yet.');
          }
        } else {
          console.log(
            `📩 Invite ${selectedContact.contactName} to ChatWazobia AI`,
          );
        }
      }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: {
      contactName: string;
      phoneNumber: string;
      contactImage?: string;
      contactUserId?: string;
    };
    index: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        selectedContacts.includes(index) && styles.selectedContact, // Highlight selected contacts
      ]}
      onPress={() => handleContactPress(item as any)}>
      <View style={styles.contactImageContainer}>
        <Image
          source={item.contactImage ? {uri: item.contactImage} : userImage}
          style={styles.contactImage}
        />
      </View>
      <View style={styles.contactTextContainer}>
        <BoldText style={styles.contactName}>{item.contactName}</BoldText>
        <RegularText style={styles.contactNumber}>
          {item.phoneNumber}
        </RegularText>
      </View>
      {!item.contactUserId ? (
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => console.log(`Invite sent to ${item.contactName}`)}>
          <BoldText style={styles.inviteText}>Invite</BoldText>
        </TouchableOpacity>
      ) : null}

      {isSelectionMode && (
        <TouchableOpacity
          onPress={() => handleContactPress(item as any)}
          style={[
            styles.checkbox,
            selectedContacts.includes(index) && styles.checkboxSelected,
          ]}
        />
      )}
    </TouchableOpacity>
  );

  const {width} = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
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
            data={sortedContacts}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
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

  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    color: '#fff',
    //fontWeight: 'bold',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#555',
  },
  inviteButton: {
    backgroundColor: Colors.grayColor,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 32,
  },
  inviteText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedContact: {
    backgroundColor: '#3a3a3a',
  },
  contactImageContainer: {
    marginRight: 12,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  contactTextContainer: {
    flex: 1,
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
