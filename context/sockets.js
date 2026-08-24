// context/SocketContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import { BASE_URI } from '../config/url';
import { useLocation } from '../components/tracking/LocationProvider';
import { setOrder, setSubmitOrder } from '../redux/authSlice';

// Create a context to store the socket instance
const SocketContext = createContext();

export const SocketProvider = ({children}) => {
  const dispatch = useDispatch();
  const [isNewOrder, setIsNewOrder] = useState(false);
  const [newOrder, setNewOrder] = useState(false);
  const [dispatchOrder, setDispatchOrder] = useState(false);
  const [connected, setConnected] = useState(false); // ✅ was missing
  const [socket, setSocket] = useState(null);

  const { location } = useLocation();
  const { token,isOnline } = useSelector(state => state.auth);

  const placeOrder = (order) => setNewOrder(order);

  // 1. Establish socket connection — only depends on token
  useEffect(() => {
    if (!token) return;

    const socketInstance = io(`${BASE_URI}/?token=${token}`);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('disconnect', () => setConnected(false));
    socketInstance.on('reconnect', () => console.log('Socket reconnected'));

    socketInstance.on('newOrderNotification', (order) => {
      console.log('New order notification:', order);
      setNewOrder(true);
      setIsNewOrder(true);
      dispatch(setOrder(order?.orderDetails));
    });

    socketInstance.on('OrderDispatch', (order) => {
      setNewOrder(false);
      // setDispatchOrder(true);
    });

    socketInstance.on('OrderArrived', (order) => {
      console.log('Order arrived:', order);
      dispatch(setSubmitOrder(true));
    });

    return () => {
      socketInstance.disconnect();
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('reconnect');
      socketInstance.off('newOrderNotification');
      socketInstance.off('OrderDispatch');
      socketInstance.off('OrderArrived');
    };
  }, [token]);

  // 2. Send/update location — depends on socket readiness AND location readiness
  useEffect(() => {
    if (!socket || !connected) return;
    if (!location?.latitude || !location?.longitude) return; // ✅ guard against undefined GPS

    const payload = {
      location: { lat: location.latitude, lng: location.longitude },
      status: isOnline ? 'online' : 'offline',
    };

    socket.emit('deliveryBoyConnect', payload, () => {
      console.log('Location update sent successfully');
    });
  }, [socket, connected, location?.latitude, location?.longitude]); // ✅ re-fires on every location change

  return (
    <SocketContext.Provider
      value={{
        socket, connected,
        newOrder, placeOrder, setIsNewOrder, isNewOrder, setNewOrder,
        dispatchOrder, setDispatchOrder,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context; // Return socket instance
};
