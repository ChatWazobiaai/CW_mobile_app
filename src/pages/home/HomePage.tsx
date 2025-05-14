import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../components/Colors/Colors';
import ArrowLeftIcon from '../../components/Icons/Arrows/ArrowLeftIcon';
import ArrowRightIcon from '../../components/Icons/Arrows/ArrowRightIcon';
import {BoldText} from '../../components/Texts/CustomTexts/BaseTexts';
import {
  homeCalls,
  homeChat,
  homeExciting,
  homeGames,
  homeStudio,
  logoImage,
} from '../../components/Images/DefinedImages';
import ArrowCircleLeftIcon from '../../components/Icons/Arrows/ArrowCircleLeftIcon';
import ArrowCircleRightIcon from '../../components/Icons/Arrows/ArrowCircleRightIcon';
import getContacts from '../../utils/getContacts';
import {useAuth} from '../../contexts/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ContactsContext} from '../../contexts/ContactsContext';

const imageData = [
  {source: homeChat, name: 'Chat', route: 'ChatsPage'},
  {source: homeCalls, name: 'Calls', route: 'CallScreen'},
  {source: homeGames, name: 'Games', route: 'GamesPage'},
  {source: homeStudio, name: 'Studio', route: 'StudioPage'},
];

const HomePage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const navigation = useNavigation();
  const {accessToken, clearAuthData, user} = useAuth();
  const username = user?.name || '';
  const {width} = useWindowDimensions();
  const handleNext = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageData.length);
  };

  const handleLogout = async () => {
    await clearAuthData();
  };
  const handlePrevious = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? imageData.length - 1 : prevIndex - 1,
    );
  };

  const handleNavigate = () => {
    navigation.navigate(imageData[currentImageIndex].route as never);
  };

  return (
    <SafeAreaView style={{backgroundColor: '#161616', flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          {/* <Button title="Logout" onPress={handleLogout} /> */}
          <Image source={logoImage} style={styles.profileImage} />
          <BoldText fontSize={18} color={Colors.whiteColor}>
            Welcome {username}
          </BoldText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width * 0.9,
            position: 'absolute',
            top: 220,
            zIndex: 2,
          }}>
          <TouchableOpacity onPress={handlePrevious} style={styles.arrowButton}>
            <ArrowCircleLeftIcon
              color={Colors.grayColor}
              width={36}
              height={36}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
            <ArrowCircleRightIcon
              color={Colors.grayColor}
              width={36}
              height={36}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <BoldText
            fontSize={20}
            color={Colors.whiteColor}
            style={styles.imageText}>
            {imageData[currentImageIndex].name}
          </BoldText>

          <TouchableOpacity onPress={handleNavigate} activeOpacity={0.8}>
            <Image
              source={imageData[currentImageIndex].source}
              style={[styles.mainImage, {width: width * 0.9}]}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={homeExciting}
          style={[{width: width * 0.9, height: 150, marginBottom: 120}]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161616',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#ffffff12',
    padding: 12,
    borderRadius: 16,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 40,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  mainImage: {
    height: 500,
    borderRadius: 10,
  },
  imageText: {
    textAlign: 'center',
    marginTop: 10,
  },
  arrowButton: {
    padding: 10,
  },
});

export default HomePage;
