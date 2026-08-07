import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, {
  Marker,
  MarkerAnimated, // if this import fails on your RN Maps version, use `Marker.Animated` instead
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_KEY } from '../../config/url';
import { useSocket } from '../../context/sockets';
import { useSelector } from 'react-redux';

// 🔧 TEMP — static destination for testing.
// Swap this back to the real order-based destination once testing is done (see commented block below).
const STATIC_DESTINATION = {
  latitude: 34.2165,
  longitude: 74.7719,
};

const MapComponent = () => {
  const { order, delivery } = useSelector((state) => state.auth);

  const [location, setLocation] = useState(null);
  const fullRouteCoordinates = useRef([]);
  const routeFetchedRef = useRef(false); // gates Directions API — only re-opens on a confirmed reroute (see maybeReroute)
  const { socket } = useSocket();
  const [displayCoordinates, setDisplayCoordinates] = useState([]);
  const mapRef = useRef(null);

  // Animated coordinate that drives smooth marker movement between GPS updates
  const animatedCoordinate = useRef(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;
  const isFirstLocation = useRef(true);

  // ✅ Using static destination for now
  // const destination = STATIC_DESTINATION;


 
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


  const [region, setRegion] = useState(null);

  // Whether the camera should keep following the marker (like Google Maps nav).
  // Turned off as soon as the user manually drags the map; restored by the recenter button.
  const followingRef = useRef(true);
  // Latest interpolated position of the marker (updated on every animation frame),
  // used by the recenter button and by the polyline-trim logic below.
  const currentAnimatedPositionRef = useRef(null);
  // Where the camera is currently centered — used to decide "close nudge" vs "big catch-up jump".
  const lastCameraCenterRef = useRef(null);
  // Throttle for camera/polyline updates during the marker animation — running this
  // on every single animation frame (~60/sec) is wasteful; ~10/sec still looks smooth.
  const lastFollowUpdateRef = useRef(0);
  const FOLLOW_THROTTLE_MS = 100;
  // If the camera is further than this from the marker, snap-follow isn't enough —
  // do a proper animated "catch up" instead so it visibly closes the gap.
  const CAMERA_CATCHUP_DISTANCE_METERS = 100;

  // --- Off-route detection / reroute controls ---
  // How far (in meters) the driver can stray from the cached route before we treat it as "lost".
  const REROUTE_DISTANCE_THRESHOLD_METERS = 70;
  // Require this many consecutive real GPS fixes off-route before rerouting — filters out
  // one-off GPS jitter so a single noisy reading doesn't trigger a reroute.
  const REROUTE_CONFIRM_FIXES = 2;
  // Minimum time between reroutes, no matter how far off-route the driver is — hard cap on API usage.
  const REROUTE_COOLDOWN_MS = 20000;
  const offRouteFixStreakRef = useRef(0);
  const lastRerouteAtRef = useRef(0);

  const toRad = (deg) => (deg * Math.PI) / 180;
  // Real-world distance in meters between two lat/lng points (degrees ≠ meters, especially for longitude).
  const haversineMeters = (a, b) => {
    const R = 6371000;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h =
      Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  // Projects point p onto the segment a-b and returns the closest point on that segment.
  // This is what makes the polyline erase smoothly instead of jumping vertex-to-vertex.
  const projectPointOnSegment = (p, a, b) => {
    const atob = { x: b.latitude - a.latitude, y: b.longitude - a.longitude };
    const atop = { x: p.latitude - a.latitude, y: p.longitude - a.longitude };
    const len = atob.x * atob.x + atob.y * atob.y;
    let t = len === 0 ? 0 : (atop.x * atob.x + atop.y * atob.y) / len;
    t = Math.max(0, Math.min(1, t));
    return {
      latitude: a.latitude + atob.x * t,
      longitude: a.longitude + atob.y * t,
    };
  };

  // Finds the closest point ON THE ROUTE LINE (not just the closest vertex) to `point`,
  // plus how far off the route (in real meters) that point actually is.
  const findClosestPointOnRoute = (point) => {
    const route = fullRouteCoordinates.current;
    if (!route || route.length < 2) return null;

    let closestSegmentIndex = 0;
    let closestPoint = route[0];
    let minDist = Number.MAX_VALUE;

    for (let i = 0; i < route.length - 1; i++) {
      const proj = projectPointOnSegment(point, route[i], route[i + 1]);
      const dist = Math.hypot(proj.latitude - point.latitude, proj.longitude - point.longitude);
      if (dist < minDist) {
        minDist = dist;
        closestSegmentIndex = i;
        closestPoint = proj;
      }
    }

    return {
      closestPoint,
      segmentIndex: closestSegmentIndex,
      distanceMeters: haversineMeters(point, closestPoint),
    };
  };

  // Cheap, frequent — just trims the drawn line back to the driver's live position.
  const trimRouteAhead = (point) => {
    const result = findClosestPointOnRoute(point);
    if (!result) return;
    const route = fullRouteCoordinates.current;
    setDisplayCoordinates([result.closestPoint, ...route.slice(result.segmentIndex + 1)]);
  };

  // Called once per REAL GPS fix (not per animation frame) — decides whether the driver
  // has actually gone off-route and, if so, allows exactly one fresh Directions API call.
  const maybeReroute = (point) => {
    const result = findClosestPointOnRoute(point);
    if (!result) return;

    if (result.distanceMeters > REROUTE_DISTANCE_THRESHOLD_METERS) {
      offRouteFixStreakRef.current += 1;
    } else {
      offRouteFixStreakRef.current = 0;
    }

    const now = Date.now();
    const cooledDown = now - lastRerouteAtRef.current > REROUTE_COOLDOWN_MS;

    if (offRouteFixStreakRef.current >= REROUTE_CONFIRM_FIXES && cooledDown) {
      offRouteFixStreakRef.current = 0;
      lastRerouteAtRef.current = now;
      routeFetchedRef.current = false; // unlocks MapViewDirections for exactly one more fetch
      setDisplayCoordinates([]); // clear the stale line and force the re-render that remounts it
    }
  };

  // Fires on every frame of the marker's timing animation (not just on GPS fixes),
  // so the camera and the polyline trim both update continuously as the marker glides.
  useEffect(() => {
    const listenerId = animatedCoordinate.addListener(({ latitude, longitude }) => {
      currentAnimatedPositionRef.current = { latitude, longitude };

      const now = Date.now();
      if (now - lastFollowUpdateRef.current < FOLLOW_THROTTLE_MS) return;
      lastFollowUpdateRef.current = now;

      if (followingRef.current) {
        const target = { latitude, longitude };
        const gap = lastCameraCenterRef.current
          ? haversineMeters(lastCameraCenterRef.current, target)
          : Infinity;

        if (gap > CAMERA_CATCHUP_DISTANCE_METERS) {
          // Camera fell far behind (follow was just re-enabled, or a big GPS jump) —
          // animate it closing the distance instead of snapping, so it visibly "comes
          // close" to the marker rather than just teleporting or silently lagging.
          mapRef.current?.animateCamera(
            { center: target, zoom: 17, heading: 0, pitch: 0 },
            { duration: 500 }
          );
        } else {
          // Already close — instant setCamera called ~10x/sec reads as smooth continuous
          // following, the same trick Google Maps' nav camera uses.
          mapRef.current?.setCamera({ center: target, zoom: 17, heading: 0, pitch: 0 });
        }

        lastCameraCenterRef.current = target;
      }

      trimRouteAhead({ latitude, longitude });
    });

    return () => animatedCoordinate.removeListener(listenerId);
  }, []);

  useEffect(() => {
    if (!location) return;

    // --- Smoothly animate the delivery-boy marker to the new position ---
    if (isFirstLocation.current) {
      animatedCoordinate.setValue({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
      });
      currentAnimatedPositionRef.current = location;
      isFirstLocation.current = false;

      const newRegion = {
        ...location,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      if (!region) setRegion(newRegion);

      mapRef.current?.animateCamera(
        {
          center: { latitude: location.latitude, longitude: location.longitude },
          zoom: 17,
          heading: 0,
          pitch: 0,
          altitude: 0,
        },
        { duration: 500 }
      );
      lastCameraCenterRef.current = location;
    } else {
      // Camera + polyline are now driven by the animatedCoordinate listener above,
      // so on subsequent GPS fixes we only need to kick off the marker's glide.
      animatedCoordinate
        .timing({
          latitude: location.latitude,
          longitude: location.longitude,
          duration: 1000, // match this to your location update interval for the smoothest feel
          useNativeDriver: false,
        })
        .start();
    }

    // Check against the ORIGINAL raw GPS fix (not the animated/interpolated position) —
    // this only runs once per real location update, so it can't spam the Directions API.
    maybeReroute(location);
  }, [location]);

  const emitLocation = (latitude, longitude) => {
    if (!socket || !order?.order_id) return;

    const payload = {
      location: { lat: latitude, lng: longitude },
      order_id: order.order_id,
    };

    socket.emit('updateDeliveryBoyLocation', payload);
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
        emitLocation(latitude, longitude);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    const watchId = Geolocation.watchPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
        emitLocation(latitude, longitude);
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
        showsMyLocationButton={false}
        initialRegion={region}
        // NOTE: intentionally NOT passing a controlled `region` prop — having both a
        // controlled region AND imperative animateCamera/setCamera calls makes them fight
        // each other (region keeps snapping the camera back), which is why the camera was
        // failing to actually follow the marker. initialRegion + imperative calls only.
        // User took manual control of the map — stop auto-following until they hit recenter
        onPanDrag={() => {
          followingRef.current = false;
        }}
      >
        {location && (
          <>
            {/* Circular delivery-boy marker, moves smoothly via animatedCoordinate */}
            <MarkerAnimated
              coordinate={animatedCoordinate}
              title="Delivery Boy"
              anchor={{ x: 0.5, y: 0.5 }}
              flat
            >
              <View style={styles.circleMarkerOuter}>
                <View style={styles.circleMarkerInner} />
              </View>
            </MarkerAnimated>

            {destination && (
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

                {/* Directions API — fires once for the initial route, and again (rarely) if the
                    driver goes noticeably off-route. Gated by routeFetchedRef + the confirm/cooldown
                    logic in maybeReroute(), so normal GPS noise never triggers a re-fetch. */}
                {!routeFetchedRef.current && (
                  <MapViewDirections
                    origin={location}
                    destination={destination}
                    apikey={API_KEY}
                    strokeWidth={10}
                    optimizeWaypoints
                    onReady={(result) => {
                      fullRouteCoordinates.current = result.coordinates;
                      setDisplayCoordinates(result.coordinates);
                      routeFetchedRef.current = true; // never call the API again
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
            mapRef.current?.getCamera().then((camera) => {
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
            mapRef.current?.getCamera().then((camera) => {
              camera.zoom -= 1;
              mapRef.current?.animateCamera(camera, { duration: 300 });
            });
          }}
          style={styles.zoomButton}
        >
          <Ionicons name="remove" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Recenter control */}
      <View style={styles.recenterControl}>
        <TouchableOpacity
          onPress={() => {
            const pos = currentAnimatedPositionRef.current || location;
            if (pos) {
              followingRef.current = true; // resume auto-follow
              mapRef.current?.animateCamera(
                {
                  center: { latitude: pos.latitude, longitude: pos.longitude },
                  zoom: 17,
                  heading: 0,
                  pitch: 0,
                  altitude: 0,
                },
                { duration: 500 }
              );
              lastCameraCenterRef.current = pos;
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
  recenterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  // Circular delivery-boy marker
  circleMarkerOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2F80ED',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  circleMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2F80ED',
  },
});