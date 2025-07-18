// context/SocketContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import { BASE_URI } from '../config/url';
import { useLocation } from '../components/tracking/LocationProvider';
import { setOrder, setSubmitOrder } from '../redux/authSlice';

// Create a context to store the socket instance
const SocketContext = createContext();

// SocketProvider component will manage the socket connection
export const SocketProvider = ({children}) => {
  const dispatch =useDispatch()
    const [isNewOrder, setIsNewOrder] = useState(false)
    const [newOrder, setNewOrder] = useState(false);
    const [dispatchOrder, setDispatchOrder] = useState(false);
  

    const placeOrder = (order) => {
        setNewOrder(order); // Set new order details
    };

   
  const {location}=useLocation();
  const data ={
    location:{
      lat: 34.0716 ,
      lng: 74.8046 
    },
    status:"online"
  }
  console.log("Socket data:", data);
  const {token} = useSelector(state => state.auth); // Fetch token from redux store
  // console.log(token);
  const [socket, setSocket] = useState(null);
 
  useEffect(() => {
    if (token) {
      // Only establish a connection if token is available
      const socketInstance = io(
        `${BASE_URI}/?token=${token}`,
      ); // Use token in URL for socket connection
      setSocket(socketInstance);

      // Listen for the 'connect' event
      socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);

        setConnected(true);
      });

      socketInstance.on('reconnect', () => {
        console.log('Socket successfully reconnected');
      });
  
  socketInstance.emit('deliveryBoyConnect',data,()=>{
console.log("Location update sent successfully");
  })
socketInstance?.on('newOrderNotification', (order) => {
    console.log("New order received:", order);
    setNewOrder(true); // Set the new order details
    setIsNewOrder(true); // Indicate that there is a new order
    dispatch(setOrder(order?.orderDetails)); // Dispatch the order to redux store

  })
  socketInstance.on('OrderDispatch', (order) => {
    setNewOrder(false); 
    console.log("Order dispatched:", order);
    setDispatchOrder(true)
  
  })
  socketInstance.on('OrderArrived', (order) => {
   dispatch(setSubmitOrder(true))
    console.log("Order delivered:", order);

  })
      return () => {
        socketInstance.disconnect();
        console.log('Socket disconnected');
        socketInstance.off('connect');
        socketInstance.off('reconnect');
    
      };
    }
  }, [token]); // Re-run the effect when token changes

  // Provide the socket instance to children components
  return (
    <SocketContext.Provider
      value={{
        socket,
        newOrder, placeOrder,  setIsNewOrder, isNewOrder ,setNewOrder,dispatchOrder,setDispatchOrder
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
