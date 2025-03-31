import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {Colors} from '../../components/Colors/Colors';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';
import CustomButton from '../../components/Buttons/CustomButton';
import CustomTextInput from '../../components/TextInputs/CustomTextInputs';
import {authImage} from '../../components/Images/DefinedImages';
import {useNavigation} from '@react-navigation/native';
import {AuthPageNavigationProp} from '../../types/navigation.params.types';
import {useDispatch, useSelector} from 'react-redux';
import {sendOTP} from '../../redux/Otp/OtpSlice';
import {AppDispatch} from '../../redux/Store';
import {handleApiResponse} from '../../utils/apiRes';

const AuthPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<AuthPageNavigationProp>();

  const dispatch = useDispatch<AppDispatch>();
  const otpState = useSelector((state: any) => state.otp);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    if (text.length < 11) {
      setError('Phone number must be at least 11 digits');
    } else {
      setError(null);
    }
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length < 11) {
      setError('Phone number must be at least 11 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(sendOTP(phoneNumber)).unwrap();
      setLoading(false);
      const {success, message} = handleApiResponse(response);

      if (success) {
        console.log('OTP Sent Successfully:', message);
        navigation.navigate('OTPPage', {phoneNumber});
      } else {
        console.log('Error:', message);
      }
    } catch (error: any) {
      setLoading(false);
      const {success, message, statusCode} = handleApiResponse(error);
      console.log(
        'Error:',
        success,
        message,
        statusCode,
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={authImage} style={styles.backgroundImage}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.contentContainer}>
              <BoldText
                fontSize={20}
                color={Colors.whiteColor}
                style={styles.header}>
                Enter your Phone Number
              </BoldText>
              <RegularText
                fontSize={16}
                color={Colors.whiteColor}
                style={styles.subHeader}>
                Chat WaZoBia will need to verify your account.
              </RegularText>

              <View style={styles.inputContainer}>
                <CustomTextInput
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  placeholder="Enter phone number"
                  numeric
                  label="Phone number"
                  error={error}
                />
              </View>

              <CustomButton
                title={loading ? 'Sending OTP...' : 'Send OTP'}
                onPress={handleSendOtp}
                loading={loading}
                disabled={loading}
              />
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
  button: {
    marginTop: 20,
  },
});

export default AuthPage;
