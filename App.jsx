import React, { useState, createContext, useContext, useEffect } from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './navigation/AppNavigator';
import { OrderProvider } from './context/OrderContext';
import { LocationProvider } from './components/tracking/LocationProvider';
import { SocketProvider } from './context/sockets';
import { AppState, PermissionsAndroid, Platform, StatusBar } from 'react-native';
import { colors } from './constants/colors';
import {
  AuthorizationStatus,
  getMessaging,
} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';




const App = () => {
  async function requestUserPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted on Android 13+');
      } else {
        console.log('Notification permission denied');
      }
    }
    try {
      const app = getApp();
      const messagingInstance = getMessaging(app);

      const authStatus = await messagingInstance.requestPermission();
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  }

  // Get device token
  const getToken = async () => {
    try {
      const app = getApp();
      const messagingInstance = getMessaging(app);
      const deviceToken = await messagingInstance.getToken(); // ✅ Correct modular call
      console.log('Device Token:', deviceToken);
      // dispatch(setDeviceToken(deviceToken));
    } catch (error) {
      console.error('Error getting device token:', error);
    }
  };
  // useEffect(() => {
  //   requestUserPermission();
  //   getToken();
  // }, []);
useEffect(() => {
  const sub = AppState .addEventListener('change', async (state) => {
    if (state === 'active') {
       await requestUserPermission()
    
    }
  });
getToken();
  return () => sub.remove();
}, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocationProvider>
         <SocketProvider>
        <OrderProvider> 
          <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        <AppNavigator />
        </OrderProvider>
        </SocketProvider>
        </LocationProvider>
    </PersistGate>
   </Provider>
  );
};


export default App;
