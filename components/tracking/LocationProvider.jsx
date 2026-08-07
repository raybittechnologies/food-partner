import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Platform, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const LocationContext = createContext();
export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const watchId = useRef(null);

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

  const startWatchingLocation = () => {
    if (watchId.current != null) return; // already watching

    watchId.current = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      error => {
        console.error('❌ watchPosition error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000,
      }
    );
  };

  const stopWatchingLocation = () => {
    if (watchId.current != null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
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
        startWatchingLocation();
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

    // This provider should sit above the tab navigator, so this only
    // tears down on full app unmount, not on tab switches.
    return () => stopWatchingLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{ location, loading, error, fetchCurrentLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};