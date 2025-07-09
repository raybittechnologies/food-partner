import React, { useState, createContext, useContext } from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './navigation/AppNavigator';
import { OrderProvider } from './context/OrderContext';
import { LocationProvider } from './components/tracking/LocationProvider';
import { SocketProvider } from './context/sockets';








const App = () => {


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocationProvider>
         <SocketProvider>
        <OrderProvider> 
        <AppNavigator />
        </OrderProvider>
        </SocketProvider>
        </LocationProvider>
    </PersistGate>
   </Provider>
  );
};


export default App;
