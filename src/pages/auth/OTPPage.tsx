import React, {useState, useEffect} from 'react';
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
  TouchableOpacity,
} from 'react-native';
import {Colors} from '../../components/Colors/Colors'; // Update path as necessary
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts'; // Update path as necessary
import CustomButton from '../../components/Buttons/CustomButton'; // Import the custom button
import CustomTextInput from '../../components/TextInputs/CustomTextInputs';
import {authImage} from '../../components/Images/DefinedImages'; // Update path as necessary
import ArrowLeftIcon from '../../components/Icons/Arrows/ArrowLeftIcon';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {sendOTP, resendOTP, verifyOTP} from '../../redux/Otp/OtpSlice'; // Import actions
import {AppDispatch} from '../../redux/Store';
import {handleApiResponse} from '../../utils/apiRes';
import {useAuth} from '../../contexts/useAuth';

const OTPPage: React.FC = () => {
  const route = useRoute();
  const {phoneNumber}: any = route.params;
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30); // Countdown timer for OTP validity
  const [isResendEnabled, setIsResendEnabled] = useState<boolean>(false);
  //const [phoneNumber, setPhoneNumber] = useState<string>(''); // Assuming phone number passed via navigation

  const {setAuthData} = useAuth();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const otpState = useSelector((state: any) => state.otp); // Assuming OTP state is available in Redux

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval); // Clear the interval when the component unmounts
    } else {
      setIsResendEnabled(true); // Enable resend OTP button after 30 seconds
    }
  }, [timer]);

  const handleOtpChange = (text: string) => {
    setOtp(text);
    if (text.length < 6) {
      setError('OTP must be 6 digits');
    } else {
      setError(null);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(
        verifyOTP({otp: otp, phoneNumber: phoneNumber}),
      ).unwrap();

      setLoading(false);

      const {success, message, data} = handleApiResponse(response);
      const {accessToken, refreshToken, user} = data;

      if (success) {
        if (accessToken && refreshToken && user) {
          setAuthData(accessToken, refreshToken, user);
        } else {
          Alert.alert(
            'Invalid OTP',
            'The OTP you entered is incorrect. Please try again.',
          );
        }
      } else {
        Alert.alert('Error', message || 'An error occurred. Please try again.');
      }
    } catch (error: any) {
      setLoading(false);
      const {success, message, statusCode} = handleApiResponse(error);
      console.log('Error:', success, message, statusCode);
      Alert.alert('Error', message || 'An error occurred. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setTimer(30); // Reset timer
    setIsResendEnabled(false); // Disable resend until the timer ends
    try {
      const response = await dispatch(resendOTP(phoneNumber)).unwrap(); // Dispatch resendOTP
      const {success, message} = handleApiResponse(response);

      if (success) {
        // Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number.');
      } else {
        // Alert.alert('Error', message || 'Failed to resend OTP.');
      }
    } catch (error: any) {
      const {success, message, statusCode} = handleApiResponse(error);
      console.log('Error:', success, message, statusCode);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={authImage} style={styles.backgroundImage}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{padding: 12}}>
            <ArrowLeftIcon color={Colors.whiteColor} width={32} />
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.contentContainer}>
              <BoldText
                fontSize={20}
                color={Colors.whiteColor}
                style={styles.header}>
                Enter OTP
              </BoldText>
              <RegularText
                fontSize={16}
                color={Colors.whiteColor}
                style={styles.subHeader}>
                Please enter the OTP sent to your phone number.
              </RegularText>

              <View style={styles.inputContainer}>
                <CustomTextInput
                  value={otp}
                  onChangeText={handleOtpChange}
                  placeholder="Enter OTP"
                  numeric
                  label="OTP"
                  error={error}
                />
              </View>

              <CustomButton
                title={loading ? 'Verifying OTP...' : 'Verify OTP'}
                onPress={handleVerifyOtp}
                loading={loading}
                disabled={loading}
              />

              {isResendEnabled ? (
                <TouchableOpacity onPress={handleResendOtp}>
                  <BoldText
                    fontSize={16}
                    color={Colors.whiteColor}
                    style={styles.timerText}>
                    Resend OTP
                  </BoldText>
                </TouchableOpacity>
              ) : (
                <RegularText
                  fontSize={14}
                  color={Colors.whiteColor}
                  style={styles.timerText}>
                  Resend OTP in {timer}s
                </RegularText>
              )}
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
    backgroundColor: Colors.blackColor, // Fallback background color if the image doesn't load
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire screen
    justifyContent: 'center', // Centers content within the background
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Ensures content is pushed down on iOS when keyboard is shown
  },
  contentContainer: {
    padding: 16,
    flex: 1,
    justifyContent: 'center', // Centers content vertically
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
  timerText: {
    marginTop: 24,
    textAlign: 'center',
  },
});

export default OTPPage;
