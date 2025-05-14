import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';
import {
  callsbg,
  speaker,
  endcallnew,
  padlock,
  filter,
  mute,
  unmute,
  switchvideo,
  connection,
  userImage,
} from '../../components/Images/DefinedImages';
import ArrowLeftIcon from '../../components/Icons/Arrows/ArrowLeftIcon';

const CallSession: React.FC = () => {
  const navigation = useNavigation();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const route = useRoute();
  const {contactName}: any = route.params || {};

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ImageBackground
      source={callsbg}
      style={styles.background}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        {/* Top Header */}
        <View>
          <View style={styles.topText}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeftIcon color="#aaaaaa" />
              </TouchableOpacity>
              <RegularText style={styles.callingText}>
                Ongoing voice call...
              </RegularText>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={endcallnew} style={styles.roundIcon} />
              </TouchableOpacity>

              <Image
                source={padlock}
                style={[
                  styles.roundIcon,
                  {
                    borderRadius: 8,
                    width: 40,
                    height: 40,
                  },
                ]}
              />
            </View>
          </View>

          {/* Encryption Notice */}
          <View style={styles.encryptionBox}>
            <RegularText style={styles.encryptionText}>
              This call is fully protected with end-to-end encryption 🔒
            </RegularText>
          </View>
        </View>

        {/* Call Info & Controls */}
        <View style={styles.bottomSection}>
          {/* Left Controls */}
          <View style={styles.controlsContainer}>
            <View style={styles.controlRow}>
              <TouchableOpacity
                onPress={() => setIsSpeakerOn(prev => !prev)}
                style={styles.controlButton}>
                <Image source={speaker} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsMuted(prev => !prev)}
                style={styles.controlButton}>
                <Image source={isMuted ? unmute : mute} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Image source={switchvideo} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Image source={filter} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Info */}
          <View style={styles.userInfoSection}>
            <View style={styles.userInfoRow}>
              <Image source={userImage} style={styles.avatar} />
              <BoldText style={styles.userName}>{contactName}</BoldText>
              <RegularText style={styles.callTime}>
                {formatDuration(callDuration)}
              </RegularText>
            </View>

            <View style={styles.connection}>
              <Image source={connection} style={styles.connectionIcon} />
              <RegularText style={styles.badConnection}>
                Bad connection
              </RegularText>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default CallSession;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(22,22,22,0.6)',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  topText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00000064',
    padding: 10,
    borderRadius: 24,
    margin: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callingText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roundIcon: {
    width: 48,
    height: 48,
    borderRadius: 64,
  },
  encryptionBox: {
    alignSelf: 'center',
    width: '70%',
    padding: 16,
    backgroundColor: '#12121275',
    borderRadius: 24,
  },
  encryptionText: {
    fontSize: 13,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  controlsContainer: {
    padding: 16,
  },
  controlRow: {
    flexDirection: 'column',
    backgroundColor: '#12121290',
    padding: 16,
    borderRadius: 16,
    gap: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
  },
  icon: {
    width: 54,
    height: 54,
  },
  userInfoSection: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfoRow: {
    flexDirection: 'column',
    backgroundColor: '#12121290',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 170,
    height: 170,
    borderRadius: 12,
  },
  userName: {
    fontSize: 18,
    color: '#FFF',
  },
  callTime: {
    fontSize: 14,
    color: '#DDDDDD',
  },
  connection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'center',
  },
  connectionIcon: {
    width: 8,
    height: 8,
    marginRight: 6,
  },
  badConnection: {
    color: '#aaa',
    fontSize: 14,
  },
});
