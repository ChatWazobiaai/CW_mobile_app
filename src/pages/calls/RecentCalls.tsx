import React from 'react';
import { View, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';
import {
  missedaudio,
  missedvideo,
  userImage,
} from '../../components/Images/DefinedImages';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';

type CallType = 'Missed' | 'Outgoing';

interface CallEntry {
  id: string;
  name: string;
  messageCount: number;
  time: string;
  typing: boolean;
  type: CallType;
  isVideo: boolean;
}

const data: CallEntry[] = [
  {
    id: '1',
    name: 'Ibeneme',
    messageCount: 12,
    time: 'now',
    typing: true,
    type: 'Missed',
    isVideo: true,
  },
  {
    id: '2',
    name: 'Ibeneme',
    messageCount: 2,
    time: '18m',
    typing: true,
    type: 'Missed',
    isVideo: false,
  },
  {
    id: '3',
    name: 'Ibeneme',
    messageCount: 1,
    time: '15h',
    typing: true,
    type: 'Missed',
    isVideo: false,
  },
  {
    id: '4',
    name: 'Ibeneme',
    messageCount: 1,
    time: '5h',
    typing: true,
    type: 'Outgoing',
    isVideo: true,
  },
  {
    id: '5',
    name: 'Ibeneme',
    messageCount: 2,
    time: '18m',
    typing: true,
    type: 'Outgoing',
    isVideo: false,
  },
  {
    id: '6',
    name: 'Ibeneme',
    messageCount: 2,
    time: '18m',
    typing: true,
    type: 'Missed',
    isVideo: true,
  },
  {
    id: '7',
    name: 'Ibeneme',
    messageCount: 1,
    time: '5h',
    typing: true,
    type: 'Missed',
    isVideo: false,
  },
  {
    id: '8',
    name: 'Ibeneme',
    messageCount: 1,
    time: '5h',
    typing: true,
    type: 'Outgoing',
    isVideo: false,
  },
  {
    id: '9',
    name: 'Ibeneme',
    messageCount: 1,
    time: '5h',
    typing: true,
    type: 'Missed',
    isVideo: false,
  },
  {
    id: '10',
    name: 'Ibeneme',
    messageCount: 1,
    time: '5h',
    typing: true,
    type: 'Outgoing',
    isVideo: false,
  },

];

const RecentCalls: React.FC = () => {
  const renderItem = ({ item, index }: { item: CallEntry; index: number }) => {
    const callIcon = item.isVideo ? missedvideo : missedaudio;
    const isMissed = item.type === 'Missed';

    return (
      <View
        style={[
          styles.callItem,
          index !== data.length - 1 && styles.callItemBorder, // Add border to all except the last item
        ]}
      >
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <Image source={userImage} style={styles.avatar} />
            <View>
              <BoldText color="#D8D5D1" style={styles.name}>
                {item.name}
              </BoldText>
              <View style={styles.callTypeRow}>
                <RegularText style={styles.callTypeText} fontSize={12}>
                  {item.type}
                </RegularText>
                <Image
                  source={callIcon}
                  style={item.isVideo ? styles.videoIcon : styles.audioIcon}
                />
              </View>
            </View>
          </View>

          <View style={styles.metaBox}>
            <RegularText
              fontSize={14}
              style={[styles.count, { color: isMissed ? '#FF5959' : '#aaa' }]}
            >
              ({item.messageCount})
            </RegularText>
            <RegularText style={styles.time} fontSize={10}>
              {item.time}
            </RegularText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BoldText style={styles.header}>Recent</BoldText>
      <View style={styles.listContainer}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={true} // Enable scrolling
        />
      </View>
    </SafeAreaView>
  );
};

export default RecentCalls;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#161616',
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
    color: '#fff',
    alignSelf: 'flex-end',
    paddingRight: 16,
  },
  listContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#27272740',
    borderRadius: 12,
  },
  callItem: {
    padding: 12,
    borderRadius: 12,
  },
  callItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaaaaa24', // Apply bottom border with color #aaaaaa24
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
  },
  name: {
    fontSize: 16,
    color: '#f2f2f2',
  },
  callTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  callTypeText: {
    color: '#999',
  },
  videoIcon: {
    width: 14,
    height: 10,
  },
  audioIcon: {
    width: 10,
    height: 10,
  },
  metaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#aaaaaa16',
    padding: 10,
    borderRadius: 10,
  },
  count: {
    fontSize: 14,
  },
  time: {
    color: '#777',
    fontSize: 10,
  },
});