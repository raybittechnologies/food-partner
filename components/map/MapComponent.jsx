import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_KEY } from '../../config/url';
import { useSocket } from '../../context/sockets';
import { useSelector } from 'react-redux';
import { useOrder } from '../../context/OrderContext';

const MapComponent = () => {
  
  const { order,delivery } = useSelector((state) => state.auth);
  // console.log("Order in status:", order);
  const [location, setLocation] = useState(null);
  const fullRouteCoordinates = useRef([]);
  const { socket } = useSocket();
  const [displayCoordinates, setDisplayCoordinates] = useState([]);
  const mapRef = useRef(null);


const destination = order && delivery === 'delivering'
  ? {
      latitude: parseFloat(order?.user_latitude),
      longitude: parseFloat(order?.user_longitude),
    }
  : order
  ? {
      latitude: parseFloat(order?.restaurant_latitude),
      longitude: parseFloat(order?.restaurant_longitude),
    }
  : null;
    
  
  // console.log("Destination coordinates:", destination);

  // Initialize region with null - it will be set when we get the first location update
  const [region, setRegion] = useState(null);

useEffect(() => {
  if (location) {
    const newRegion = {
      ...location,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    if (!region) {
      setRegion(newRegion);
    }

    // Recenter map on delivery boy
    mapRef.current?.animateCamera({
      center: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      zoom: 17,
      heading: 0,
      pitch: 0,
      altitude: 0,
    }, { duration: 500 });

    if (fullRouteCoordinates.current.length > 0) {
      let closestIndex = 0;
      let minDistance = Number.MAX_VALUE;

      fullRouteCoordinates.current.forEach((coord, index) => {
        const dist = Math.hypot(
          coord.latitude - location.latitude,
          coord.longitude - location.longitude
        );
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = index;
        }
      });

      setDisplayCoordinates(fullRouteCoordinates.current.slice(closestIndex));
    }
  }
}, [location]);

  const emitLocation = (latitude, longitude) => {
    if (!socket || !order?.order_id) return;

    const payload = {
      location: {
        lat: latitude,
        lng: longitude,
      },
      order_id: order.order_id,
    };

    socket.emit('updateDeliveryBoyLocation', payload);
    console.log('📡 Location emitted:', payload);
  };


 useEffect(() => {
    // Initial location fetch
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        const newLocation = { latitude, longitude };
        setLocation(newLocation);
        emitLocation(latitude, longitude); // emit once
        console.log('📍 Initial location:', newLocation);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  console.log('🛰️ Registering Geolocation watcher');
    // Start tracking
    const watchId = Geolocation.watchPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        const updatedLocation = { latitude, longitude };
        setLocation(updatedLocation);
        emitLocation(latitude, longitude); // emit on change
      },
      (error) => console.error(error),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000,
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);



  return (
    <>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        // followsUserLocation={true}  
        showsMyLocationButton={false} // We'll use our own controls
        initialRegion={region}
        region={region} // Controlled region
      >
{location && (
  <>

    <Marker
      coordinate={location}
      title="Delivery Boy"
      image={require('../../assets/images/scooty.png')}
    />

   
    {order && destination && (
      <>
        <Marker
          coordinate={destination}
          title={delivery === 'delivering' ? 'Delivering' : 'Pickup'}
        />

        {displayCoordinates.length > 0 && (
          <Polyline
            coordinates={displayCoordinates}
            strokeColor="blue"
            strokeWidth={5}
          />
        )}

        {fullRouteCoordinates.current.length === 0 && (
          <MapViewDirections
            origin={location}
            destination={destination}
            apikey={API_KEY}
            strokeWidth={10}
            optimizeWaypoints
            onReady={(result) => {
              fullRouteCoordinates.current = result.coordinates;
              setDisplayCoordinates(result.coordinates);
            }}
          />
        )}
      </>
    )}
  </>
)}


      </MapView>

      {/* Zoom controls */}
      <View style={styles.zoomControl}>
        <TouchableOpacity
          onPress={() => {
            mapRef.current?.getCamera().then(camera => {
              camera.zoom += 1;
              mapRef.current?.animateCamera(camera, { duration: 300 });
            });
          }}
          style={styles.zoomButton}
        >
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            mapRef.current?.getCamera().then(camera => {
              camera.zoom -= 1;
              mapRef.current?.animateCamera(camera, { duration: 300 });
            });
          }}
          style={styles.zoomButton}
        >
          <Ionicons name="remove" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.recenterControl}>
  <TouchableOpacity
    onPress={() => {
      if (location) {
        mapRef.current?.animateCamera({
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          zoom: 17,
          heading: 0,
          pitch: 0,
          altitude: 0,
        }, { duration: 500 });
      }
    }}
    style={styles.recenterButton}
  >
    <Ionicons name="locate" size={24} color="#000" />
  </TouchableOpacity>
</View>
    </>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  zoomControl: {
    position: 'absolute',
    right: 10,
    top: 200,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 5,
    elevation: 5,
    paddingVertical: 5,
  },
  zoomButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  recenterControl: {
  position: 'absolute',
  right: 10,
  top: 320,
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 5,
  elevation: 5,
  padding: 5,

},

// recenterButton: {
//   paddingHorizontal: 12,
//   paddingVertical: 8,
//   alignItems: 'center',
// },
});