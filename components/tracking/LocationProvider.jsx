import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';

const LocationContext = createContext();
export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrentLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        console.log('📍 Location:', { latitude, longitude });
        setLoading(false);
      },
      error => {
        console.error('❌ Location error:', error);
        setError(error.message);
        setLoading(false);
        Alert.alert('Location Error', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        fetchCurrentLocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature.'
        );
      }
    } catch (err) {
      console.error('Permission error:', err);
      Alert.alert('Error', 'Failed to request location permission.');
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error, fetchCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
