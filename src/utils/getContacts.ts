import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';

const CONTACTS_STORAGE_KEY = 'user_contacts';

// Utility function to get contacts and save them in an array
const getContacts = async (setContacts: React.Dispatch<React.SetStateAction<any>>) => {
    const contactsArray: Array<{
        contactName: string;
        phoneNumber: string;
        recordID: string;
    }> = [];

    try {
        if (Platform.OS === 'android') {
            // Request permission for Android
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contacts Permission',
                    message: 'This app needs access to your contacts.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Contacts permission denied');
                return;
            }
        }

        // Fetch contacts from the device
        const contacts = await Contacts.getAll();
        contacts.forEach((contact) => {
            const { familyName, givenName, middleName, phoneNumbers, recordID } = contact;

            // Create the contact name (concatenation of family, given, and middle name if they exist)
            let contactName = `${familyName ? familyName + ' ' : ''}${givenName ? givenName + ' ' : ''}${middleName || ''}`.trim();

            // If no name, fallback to phone number
            if (!contactName) {
                contactName = phoneNumbers[0] ? phoneNumbers[0].number : 'No Name';
            }

            // Handle multiple phone numbers
            // Handle multiple phone numbers
            phoneNumbers.forEach((phone, index) => {
                // Create a unique contact name based on index if multiple phone numbers exist
                const phoneLabel = phone.label ? ` (${phone.label})` : '';
                const phoneContactName = `${contactName}${phoneLabel}`;

                // Remove spaces from phone number
                const cleanPhoneNumber = phone.number.replace(/\s+/g, '');

                // Save the contact in the array
                contactsArray.push({
                    contactName: phoneContactName,
                    phoneNumber: cleanPhoneNumber,
                    recordID: recordID,
                });
            });
        });

        // Save contacts in state
        setContacts(contactsArray);
        console.log(contactsArray, 'contactsArray')
        // Store contacts in AsyncStorage
        await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contactsArray));

        console.log(contactsArray);
    } catch (e) {
        console.error('Error getting contacts:', e);
    }
};

export default getContacts;