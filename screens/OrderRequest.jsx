import { Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useOrder } from '../context/OrderContext';
import { useNavigation } from '@react-navigation/native';
import IonIcons from 'react-native-vector-icons/Ionicons'
import Countdown from '../components/order/ShrinkingBorder';
import { useSocket } from '../context/sockets';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrder, setDelivery } from '../redux/authSlice';
import apiService from '../services/ApiService';

const OrderRequest = ({route}) => {
 const {status}= route.params || {};
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const { order,token } = useSelector((state) => state.auth);
    console.log("Order Request:", order);
    const { newOrder, setIsNewOrder,setNewOrder } = useSocket();
   

    const [timeLeft, setTimeLeft] = useState(60);
console.log("New Order:", order);
const handleOrder = async () => {
  try {
    const url =
      status === 'dispatched'
        ? `/api/deliveryBoy/confirmOrder?order_id=${order?.order_id}`
        : `/api/deliveryBoy/acceptOrder?order_id=${order?.order_id}`;

    const res = await apiService(
      url,
      "PATCH",
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Order processed successfully:", res);
if (res.data?.status==='on the way') { 
    navigation.replace("dashboard", {
  screen: "Home", 
});
dispatch(setDelivery("delivering"))
 console.log("Delivering")
}else if(res.data?.status==='accepted'){
    navigation.replace("dashboard", { screen: "Home" });
    console.log("Accepted")
}else{
    Alert.alert("Error", "Failed to process the order. Please try again.");
}

  } catch (error) {
    console.error("Error handling order:", error);
    Alert.alert("Error", "Failed to handle the order. Please try again.");
  }
};


const handleTimeOut=()=>{
    dispatch(clearOrder())
    setNewOrder(false)
    navigation.replace("dashboard", { screen: "Home" });
}


    const handleAccept = () => {
        handleOrder(); // Call the function to handle the order acceptance
        
        setNewOrder(false); // Reset newOrder state
        setIsNewOrder(true)
    };
    return (
        <View style={{ flex: 1, backgroundColor: "#202020", padding: "5%" ,paddingTop: "10%"}}>
            <View style={{ marginHorizontal: "auto", marginVertical: 20, borderColor: "#FA4A0C", borderRadius: 100 }}>
                {/* <Image source={require("../assets/images/map.png")} style={{ borderRadius: 50, resizeMode: "contain" }} /> */}
              {status !== "dispatched" && <Countdown onComplete={handleTimeOut}/>}
                
            </View>
   {status !=="dispatched" && <View>
                <Text style={{ color: "#fff", fontFamily: "OpenSans-Medium", fontSize: 24, textAlign: "center" }}>New Order!</Text>
            </View>}
            
            <View style={{ marginTop: "10%", width: "90%", marginHorizontal: "auto", }}>
                <View style={{ borderColor: "#6D6D6D", borderWidth: 1, borderTopStartRadius: 10, borderTopEndRadius: 10 }}>
                    <Text style={{ fontFamily: "OpenSans-Regular", color: "#fff", fontSize: 20, textAlign: "center", padding: "5%" }}>Expected Earning : <Text style={{ fontFamily: "OpenSans-Bold", color: "#fff", fontSize: 20 }}> Rs {order?.del_amount}</Text></Text>
                </View>
                <View style={{ borderColor: "#6D6D6D", borderWidth: 1, borderBottomStartRadius: 10, borderBottomEndRadius: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ borderRightColor: "#6D6D6D", borderRightWidth: 1, padding: "5%", display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <Text style={{ fontFamily: "OpenSans-Regular", color: "#fff", fontSize: 14, textAlign: "center", padding: "5%" }}>Pickup : <Text style={{ fontFamily: "OpenSans-Bold", color: "#fff", fontSize: 14 }}> {!status ? order?.delivery_boy_route?.to_restaurant?.total_distance : 0} km</Text></Text>
                    </View>
                    <View style={{ borderRightColor: "#6D6D6D", borderRightWidth: 1, padding: "5%", display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <Text style={{ fontFamily: "OpenSans-Regular", color: "#fff", fontSize: 14, textAlign: "center", padding: "5%" }}>Drop: <Text style={{ fontFamily: "OpenSans-Bold", color: "#fff", fontSize: 14 }}> {order?.delivery_boy_route?.full_journey?.total_distance} km</Text></Text>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: "10%", width: "90%", marginHorizontal: "auto", borderColor: "#6D6D6D", borderRadius: 10, padding: "5%", borderWidth: 1 }}>
                <View>
                    <Text style={{
                        fontFamily: "OpenSans-Regular", color: "#fff", fontSize: 15, textTransform: "uppercase", lineHeight: 22, fontWeight: "300"
                    }}>pickup from</Text>
                </View>
                <View>
                    <Text style={{ fontFamily: "OpenSans-Medium", color: "#fff", fontSize: 15, textTransform: "uppercase", lineHeight: 23 }}>{order?.restaurant_name}</Text>
                </View>
                <View>
                    <Text style={{ fontFamily: "OpenSans-Regular", color: "#fff", fontSize: 13, textTransform: "uppercase", lineHeight: 22 }}>{order?.street}, {order?.landmark}, {order?.area}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <IonIcons name="timer-outline" color="#fff" size={20} />
                    <Text style={{ fontFamily: "OpenSans-Regular", color: "#fff", fontSize: 13, textTransform: "uppercase", lineHeight: 22 }}>{order?.delivery_boy_route?.to_restaurant?.estimated_time} min Away</Text>
                </View>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end", padding: "5%" }}>
                <TouchableOpacity onPress={handleAccept} style={{ backgroundColor: status === 'dispatched' ? 'green' : '#FA4A0C', height: 50, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 25 }}>
                    <Text style={{ color: "#fff", fontFamily: "OpenSans-Medium", fontSize: 20 }}>{status === 'dispatched' ? 'Confirm' : 'Accept'}</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default OrderRequest

const styles = StyleSheet.create({})