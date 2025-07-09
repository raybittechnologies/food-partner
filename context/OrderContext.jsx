import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './sockets';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const {socket}=useSocket();
    // const [delivery, setDelivery] = useState('');
    const [isNewOrder, setIsNewOrder] = useState(false)
    const [newOrder, setNewOrder] = useState(false);

    const placeOrder = (order) => {
        setNewOrder(order); // Set new order details
    };

    const clearOrder = () => {
        setNewOrder(null); // Clear the order once accepted or expired
    };
  
useEffect(()=>{
  
socket?.on('newOrderNotification', (order) => {
    console.log("New order received:", order);
    setNewOrder(true); // Set the new order details
    setIsNewOrder(true); // Indicate that there is a new order
  })
},[])



    return (
        <OrderContext.Provider value={{ newOrder, placeOrder, clearOrder, setIsNewOrder, isNewOrder}}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
