import { Dimensions, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

const { height } = Dimensions.get("window")
import IonIcons from 'react-native-vector-icons/Ionicons'
import { useOrder } from '../context/OrderContext'
import { useDispatch, useSelector } from 'react-redux'
import { clearOrder, setisAuthenticated, setSubmitOrder } from '../redux/authSlice'
import { useNavigation } from '@react-navigation/native'

import MapComponent from '../components/map/MapComponent'
import { useSocket } from '../context/sockets'
import SubmitOrderModal from '../components/order/SubmitOrder'
import apiService from '../services/ApiService'
import SuccessModal from '../components/common/DynamicModal'

const Home = () => {

const {submitOrder,order,token}=useSelector((state)=>state.auth)
console.log(submitOrder)
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
 const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
    const { isNewOrder } = useOrder()

    const navigation = useNavigation()


const dispatch = useDispatch()
const handlelogout = () => {
        // Handle logout logic here
        console.log("Logout pressed");
        dispatch(setisAuthenticated(false)); // Update the authentication state
        
    };






  const handleSubmitOrder = async(type) => {
    console.log('order')
  try {
    const url =
      type === 'arrived'
        ? `/api/deliveryBoy/arrivedOrder?order_id=${order?.order_id}`
        : `/api/deliveryBoy/deliverOrder?order_id=${order?.order_id}`;

    const res = await apiService(url, 'PATCH', null, {
      Authorization: `Bearer ${token}`,
    });

    console.log(`${type} response:`, res);
    if(res?.data?.status==='arrived'){
        setIsSuccessModalVisible(true);
    }else if(res?.data?.status==='delivered'){
        setIsOrderSubmitted(true);
        setIsSuccessModalVisible(true);
        dispatch(clearOrder())
         dispatch(setSubmitOrder(false))
        
    }

    setIsModalVisible(false);
  } catch (error) {
    console.error(`${type} error:`, error);
  }
};
  




  return (
    <View style={styles.container}>
        <Header handlelogout={handlelogout} submitOrder={submitOrder}  setIsModalVisible={ setIsModalVisible}/>
        {/* {isNewOrder && <BottomPopup />} */}
        
    <MapComponent />
<SubmitOrderModal
  visible={isModalVisible}
  onArrive={() => handleSubmitOrder('arrived')}
  onSubmit={() => handleSubmitOrder('deliver')}
  onClose={() => setIsModalVisible(false)} 
/>
<SuccessModal visible={isSuccessModalVisible} onClose={() => setIsSuccessModalVisible(false)} message={isOrderSubmitted? 'Order Delivered successfully':'Order arrived successfully wait for customer confirmation'} />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        position: "relative",

    }
})

const Header = ({handlelogout,submitOrder,setIsModalVisible}) => {


   
    const { placeOrder } = useOrder()
    const handleOrder = () => {
        const newOrder = { id: 1, details: "Order details here" }; // Example order
        placeOrder(newOrder); // Place the order
    };
    return (
        <View style={{ position: "absolute", top: 0, width: "100%", backgroundColor: "#202020", borderBottomStartRadius: 20, borderBottomEndRadius: 20, zIndex: 1,  padding: "5%" ,paddingTop: Platform.OS === "ios" ? 50 : 50}}>
            <StatusBar
          hidden={false}
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />

            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ backgroundColor: "#fff", borderRadius: 10, display: "flex", alignItems: "flex-end", width: "20%", paddingVertical: 5, paddingHorizontal: 5 }}>
                    <TouchableOpacity style={{ backgroundColor: "#FA4A0C", height: height * 0.035, paddingHorizontal: 5, borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "#fff", fontFamily: "OpenSans-Regular", fontSize: 12, }}>Online</Text>
                    </TouchableOpacity>
                </View>
               {submitOrder && <TouchableOpacity onPress={()=>setIsModalVisible(true)} style={{ backgroundColor: "green", borderRadius: 10, display: "flex", alignItems: "center", width: "25%", paddingVertical: 10, paddingHorizontal: 5,elevation:5 }}>
                <Text style={{fontSize:10,fontFamily:'Regular',color:'white'}}>Submit Order</Text>
               </TouchableOpacity>}
                <TouchableOpacity onPress={handlelogout}>
                    <IonIcons name="notifications-outline" color="#fff" size={25} />
               </TouchableOpacity>
            </View>
        </View >
    )
}

const BottomPopup = () => {
    return (
        <View style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "#202020", borderTopStartRadius: 20, borderTopEndRadius: 20, zIndex: 1, height: height * 0.25, padding: "5%" }}>
            <View style={{ borderColor: "#6D6D6D", borderRadius: 10, padding: "5%", borderWidth: 1 }}>
                <View>
                    <Text style={{
                        fontFamily: "OpenSans-Regular", color: "#fff", fontSize: 15, textTransform: "uppercase", lineHeight: 22, fontWeight: "300"
                    }}>pickup from</Text>
                </View>
                <View>
                    <Text style={{ fontFamily: "OpenSans-Medium", color: "#fff", fontSize: 15, textTransform: "uppercase", lineHeight: 23 }}>Samci Restaurant</Text>
                </View>
                <View>
                    <Text style={{ fontFamily: "OpenSans-Regular", color: "#fff", fontSize: 13, textTransform: "uppercase", lineHeight: 22 }}>102, Ist floor, Rehmat Apartments Rajbagh Srinagar</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <IonIcons name="timer-outline" color="#fff" size={20} />
                    <Text style={{ fontFamily: "OpenSans-Regular", color: "#fff", fontSize: 13, textTransform: "uppercase", lineHeight: 22 }}>5m Away</Text>
                </View>
            </View>
        </View>
    )
}