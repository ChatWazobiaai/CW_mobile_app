import React, {createContext, useContext, useEffect, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseUrl} from '../utils/apiUtils';
import {useAuth} from '../contexts/useAuth';

const SOCKET_URL = BaseUrl;

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const {user} = useAuth(); // Assuming `user` contains `_id`

  console.log(user?._id, 'user');

  useEffect(() => {
    if (!user?._id) return;
  
    const newSocket = io(SOCKET_URL, { transports: ["websocket"] });
  
    newSocket.on("connect", async () => {
      console.log("🔗 Connected to Socket.IO server:", newSocket.id);
  
      // Join the room with userId
      newSocket.emit("joinRoom", user?._id);
      console.log(`🏠 Joined room: ${user?._id}`);
  
      await loadContactsAndEmit(newSocket);
    });
  
    newSocket.on("contactsUpdated", async (updatedContacts) => {
      console.log("📥 Contacts Updated for user:", user?._id, updatedContacts);
  
      try {
        await AsyncStorage.setItem("online_user_contacts", JSON.stringify(updatedContacts));
        console.log("✅ Saved online_user_contacts to AsyncStorage");
      } catch (error) {
        console.error("❌ Error saving online_user_contacts:", error);
      }
    });
  
    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
    });
  
    setSocket(newSocket);
  
    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);
  
  const loadContactsAndEmit = async (socket: Socket) => {
    try {
      const storedContacts = await AsyncStorage.getItem('user_contacts');
      if (storedContacts) {
        const contacts = JSON.parse(storedContacts);
        console.log('📤 Sending contacts to socket:', contacts);
        socket.emit('updateContacts', {userId: user?._id, contacts});
      } else {
        console.log('⚠️ No contacts found in storage.');
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};

export const useSockets = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSockets must be used within a SocketProvider');
  }
  return context;
};
