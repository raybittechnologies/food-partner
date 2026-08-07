import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
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
  const { newOrder,dispatchOrder } = useSocket();

  console.log("Dispatch Order in AppStackScreen:", dispatchOrder);
  console.log("New Order in AppStackScreen:",  newOrder);
useEffect(() => {
  if (newOrder) {
    navigation.navigate('order-request');
  } else if (dispatchOrder) {
    navigation.navigate('order-request', { status: 'dispatched' });
  }
}, [newOrder, dispatchOrder]);



  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      
      <Stack.Screen name="dashboard" component={Dashboard} />
      <Stack.Screen name="bank-details" component={BankDetails} />
      <Stack.Screen name="food-id" component={FoodCard} />
<Stack.Screen name="order-request" component={OrderRequest} />
<Stack.Screen name="emergency-details" component={Emergency} />
<Stack.Screen name="notifications" component={Notifications} />
<Stack.Screen name="Tracking" component={Tracking} />

    </Stack.Navigator>
  );
};


const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
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