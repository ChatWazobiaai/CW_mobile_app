// App.tsx
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import PagesNavigator from './src/navigation/PagesNavigator';
import {ContactsProvider} from './src/contexts/ContactsContext';
import store from './src/redux/Store';
import {AuthProvider} from './src/contexts/useAuth';
import {SocketProvider} from './src/contexts/SocketProvider';
import useNetworkStatus from './src/contexts/useNetworkStatus';

export default function App() {
  const isConnected = useNetworkStatus();

  console.log('Internet Status in Component:', isConnected); 

  return (
    <Provider store={store}>
      <ContactsProvider>
        <AuthProvider>
          <SocketProvider>
            <PagesNavigator />
          </SocketProvider>
        </AuthProvider>
      </ContactsProvider>
    </Provider>
  );
}
