import React, { useState, createContext, useContext, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './navigation/AppNavigator';
import { OrderProvider } from './context/OrderContext';
import { LocationProvider } from './components/tracking/LocationProvider';
import { SocketProvider } from './context/sockets';
import { AppState, PermissionsAndroid, Platform, StatusBar } from 'react-native';
import { colors } from './constants/colors';
import notifee from '@notifee/react-native';




const App = () => {
// useEffect(() => {
//   (async () => {
//     const initialNotification = await notifee.getInitialNotification();
//     if (initialNotification) {
//       const raw = initialNotification.notification?.data?.orderDetails 
//                 ?? initialNotification.notification?.data?.order;
//       let orderDetails = null;
//       try {
//         orderDetails = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null;
//       } catch (e) {
//         console.log('⚠️ Failed to parse cold-start order payload:', e);
//       }
//       navigate('order-request', { data: orderDetails });
//     }
//   })();
// }, []);

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
