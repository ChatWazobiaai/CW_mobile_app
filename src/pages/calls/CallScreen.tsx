import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';
import ArrowLeftIcon from '../../components/Icons/Arrows/ArrowLeftIcon';
import {
  addCall,
  calllog,
  callsideimages,
  createvc,
  createvoice,
} from '../../components/Images/DefinedImages';
import RecentCalls from './RecentCalls';

const tabs = ['All', 'Missed'];

const CallScreen = () => {
  const [activeTab, setActiveTab] = React.useState('All');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftIcon width={24} height={24} color="#AAAAAA" />
          </TouchableOpacity>
          <Image source={calllog} style={styles.headerImage} />
          <BoldText style={styles.headerText}>Call</BoldText>
        </View>

        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}>
              <RegularText
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </RegularText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'All' && (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Image source={callsideimages} style={styles.callIllustration} />
          <RegularText style={styles.description}>
            Make a call by tapping the button below and click either voice or
            video to select a contact.
          </RegularText>
        </ScrollView>
      )}

      {activeTab === 'Missed' && <RecentCalls />}

      <View style={styles.callButtonsContainer}>
        {activeTab === 'All' && (
          <View>
            <TouchableOpacity style={styles.callButton}>
              <Image source={createvc} style={styles.callIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.callButton}>
              <Image source={createvoice} style={styles.callIcon} />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => navigation.navigate('AddCallScreen' as never)}>
          <Image source={addCall} style={[styles.callIcon, {height: 70}]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#AAAAAA',
    fontSize: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#aaaaaa36',
  },
  tabText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  activeTabText: {
    color: '#AAAAAA',
    fontWeight: '600',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
  },
  callIllustration: {
    width: 120,
    height: 48,
    marginBottom: 16,
  },
  description: {
    color: '#AAAAAA',
    fontSize: 26,
    textAlign: 'left',
    maxWidth: '80%',
    lineHeight: 32,
  },
  callButtonsContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
    marginRight: 16,
    gap: 12,
    position: 'absolute',
    bottom: 36,
    right: 0,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callIcon: {
    width: 48,
    height: 48,
  },
});
