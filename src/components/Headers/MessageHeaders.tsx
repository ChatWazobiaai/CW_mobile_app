import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Pressable,
  View,
  Animated,
  Easing,
  Text,
  Image,
  Linking,
  Alert,
  Platform, // Import Text component
} from 'react-native';
import {Colors} from '../Colors/Colors';
import InfoIcon from '../Icons/Info/InfoIcon';
import ArrowLeftIcon from '../Icons/Arrows/ArrowLeftIcon';
import {BoldText, RegularText} from '../Texts/CustomTexts/BaseTexts';
import {useNavigation} from '@react-navigation/native';
import VerifiedBadge from '../Icons/VerifiedBadge/VerifiedBadge';
import PhoneCallIcon from '../Icons/PhoneCall/PhoneCallIcon';
import FastImage from 'react-native-fast-image';
import MailIcon from '../Icons/MailIcon/MailIcon';

export const formatName = (name: any) => {
  return name
    ?.toLowerCase()
    ?.split(/[- ]/) // Split by hyphen or space
    ?.map((part: any) => part?.charAt(0)?.toUpperCase() + part?.slice(1)) // Capitalize each part
    ?.join(' '); // Rejoin with a space
};

interface MessageHeadersProps {
  navigation?: {goBack: () => void};
  fullName?: string;
  infoText?: string;
  badgeColor?: string;
  onPress?: () => void;
  driver?: boolean;
  callBackgroundIconColor?: string;
  callIconColor?: string;
  imageUrl?: any;
  support?: boolean;
  plateNumber?: string;
  phoneNumber?: any;
}

const MessageHeaders: React.FC<MessageHeadersProps> = ({
  navigation,
  badgeColor,
  support,
  onPress,
  driver,
  callIconColor,
  callBackgroundIconColor,
  imageUrl,
  plateNumber,
  phoneNumber = null,
  fullName = '',
  infoText = 'This is some sample info displayed below the header. Click the icon again to hide.',
}) => {
  const [isInfoVisible, setInfoVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const toggleInfo = () => {
    setInfoVisible(!isInfoVisible);
  };

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: isInfoVisible ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isInfoVisible, scaleAnim]);

  const navigationFunction = useNavigation();
  const handleGoBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else {
      navigationFunction.goBack();
    }
  };

  // Function to render text with bold support
  const renderInfoText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <BoldText key={index} fontSize={16} color={Colors.primaryColor}>
            {part.replace(/\*\*/g, '')}
          </BoldText>
        );
      }
      return (
        <RegularText key={index} fontSize={16} color={Colors.primaryColor}>
          {part}
        </RegularText>
      );
    });
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = async () => {
    const email = 'support@hastepickers.com';
    const subject = 'Support Inquiry';
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    const supported = await Linking.canOpenURL(mailto);
    if (supported) {
      await Linking.openURL(mailto);
    } else {
      Alert.alert(
        'Email Client Not Found',
        'It seems there is no email client installed on your device.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable onPress={handleGoBack} style={{}}>
            <ArrowLeftIcon width={30} height={30} color={Colors.whiteColor} />
          </Pressable>
          {/* 
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.high, // Ensure the image loads quickly
            }}
            style={{
              width: 48,
              height: 48,
              borderRadius: 47,
              marginHorizontal: 6,
            }}
            resizeMode={FastImage.resizeMode.cover} // Options: contain, cover, stretch, etc.
          /> */}

          <Image
            source={require('../../../assets/images/logo.png')}
            style={{
              width: 32,
              height: 32,
              borderRadius: 47,
              marginHorizontal: 6,
            }}
          />

          <Pressable onPress={onPress} style={[styles.infoButton]}>
            <BoldText fontSize={16} color={Colors.whiteColor}>
              {formatName(fullName)}
            </BoldText>
          </Pressable>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Pressable
            onPress={handleEmailPress}
            style={{
              backgroundColor: callBackgroundIconColor,
              borderRadius: 256,
            }}>
            <Image
              source={require('../../../assets/images/cwmain.png')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 47,
                marginHorizontal: 6,
              }}
            />
          </Pressable>
          <Pressable
            onPress={handleEmailPress}
            style={{
              backgroundColor: callBackgroundIconColor,
              borderRadius: 256,
            }}>
            <Image
              source={require('../../../assets/images/cwcam.png')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 47,
                marginHorizontal: 6,
              }}
            />
          </Pressable>
        </View>

        {driver && phoneNumber !== null && (
          <Pressable
            onPress={() => {
              handleCall(phoneNumber);
            }}
            style={{
              backgroundColor: callBackgroundIconColor,
              padding: 10,
              borderRadius: 256,
            }}>
            <PhoneCallIcon width={24} height={24} fill={callIconColor} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MessageHeaders;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blackColor,
  },
  header: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayColorFaded,
    justifyContent: 'space-between',

    paddingBottom: Platform.OS === 'android' ? 16 : 12,

    paddingTop: Platform.OS === 'android' ? 16 : 0,

    // height: 50,
  },
  fullName: {
    flex: 1,
    textAlign: 'center',
  },
  infoButton: {
    alignItems: 'flex-start',
    borderRadius: 12,
  },
  infoButtonActive: {
    borderRadius: 14,
    backgroundColor: Colors.primaryColor,
  },
  infoContainer: {
    backgroundColor: Colors.fadedPrimaryColor,
    overflow: 'hidden',
    padding: 16,
  },
});
