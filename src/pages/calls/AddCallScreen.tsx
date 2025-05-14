import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';
import {calllog, userImage} from '../../components/Images/DefinedImages';
import ArrowLeftIcon from '../../components/Icons/Arrows/ArrowLeftIcon';
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStackNavigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
type Contact = {
  name: string;
  phoneNumber: any;
  contactImage: any;
};

type GroupedContacts = {
  [letter: string]: Contact[];
};
type NavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'CallSession'
>;

const AddCallScreen: React.FC = () => {
  const [groupedContacts, setGroupedContacts] = useState<GroupedContacts>({});
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem(
          'online_user_contacts',
        );

        if (storedContacts) {
          const rawContacts = JSON.parse(storedContacts);

          const parsedContacts: Contact[] = rawContacts.map((c: any) => ({
            name: c.contactName || '',
            phoneNumber: c.phoneNumber || '',
            contactImage: c.contactImage || '',
          }));

          setAllContacts(parsedContacts);
          groupContacts(parsedContacts);

          console.log('📥 Retrieved online users:', parsedContacts);
        } else {
          console.log('⚠️ No online users found in AsyncStorage.');
        }
      } catch (error) {
        console.error('❌ Error retrieving online users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnlineUsers();
  }, []);

  useEffect(() => {
    const filtered = allContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    groupContacts(filtered);
  }, [searchQuery]);

  const groupContacts = (contacts: Contact[]) => {
    const validContacts = contacts.filter(
      c => c.name && typeof c.name === 'string',
    );

    const sorted = [...validContacts].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const grouped: GroupedContacts = sorted.reduce((acc, contact) => {
      const firstLetter = contact.name[0]?.toUpperCase() || '#';
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(contact);
      return acc;
    }, {} as GroupedContacts);

    setGroupedContacts(grouped);
  };

  const handleCall = (name: string) => {
    console.log(`📞 Call started with ${name}`);
    navigation.navigate('CallSession', {contactName: name});
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#aaa" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon width={24} height={24} color="#D8D5D1" />
          </TouchableOpacity>
          <Image source={calllog} style={styles.headerImage} />
          <BoldText style={styles.headerText}>Add Call</BoldText>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search contacts"
          placeholderTextColor="#D8D5D190"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Contact List */}
      <ScrollView contentContainerStyle={{padding: 16}}>
        {Object.keys(groupedContacts)
          .sort()
          .map(letter => (
            <View key={letter} style={styles.section}>
              <BoldText style={styles.letter}>{letter}</BoldText>
              {groupedContacts[letter].map((contact, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.contactItem}
                  onPress={() => handleCall(contact.name)}>
                  <Image
                    source={
                      contact.contactImage
                        ? {uri: contact.contactImage}
                        : userImage
                    }
                    style={styles.contactImage}
                  />
                  <View>
                    <BoldText style={styles.contactName}>
                      {contact.name}
                    </BoldText>
                    <RegularText color="#D8D5D165" style={styles.contactPhone}>
                      {contact.phoneNumber}
                    </RegularText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  section: {
    marginBottom: 24,
  },
  letter: {
    fontSize: 16,
    color: '#D8D5D1',
    marginBottom: 4,
  },
  contactItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  contactName: {
    color: '#FFF',
    fontSize: 16,
  },
  contactPhone: {
    fontSize: 14,
    color: '#D8D5D175',
  },
  headerContainer: {
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerImage: {
    width: 24,
    height: 32,
  },
  headerText: {
    color: '#D8D5D1',
    fontSize: 20,
  },
  searchContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    margin: 16,
    borderWidth: 0.167,
    borderColor: '#D8D5D145',
  },
  searchInput: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: Platform.OS === 'android' ? 'LufgaSemiBold' : 'Lufga-SemiBold',
  },
});
