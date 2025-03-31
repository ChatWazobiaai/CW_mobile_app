import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Colors} from '../../components/Colors/Colors';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';
import CustomButton from '../../components/Buttons/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {authImage} from '../../components/Images/DefinedImages';
import CustomTextInput from '../../components/TextInputs/CustomTextInputs';
import ArrowLeftIcon from '../../components/Icons/Arrows/ArrowLeftIcon';
import {handleApiResponse} from '../../utils/apiRes';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/Store';
import {updateUsername} from '../../redux/user/updateUsernameSlice';
import {useAuth} from '../../contexts/useAuth';

const UsernamePage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null); // Profile photo state
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {setAuthData, reloadUserData} = useAuth();

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setError(text.length < 3 ? 'Username must be at least 3 characters' : null);
  };

  const handleSave = async () => {
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(updateUsername(username)).unwrap();
      setLoading(false);

      const {success, message, data} = handleApiResponse(response);

      if (success) {
        // Update the user object in context
        navigation.navigate('Homepage' as never); // Navigate to the OTP page

        if (data && data.user) {
          setAuthData(response.accessToken, response.refreshToken, data.user); // Pass the updated user here
          reloadUserData()
        }

        // Optionally navigate if you want to
        //navigation.navigate('Homepage' as never); // Navigate to the OTP page
      } else {
        // Show an error message if the update failed
        // Alert.alert('Error', message || 'Failed to update username. Please try again.');
      }
    } catch (error: any) {
      setLoading(false);
      const {success, message, statusCode} = handleApiResponse(error);
      console.log('Error:', success, message, statusCode);

      // Optionally show an alert
      // Alert.alert('Error', message || 'An error occurred. Please try again.');
    }
  };

  const handleSkip = () => {
    navigation.navigate('OTPPage' as never);
  };

  const selectProfilePhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setProfilePhoto(response.assets[0].uri || null);
      }
    });
  };

  const removeProfilePhoto = () => {
    setProfilePhoto(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={authImage} style={styles.backgroundImage}>
        <View style={styles.topBar}>
          {/* <TouchableOpacity
            // onPress={() => navigation.goBack()}
            style={styles.backButton}></TouchableOpacity> */}
          {/* <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <BoldText color={Colors.primaryColor}>Skip</BoldText>
          </TouchableOpacity> */}
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.contentContainer}>
              <BoldText
                fontSize={20}
                color={Colors.whiteColor}
                style={styles.header}>
                What's your Username?
              </BoldText>
              <RegularText
                fontSize={16}
                color={Colors.whiteColor}
                style={styles.subHeader}>
                Please choose a unique username for your account.
              </RegularText>

              {/* Profile Photo Upload */}
              <TouchableOpacity
                style={styles.photoContainer}
                onPress={selectProfilePhoto}>
                {profilePhoto ? (
                  <>
                    <Image
                      source={{uri: profilePhoto}}
                      style={styles.profileImage}
                    />
                    <TouchableOpacity
                      onPress={removeProfilePhoto}
                      style={styles.removePhoto}>
                      <RegularText style={styles.removePhotoText}>
                        Remove
                      </RegularText>
                    </TouchableOpacity>
                  </>
                ) : (
                  <BoldText color={Colors.primaryColor}>
                    Upload Profile Photo (Optional)
                  </BoldText>
                )}
              </TouchableOpacity>

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <CustomTextInput
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="Enter username"
                  label="Username"
                  error={error}
                />
              </View>

              {/* Save Button */}
              <View style={styles.buttonContainer}>
                <CustomButton
                  title={loading ? 'Saving...' : 'Save'}
                  onPress={handleSave}
                  loading={loading}
                  disabled={loading}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackColor,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#161616',
  },
  skipButton: {
    padding: 12,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  contentContainer: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    alignSelf: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 36,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 8,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  removePhoto: {
    marginTop: 8,
    alignSelf: 'center',
  },
  removePhotoText: {
    color: Colors.primaryColor,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default UsernamePage;
