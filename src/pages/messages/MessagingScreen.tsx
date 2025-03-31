import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  Alert,
  ImageBackground,
  Image,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useSockets} from '../../contexts/SocketProvider';
import {
  BoldText,
  RegularText,
} from '../../components/Texts/CustomTexts/BaseTexts';
import PendingIcon from '../../components/Icons/PendingIcon/PendingIcon';
import SendIcon from '../../components/Icons/SendIcon/SendIcon';
import CheckedIcon from '../../components/Icons/CheckedIcon/Checkedcon';
import Clipboard from '@react-native-clipboard/clipboard';
import AuthHeaders from '../../components/Headers/AuthHeaders';
import MessageHeaders from '../../components/Headers/MessageHeaders';
import {chatImage, sendimage} from '../../components/Images/DefinedImages';
import {Colors} from '../../components/Colors/Colors';
import {BlurView} from '@react-native-community/blur';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../redux/Store';

type Message = {
  id?: string;
  senderId: string;
  text: string;
  translation?: string;
  timestamp: number;
  status: 'pending' | 'delivered' | 'read';
  reaction?: string;
  replyTo?: any;
  receiverId?: any;
  messageId?: any;
  reactions?: any;
  editingTrue?: any;
  replyTrue?: any;
  repliedMessage?: any;
};

const MessagingScreen = () => {
  const route = useRoute();
  const {
    contactUserId,
    messagesArrayID,
    contactName,
    messagesApiResponse,
    myUserId,
  }: any = route.params || {};
  const {socket} = useSockets();
  const [isSetting, setSet] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    messagesApiResponse || [],
  );
  const [messageText, setMessageText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  console.log(`messagesApiResponse`, messagesApiResponse);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 300); // Delay to ensure UI is fully rendered before scrolling
    }
  }, [messages]);

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Message copied to clipboard');
    setSelectedMessage(null);
  };

  const handleDelete = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.filter(msg => msg.id !== messageId),
    );
    setSelectedMessage(null);
  };

  const handleForward = (message: Message) => {
    // Implement forward logic (e.g., open a contact list to choose recipient)
    Alert.alert('Forward', 'Message forwarding feature coming soon');
    setSelectedMessage(null);
  };

  //   useEffect(() => {
  //     if (!socket || !contactUserId || !messagesArrayID) return;

  //     socket.emit('joinGroup', {groupId: messagesArrayID, userId: contactUserId});

  //     socket.on('newMessage', (message: Message) => {
  //       console.log(message, 'messageFmessage');
  //       setMessages(prevMessages => [
  //         ...prevMessages.filter(msg => msg.messageId !== message.messageId),
  //         {...message, status: message.status},
  //       ]);
  //     });

  //     return () => {
  //       socket.off('newMessage');
  //     };
  //   }, [socket, contactUserId, messagesArrayID]);

  useEffect(() => {
    if (!socket || !contactUserId || !messagesArrayID) return;

    socket.emit('joinGroup', {groupId: messagesArrayID, userId: contactUserId});

    socket.on('newMessage', (message: Message) => {
      console.log(message, 'Received new message');

      setMessages(prevMessages => {
        const existingMessageIndex = prevMessages.findIndex(
          msg => msg.messageId === message.messageId,
        );

        if (existingMessageIndex !== -1) {
          // If message exists, update it
          const updatedMessages = [...prevMessages];
          updatedMessages[existingMessageIndex] = {
            ...prevMessages[existingMessageIndex],
            ...message,
          };
          return updatedMessages;
        } else {
          // If new, append it
          return [...prevMessages, message];
        }
      });
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, contactUserId, messagesArrayID]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !socket) return;

    const messageId = uuidv4();
    const newMessage: Message = {
      messageId: messageId,
      receiverId: contactUserId,
      senderId: myUserId,
      text: messageText.trim(),

      timestamp: Date.now(),
      status: 'pending',
      translation: 'translation',
      repliedMessage: selectedMessage ? selectedMessage.id : null,
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);

    socket.emit('sendMessage', {
      groupId: messagesArrayID,
      message: messageText.trim(),
      receiverId: contactUserId,
      messageId: messageId,
      senderId: myUserId,
      //   reactions,
      //   repliedMessageId,
      //   translations,
      //   reactionTrue,
      //   editingTrue,
      //   deleteTrue,
      //   replyTrue,
    });

    setMessageText('');
    setSet(false);
    setSelectedMessage(null);
  };

  const handleTranslate = (messageId: string) => {
    if (!socket) {
      console.error('Socket is not connected.');
      return;
    }

    socket.emit('translateMessage', {messageId}, (response: any) => {
      if (response.error) {
        Alert.alert('Error', 'Translation failed.');
      } else {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId ? {...msg, translation: msg.translation} : msg,
          ),
        );
      }
    });
  };

  const handleReaction = (reaction: string) => {
    if (!selectedMessage || !socket) return;

    socket.emit('sendMessage', {
      messageId: selectedMessage.messageId,
      reactionTrue: true,
      reactorId: myUserId,
      reactions: reaction,
      groupId: messagesArrayID,
    });

    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.messageId !== selectedMessage.messageId) return msg;

        const existingReactions = msg.reactions || [];
        const userExistingReaction = existingReactions.find(
          (r: any) => r.reactorId === myUserId,
        );

        let updatedReactions;
        if (userExistingReaction) {
          updatedReactions = existingReactions
            .filter((r: any) => r.reactorId !== myUserId)
            .concat({reactorId: myUserId, reaction});
        } else {
          updatedReactions = [
            ...existingReactions,
            {reactorId: myUserId, reaction},
          ];
        }

        return {
          ...msg,
          reactions: updatedReactions,
        };
      }),
    );

    setSelectedMessage(null);
  };

  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);

  const handleEdit = (message: Message) => {
    setMessageText(message.text);
    setEditingMessage(message);
    setSet(true);
  };
  const handleReply = (message: Message) => {
    setSet(true);
    setMessageText(``);
    setReplyMessage(message);
  };
  const handleSaveReply = () => {
    console.log(replyMessage, 'replyMessagereplyMessage');
    if (!replyMessage || !socket) return;

    const messageId = uuidv4();

    socket.emit('sendMessage', {
      messageId: messageId,
      repliedMessageId: replyMessage.messageId,
      message: messageText?.trim(),
      groupId: messagesArrayID,
      replyTrue: true,
      senderId: myUserId,
      receiverId: contactUserId,
      repliedMessage: replyMessage?.text,
    });

    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.messageId === messageId
          ? {
              ...msg,
              text: messageText?.trim(),
              replyTrue: true,
              repliedMessage: replyMessage?.text,
            }
          : msg,
      ),
    );

    setMessageText('');
    setSet(false);
    setSelectedMessage(null);
    setReplyMessage(null);
  };
  const handleSaveEdit = () => {
    if (!editingMessage || !socket) return;

    socket.emit('sendMessage', {
      messageId: editingMessage.messageId,
      editingTrue: true,
      message: messageText,
      groupId: messagesArrayID,
    });

    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.messageId === editingMessage.messageId
          ? {...msg, text: messageText, editingTrue: true}
          : msg,
      ),
    );

    setMessageText('');
    setSet(false);
    setSelectedMessage(null);
    setEditingMessage(null);
  };

  const flatListRef = useRef<FlatList>(null);

  const scrollToMessage = (messageId: string) => {
    console.log(messageId, 'itemitem');
    const index = messages.findIndex(msg => msg.messageId === messageId);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({index, animated: true});
    }
  };

  const getMessageText = (messageId: string) => {
    const message = messages.find(msg => msg.messageId === messageId);
    return message ? message.text : 'Message not found';
  };

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  }, [messages]);

  return (
    <ImageBackground style={styles.container} source={chatImage}>
      <MessageHeaders fullName={contactName} />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable
            style={[
              {
                padding: 0,
                margin: 0,
                alignSelf:
                  item.senderId === myUserId ? 'flex-end' : 'flex-start',
              },
            ]}>
            <Pressable
              onPress={() => setSelectedMessage(item)}
              style={[
                styles.messageBubble,
                item.senderId == myUserId
                  ? styles.myMessage
                  : styles.otherMessage,

                {
                  flexDirection: 'row',
                  gap: 4,
                  alignItems: 'flex-end',
                },
              ]}>
              <View>
                {item.replyTrue && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#ffffff12',
                      padding: 12,
                      borderRadius: 16,
                    }}
                    onPress={() => scrollToMessage(item?.repliedMessageId)}>
                    <BoldText style={styles.replyText}>
                      Replying to: {getMessageText(item?.repliedMessageId)}
                    </BoldText>
                  </TouchableOpacity>
                )}

                <RegularText style={styles.messageText}>
                  {item.text}
                </RegularText>
              </View>
              <View>
                {item.senderId === myUserId && (
                  <RegularText style={styles.statusText}>
                    {item.status === 'pending' ? (
                      <PendingIcon width={13} height={13} />
                    ) : item.status === 'delivered' ? (
                      <CheckedIcon
                        width={13}
                        height={13}
                        color={Colors.primaryColor}
                      />
                    ) : item.status === 'edited' ? (
                      <RegularText
                        style={{fontSize: 11, color: Colors.primaryColor}}>
                        edited
                      </RegularText>
                    ) : (
                      <CheckedIcon width={13} height={13} />
                    )}
                  </RegularText>
                )}
              </View>
            </Pressable>

            {item.reactions && item.reactions.length > 0 && (
              <Pressable
                onPress={() => setSelectedMessage(item)}
                style={{
                  zIndex: 3,
                  backgroundColor: '#4F4F4F99',
                  alignSelf: 'flex-end',
                  borderRadius: 1222,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                  marginTop: -14,
                  marginRight: 4,
                }}>
                {item.reactions.map((reactionObj: any, index: any) => (
                  <BoldText key={index} style={styles.reactionText}>
                    {reactionObj.reaction}
                  </BoldText>
                ))}
              </Pressable>
            )}
          </Pressable>
        )}
        contentContainerStyle={styles.messagesList}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          multiline={true} // Allows multiple lines
          returnKeyType="default" // Ensures Enter adds a new line
        />

        <Pressable
          onPress={() => {
            if (editingMessage) {
              handleSaveEdit();
            } else if (replyMessage) {
              handleSaveReply();
            } else {
              handleSendMessage();
            }
          }}
          style={({pressed}) => [
            // styles.sendButton,
            {opacity: pressed ? 0.7 : 1},
          ]}>
          <Image source={sendimage} style={{width: 42, height: 42}} />
        </Pressable>
      </View>

      {selectedMessage && (
        <Modal
          transparent
          animationType="fade"
          visible={!!selectedMessage}
          onRequestClose={() => {
            setSelectedMessage(null);
            setSet(false);
          }}>
          <Pressable
            onPress={() => {
              setSelectedMessage(null);
              setSet(false);
            }}
            style={{height: '100%'}}>
            <BlurView
              style={styles.blurBackground}
              blurType="dark"
              blurAmount={15}
            />

            {/* Modal Content */}
            <View
              style={[
                styles.modalContainer,
                {
                  alignSelf:
                    selectedMessage?.senderId === myUserId
                      ? 'flex-end'
                      : 'flex-start',
                },
              ]}>
              <View
                style={{
                  backgroundColor: Colors.blackColor,
                  width: '100%',
                  borderRadius: 24,
                  marginBottom: 6,
                }}>
                <RegularText style={styles.modalMessage}>
                  {selectedMessage.text}
                </RegularText>
              </View>

              {/* Reaction Options */}
              <View style={styles.reactionsContainer}>
                {['❤️', '😂', '😭', '😤', '👍', '🥺', '🎉'].map(emoji => (
                  <Pressable
                    key={emoji}
                    style={styles.reactionButton}
                    onPress={() => handleReaction(emoji)}>
                    <Text style={[styles.reactionText, {fontSize: 16}]}>
                      {emoji}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Message Options */}

              {isSetting === true ? (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={messageText}
                    onChangeText={setMessageText}
                    placeholder="Type a message..."
                    placeholderTextColor="#888"
                    multiline={true} // Allows multiple lines
                    // Prevents keyboard from closing on Enter
                    returnKeyType="default" // Ensures Enter adds a new line
                  />
                  <Pressable
                    onPress={() => {
                      if (editingMessage) {
                        handleSaveEdit();
                      } else if (replyMessage) {
                        handleSaveReply();
                      } else {
                        handleSendMessage();
                      }
                    }}
                    style={({pressed}) => [
                      // styles.sendButton,
                      {opacity: pressed ? 0.7 : 1},
                    ]}>
                    <Image source={sendimage} style={{width: 42, height: 42}} />
                  </Pressable>
                </View>
              ) : (
                <View
                  style={[
                    styles.optionsContainer,
                    {
                      alignSelf:
                        selectedMessage?.senderId === myUserId
                          ? 'flex-end'
                          : 'flex-start',
                    },
                  ]}>
                  <Pressable
                    style={{backgroundColor: '#Ffffff12', borderRadius: 12}}
                    onPress={() => handleEdit(selectedMessage)}>
                    <RegularText
                      style={[
                        styles.optionText,
                        {
                          textAlign:
                            selectedMessage?.senderId === myUserId
                              ? 'left'
                              : 'left',
                        },
                      ]}>
                      Edit
                    </RegularText>
                  </Pressable>
                  <Pressable
                    style={{backgroundColor: '#Ffffff12', borderRadius: 12}}
                    onPress={() => handleReply(selectedMessage)}>
                    <RegularText
                      style={[
                        styles.optionText,
                        {
                          textAlign:
                            selectedMessage?.senderId === myUserId
                              ? 'left'
                              : 'left',
                        },
                      ]}>
                      Reply
                    </RegularText>
                  </Pressable>
                  <Pressable
                    style={{backgroundColor: '#Ffffff12', borderRadius: 12}}
                    onPress={() => handleCopy(selectedMessage.text)}>
                    <RegularText
                      style={[
                        styles.optionText,
                        {
                          textAlign:
                            selectedMessage?.senderId === myUserId
                              ? 'left'
                              : 'left',
                        },
                      ]}>
                      Copy
                    </RegularText>
                  </Pressable>
                  <Pressable
                    style={{backgroundColor: '#Ffffff12', borderRadius: 12}}
                    onPress={() => handleDelete(selectedMessage?.id || '')}>
                    <RegularText
                      style={[
                        styles.optionText,
                        {
                          textAlign:
                            selectedMessage?.senderId === myUserId
                              ? 'left'
                              : 'left',
                        },
                      ]}>
                      Delete
                    </RegularText>
                  </Pressable>
                  <Pressable
                    style={{backgroundColor: '#Ffffff12', borderRadius: 12}}
                    onPress={() => handleForward(selectedMessage)}>
                    <RegularText style={styles.optionText}>Forward</RegularText>
                  </Pressable>
                </View>
              )}

              {/* <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type a message..."
                placeholderTextColor="#888"
              />
              <Pressable
                style={styles.sendButton}
                onPress={editingMessage ? handleSaveEdit : handleSendMessage}>
                <Text style={styles.sendButtonText}>
                  {editingMessage ? 'Save' : 'Send'}
                </Text>
              </Pressable>
            </View> */}
            </View>
          </Pressable>
        </Modal>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#121212'},
  messagesList: {flexGrow: 1, padding: 10},
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
  },
  myMessage: {
    backgroundColor: '#4F4F4F99',
    alignSelf: 'flex-end',
    borderRadius: 24,
  },
  otherMessage: {backgroundColor: '#2A2A2A'},
  messageText: {color: '#FFF', fontSize: 16},
  replyText: {color: '#FFF', fontSize: 16},
  statusText: {
    color: '#CCC',
    fontSize: 8,
    marginTop: -12,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  reactionText: {fontSize: 12, alignSelf: 'flex-end'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    gap: 12,
    paddingBottom: 44,
    backgroundColor: Colors.blackColor,
    fontFamily: Platform.OS === 'android' ? 'LufgaSemiBold' : 'Lufga-SemiBold',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#FFF',
    backgroundColor: '#222',
    borderRadius: 8,
    fontFamily: Platform.OS === 'android' ? 'LufgaSemiBold' : 'Lufga-SemiBold',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sendButtonText: {color: '#FFF', fontSize: 16},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalMessage: {
    fontSize: 16,
    color: '#fff',
    alignSelf: 'flex-end',
    padding: 16,

    overflow: 'hidden',
    // textAlign:'left',
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: Colors.blackColor,
    padding: 12,
    borderRadius: 20,
  },
  reactionButton: {marginHorizontal: 5},
  optionsContainer: {
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    gap: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.whiteColor,
    padding: 16,
  },
  closeButton: {marginTop: 10},
  closeButtonText: {color: 'red'},
  translateButton: {
    marginTop: 5,
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  translateButtonText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'green',
    padding: 12,
  },
  translationText: {
    marginTop: 5,
    color: '#red',
    fontSize: 14,
    fontStyle: 'italic',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    // backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    maxWidth: '80%',
    alignItems: 'flex-end',
    top: '30%',
    marginHorizontal: 16,
  },
  modalText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default MessagingScreen;
