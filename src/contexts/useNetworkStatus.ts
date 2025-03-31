import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean>(true); // Default to true

    useEffect(() => {
        // Get the initial network status
        NetInfo.fetch().then((state) => {
            console.log('Initial Network Status:', state.isConnected);
            setIsConnected(state.isConnected ?? false); // Ensure it's always boolean
        });

        // Listen for network changes
        const unsubscribe = NetInfo.addEventListener((state) => {
            console.log('Network Status Updated:', state.isConnected);
            setIsConnected(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);

    return isConnected;
};

export default useNetworkStatus;