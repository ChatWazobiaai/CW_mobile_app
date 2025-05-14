import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  Image,
  Platform,
  useWindowDimensions,
  Alert,
  Share,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {BlurView} from '@react-native-community/blur';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';
import {
  aicard,
  art,
  generate,
  inspo,
  photo,
  photoa,
  photob,
  settings,
  studiogreen,
} from '../../components/Images/DefinedImages';
import ArrowLeftIcon from '../../components/Icons/Arrows/ArrowLeftIcon';
import type {Asset} from 'react-native-image-picker';

const tabs = [
  'All',
  'Cultural images',
  'Igbo attires',
  'Yoruba fashion clothing',
];

const AIImageGenerator = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [prompt, setPrompt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([
    photob,
    photob,
    photob,
    photob,
    photob,
  ]);
  const {fontScale} = useWindowDimensions();
  const {width: screenWidth} = useWindowDimensions();
  const [activeSection, setActiveSection] = useState('Inspiration');
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{ uri: string } | null>(null);
  const [generatedModalVisible, setGeneratedModalVisible] = useState(false);

  
  useEffect(() => {
    setModalVisible(true);
  }, []);

  const handleImagePick = (index: any) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          const newImages = [...images];
          newImages[index] = {uri: response.assets[0].uri};
          setImages(newImages);
        }
      },
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          setSelectedImage(response.assets[0]);
          console.log('Selected Image:', response.assets[0]);
        }
      },
    );
  };


  const handleDelete = () => {
    setGeneratedImage(null);
    setGeneratedModalVisible(false);
    setSelectedImage(null); // also clear the selected image if needed
  };

  const handleDownload = () => {
    // For real apps, use react-native-fs or similar to save the image to device.
    Alert.alert('Download', 'Image downloaded successfully (demo)');
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    try {
      await Share.share({
        message: 'Check out this AI generated image!',
        url: generatedImage.uri,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleSetProfilePicture = () => {
    Alert.alert('Profile Picture', 'Set as profile picture (demo)');
  };

  const handleGenerate = () => {
    if (!selectedImage) {
      console.log('Please select an image first.');
      return;
    }
    setIsGenerating(true);

    // Simulate AI image generation delay (e.g. 3 seconds)
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedModalVisible(true);
      console.log('Image generation complete');
      // Here you can update your images or handle results
    }, 3000);

    console.log('Prompt:', prompt);
    console.log('Selected Image:', selectedImage);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <Modal
        visible={generatedModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGeneratedModalVisible(false)}>
        <View style={styles.generatedModalOverlay}>
          <View style={styles.generatedModalContainer}>
            {generatedImage && (
              <Image
                source={{uri: generatedImage.uri}}
                style={styles.generatedImage}
              />
            )}
            <Text style={styles.generatedDescription}>
              This image was generated based on your prompt: "{prompt}".
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.actionButton}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDownload}
                style={styles.actionButton}>
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.actionButton}>
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSetProfilePicture}
                style={styles.actionButton}>
                <Text style={styles.actionText}>Set as Profile</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setGeneratedModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={isGenerating}
        onRequestClose={() => setIsGenerating(false)}>
        <View style={styles.modalOverlay}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={5}
            reducedTransparencyFallbackColor="#000000aa"
          />
          <View style={styles.generatingModalContainer}>
            <Image source={art} style={styles.generatingImage} />
            <BoldText style={styles.generatingTitle}>
              AI Image is generating...
            </BoldText>
            <RegularText style={styles.generatingText}>
              Adding a Touch of Magic
            </RegularText>

            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  marginTop: 32,
                },
              ]}
              onPress={() => setModalVisible(false)}>
              <BoldText style={styles.modalButtonText}>Cancel</BoldText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeftIcon color="#D8D5D1" />
        </TouchableOpacity>
        <RegularText>AI Image generation</RegularText>
        <View />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          <Image source={aicard} style={styles.cardImage} />

          <View style={styles.promptRow}>
            <TextInput
              style={[
                styles.input,
                {fontSize: 13 * fontScale, width: '70%', marginBottom: 0},
              ]}
              placeholder="Describe what you want to see..."
              placeholderTextColor="#888"
              value={prompt}
              onChangeText={setPrompt}
            />

            <TouchableOpacity onPress={openGallery}>
              <Image source={photo} style={styles.icon} />
            </TouchableOpacity>

            <Image source={settings} style={styles.icon} />
          </View>

          {selectedImage && (
            <Image
              source={{uri: selectedImage.uri}}
              style={{
                width: '100%',
                height: 200,

                borderRadius: 10,
              }}
            />
          )}

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerate}>
            <Image source={generate} style={styles.generateIcon} />
            <BoldText style={styles.generateText}>Generate</BoldText>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionToggle}>
          {['Inspiration', 'My creation'].map(section => (
            <TouchableOpacity
              key={section}
              onPress={() => setActiveSection(section)}
              style={[
                styles.toggleButton,
                activeSection === section && styles.activeToggleButton,
              ]}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                {section === 'Inspiration' && (
                  <Image source={inspo} style={styles.toggleImage} />
                )}
                {section === 'My creation' && (
                  <Image source={photoa} style={styles.toggleImage} />
                )}
                <BoldText
                  style={[
                    styles.toggleButtonText,
                    activeSection === section && styles.activeToggleButtonText,
                  ]}>
                  {section}
                </BoldText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {activeSection === 'My Creation' && (
          <Text style={{color: '#888'}}>Creation content goes here...</Text>
        )}

        {activeSection === 'Inspiration' && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabScroll}>
              {tabs.map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}>
                  <BoldText
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                    ]}>
                    {tab}
                  </BoldText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.imageGrid}>
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.imageBox,
                    {
                      width: (screenWidth - 20 * 2 - 12 * 2) / 3,
                    },
                  ]}
                  onPress={() => handleImagePick(index)}>
                  <Image source={img} style={styles.image} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Welcome Modal */}
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={3}
              reducedTransparencyFallbackColor="#000000aa"
            />
            <View style={styles.modalContainer}>
              <Image source={studiogreen} style={styles.modalImage} />
              <BoldText style={styles.modalTitle}>
                Welcome to AI{'\n'}Image Generation
              </BoldText>
              <RegularText style={styles.modalText}>
                Generate Stunning Photos Instantly with Our AI Technology. Your
                data is protected and processed in accordance with our Privacy
                Policy.
              </RegularText>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <BoldText style={styles.modalButtonText}>Got it</BoldText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AIImageGenerator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222222',
    padding: 12,
    paddingVertical: 10,
    borderTopColor: '#D8D5D145',
    borderBottomColor: '#D8D5D145',
    borderTopWidth: 0.4,
    borderBottomWidth: 0.4,
    marginBottom: 24,
    position: 'absolute',
    top: 59,
    zIndex: 999,
    right: 0,
    left: 0,
  },
  mainSection: {
    gap: 20,
    marginTop: 48,
  },
  cardImage: {
    width: '100%',
    height: 155,
    borderRadius: 16,
  },
  promptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontFamily: Platform.OS === 'android' ? 'LufgaSemiBold' : 'Lufga-SemiBold',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  generateButton: {
    backgroundColor: '#D8D5D1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  generateIcon: {
    width: 16,
    height: 16,
    borderRadius: 16,
  },
  generateText: {
    color: '#161616',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 8,
  },
  tabScroll: {
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: '#D8D5D124',
  },
  tabText: {
    color: '#aaaaaa86',
    fontSize: 12,
  },
  activeTabText: {
    color: '#aaa',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  imageBox: {
    backgroundColor: '#D8D5D1',
    padding: 16,
    borderRadius: 12,
    width: 80,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 36,
    height: 36,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  modalImage: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    color: '#D8D5D1',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#D8D5D1',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#D8D5D1',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
  },
  modalButtonText: {
    color: '#161616',
    fontSize: 16,
    textAlign: 'center',
  },

  sectionToggle: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeToggleButton: {
    borderColor: '#D8D5D1',
  },
  toggleButtonText: {
    color: '#888',
    fontSize: 16,
  },
  activeToggleButtonText: {
    color: '#D8D5D1',
    fontWeight: 'bold',
  },

  toggleImage: {
    width: 14, // or whatever size fits nicely
    height: 14,
    resizeMode: 'contain',
  },
  generatingModalContainer: {
    backgroundColor: '#222222cc',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 24,
  },
  generatingImage: {
    width: 160,
    height: 160,
    marginBottom: 48,
    marginTop: 32,
    resizeMode: 'contain',
  },
  generatingTitle: {
    fontSize: 18,
    color: '#D8D5D1',
    marginBottom: 8,
    textAlign: 'center',
  },
  generatingText: {
    fontSize: 14,
    color: '#D8D5D1',
    textAlign: 'center',
  },
  generatedModalOverlay: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  generatedModalContainer: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  generatedImage: {
    width: 280,
    height: 280,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  generatedDescription: {
    color: '#ddd',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#444',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: '#D8D5D1',
  },
  closeButtonText: {
    color: '#161616',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});
