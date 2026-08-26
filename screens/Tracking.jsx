import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapComponent from '../components/map/MapComponent'
import { useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'
import ConfirmPickupModal from '../components/map/ConfirmPickupModal'
import { useSelector, useDispatch } from 'react-redux'
import apiService from '../services/ApiService'
import SubmitOrderModal from '../components/order/SubmitOrder'
import { clearOrder, setSubmitOrder } from '../redux/authSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { setSubmitOrder, clearOrder } from '../store/authSlice'

const theme = {
    green: '#5B8C6E',
}

const Tracking = () => {
  const { order, token, submitOrder,delivery } = useSelector((state) => state.auth);
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [hasArrived, setHasArrived] = useState(false)

  // socket sets submitOrder -> true when delivery boy reaches the customer.
  // this opens the modal the FIRST time, starting on "Arrived".
  useEffect(() => {
    if (submitOrder) {
      setHasArrived(false)
      setShowSubmitModal(true)
    }
  }, [submitOrder])


useEffect(() => {
  const clearPendingOrder = async () => {
    try {
      await AsyncStorage.removeItem('pendingOrderRequest');
      console.log('🗑️ Cleared pending order request from storage');
    } catch (e) {
      console.log('⚠️ Failed to clear pending order:', e);
    }
  };
  clearPendingOrder();
}, []); 

  const handleArrived = async () => {
    try {
      const res = await apiService(
        `/api/deliveryBoy/arrivedOrder?order_id=${order?.order_id}`,
        'PATCH',
        null,
        { Authorization: `Bearer ${token}` },
      );
      console.log(res)
      setHasArrived(true) // button + modal now switch to "Deliver"
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Could not confirm arrival. Please try again.')
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await apiService(
        `/api/deliveryBoy/deliverOrder?order_id=${order?.order_id}`,
        'PATCH',
        null,
        { Authorization: `Bearer ${token}` },
      );
      console.log(res)
      dispatch(setSubmitOrder(false));
      dispatch(clearOrder());
      navigation.navigate('dashboard', { screen: 'Home' });
    } catch (err) {
      console.error('Failed to complete order:', err);
      Alert.alert('Error', 'Failed to submit the order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Entypo name="chevron-left" size={20} color="black" />
        </TouchableOpacity>

        {/* Before submitOrder: pickup confirmation button */}
        {order && !submitOrder && delivery !== 'delivering' && (
          <TouchableOpacity
            onPress={() => setShowConfirmModal(true)}
            style={styles.arrivedBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.arrivedText}>Confirm Pickup</Text>
          </TouchableOpacity>
        )}

        {/* Once submitOrder is true: persistent button that can reopen the modal,
            labeled based on hasArrived — survives the modal being dismissed */}
        {order && submitOrder && (
          <TouchableOpacity
            onPress={() => setShowSubmitModal(true)}
            style={styles.arrivedBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.arrivedText}>{hasArrived ? 'Deliver' : 'Arrived'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <MapComponent />

      <ConfirmPickupModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false)
        }}
      />

      <SubmitOrderModal
        visible={showSubmitModal}
        hasArrived={hasArrived}
        onArrive={handleArrived}
        onSubmit={handleSubmit}
        onClose={() => setShowSubmitModal(false)}
      />
    </View>
  )
}

export default Tracking

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topRow: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
    },
    arrivedBtn: {
        height: 40,
        paddingHorizontal: 18,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.green,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
    },
    arrivedText: {
        color: '#fff',
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 14,
    },
})