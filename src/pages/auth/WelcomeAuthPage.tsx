import React, {useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {logoImage, welcomeImage} from '../../components/Images/DefinedImages';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';
import {useNavigation} from '@react-navigation/native';

const {height, width} = Dimensions.get('window');

const WelcomeAuthPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Navigate to AuthPage after 2 seconds
    setTimeout(() => {
      navigation.navigate('AuthPage' as never);
    }, 2000);
  }, [navigation]);

  return (
    <ImageBackground source={welcomeImage} style={styles.background}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <BoldText style={styles.header}>Chat WaZoBia AI</BoldText>
      </View>
      <View style={styles.textContainer}>
        <RegularText style={styles.subtitle}>
          Translate. Transcribe. Interpret.
        </RegularText>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height,
    width: width * 1.005,
    padding: 24,
    flexDirection: 'column',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 12,
  },
  textContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WelcomeAuthPage;
