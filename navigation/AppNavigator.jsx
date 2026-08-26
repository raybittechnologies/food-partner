import { Alert, AppState, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DeliveryLanding from '../screens/Landing';
import Login from '../screens/Login';
import Otp from '../screens/Otp';
import PartnerOnboarding from '../screens/PartnerOnboarding';
import PersonalInfo from '../screens/PersonalInfo';
import PersonalDocs from '../screens/PersonalDocs';
import VehicleDetails from '../screens/VehicleDetails';
import BankAccountDetails from '../screens/BankAccountDetails';
import WorkDetails from '../screens/WorkDetails';
import UploadAdhar from '../screens/UploadAdhar';
import UploadPAN from '../screens/UploadPAN';
import UploadDrivingLicense from '../screens/UploadDrivingLicense';
import RegistrationComplete from '../screens/RegistrationComplete';
import Dashboard from '../screens/Dashboard';
import OrderRequest from '../screens/OrderRequest';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { useOrder } from '../context/OrderContext';
import BankDetails from '../screens/profile/BankDetails';
import FoodCard from '../screens/profile/FoodCard';
import { useSocket } from '../context/sockets';
import Emergency from '../screens/profile/Emergency';
import Notifications from '../screens/profile/Notifications';
import Tracking from '../screens/Tracking';
import WalletScreen from '../screens/profile/WalletScreen';
import Transactions from '../screens/profile/Transactions';
import {
  AuthorizationStatus,
  getMessaging,
} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';
import { setDeviceToken } from '../redux/authSlice';
import { flushPendingNavigation, navigationRef } from './RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const SPLASH_DURATION = 2000;


// Auth stack screens
const AuthStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* <Stack.Screen name="landing" component={DeliveryLanding} /> */}
    <Stack.Screen name="login" component={Login} />
    <Stack.Screen name="otp" component={Otp} />
    <Stack.Screen name="onboarding" component={PartnerOnboarding} />
    <Stack.Screen name="personal-information" component={PersonalInfo} />
    <Stack.Screen name="delivery-documents" component={PersonalDocs} />
    <Stack.Screen name="vehicle-details" component={VehicleDetails} />
    <Stack.Screen name="bank-details" component={BankAccountDetails} />
    <Stack.Screen name="work-type" component={WorkDetails} />
    <Stack.Screen name="aadhar-card" component={UploadAdhar} />
    <Stack.Screen name="pan-card" component={UploadPAN} />
    <Stack.Screen name="driving-license" component={UploadDrivingLicense} />
    <Stack.Screen name="registration-complete" component={RegistrationComplete} />
  </Stack.Navigator>
);

// App stack screens for authenticated usersx
const AppStackScreen = () => {
  const navigation = useNavigation();
  const dispatch=useDispatch();
  const { newOrder,dispatchOrder } = useSocket();
  const { submitOrder, order, token } = useSelector((state) => state.auth);
  console.log("Dispatch Order in AppStackScreen:", dispatchOrder);
  console.log("New Order in AppStackScreen:",  submitOrder);
useEffect(() => {
  if (newOrder) {
    navigation.navigate('order-request');
  } 
}, [newOrder]);






  return (
    <>
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      
      <Stack.Screen name="dashboard" component={Dashboard} />
      <Stack.Screen name="bank-details" component={BankDetails} />
      <Stack.Screen name="food-id" component={FoodCard} />
<Stack.Screen name="order-request" component={OrderRequest} />
<Stack.Screen name="emergency-details" component={Emergency} />
<Stack.Screen name="wallet" component={WalletScreen} />
<Stack.Screen name="transactions" component={Transactions} />
<Stack.Screen name="notifications" component={Notifications} />
<Stack.Screen name="Tracking" component={Tracking} />

    </Stack.Navigator>
     {/* <SubmitOrderModal
        visible={!!submitOrder}
        onArrive={handleArrived}
        onSubmit={handleSubmit}
        // onClose={() => dispatch(setSubmitOrder(false))}
      /> */}
    </>
  );
};


const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

   const checkPendingOrder = async () => {
    try {
      const raw = await AsyncStorage.getItem('pendingOrderRequest');
      if (raw) {
        const data = JSON.parse(raw);
        await AsyncStorage.removeItem('pendingOrderRequest');
        console.log('📨 Found pending order on cold start:', data);
        navigationRef.navigate('order-request', { data });
      }
    } catch (e) {
      console.log('⚠️ Failed to read pending order:', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !showSplash) {
      checkPendingOrder();
      flushPendingNavigation(); // keep this too, harmless belt-and-suspenders
    }
  }, [isAuthenticated, showSplash]);


  const dispatch = useDispatch();
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
      dispatch(setDeviceToken(deviceToken));
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
    <NavigationContainer
     ref={navigationRef}
  onReady={() => flushPendingNavigation()}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showSplash ? (
          <Stack.Screen name="splash" component={DeliveryLanding} />
        ) : isAuthenticated ? (
          <Stack.Screen name="app" component={AppStackScreen} />
        ) : (
          <Stack.Screen name="auth" component={AuthStackScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

const styles = StyleSheet.create({})