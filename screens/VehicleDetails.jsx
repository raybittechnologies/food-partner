import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'
import Header from '../components/common/Header'
import InputField from '../components/common/InputField'
import { useState } from 'react'
import DynamicDropdown from '../components/common/Dropdown'
import { useSelector } from 'react-redux'
import useImagePicker from '../components/hooks/useImagePicker'
import apiService from '../services/ApiService'

const VehicleDetails = () => {
    const { token } = useSelector((state) => state.auth);
    const pickImage = useImagePicker();
    const [loading, setLoading] = useState(false);
    const [vehicleImage, setVehicleImage] = useState(null);
  const [inputs, setInputs] = useState({
  vehicle_no: '',
  registration_no: '',
  vehicle_type: '', // will be either 'bike' or 'ev'
});
    const vehicleOptions = [
  { label: 'Bike', value: 'bike' },
  { label: 'EV', value: 'ev' },
];

const handleSubmit= async() => {

    if (!inputs.vehicle_no || !inputs.registration_no || !inputs.vehicle_type ) {
        alert("Please fill all valid fields and upload a vehicle image");
        return;
    }
    const formData = new FormData();
      formData.append('vehicle_no', inputs.vehicle_no);
  formData.append('registration_no', inputs.registration_no);
  formData.append('vehicle_type', inputs.vehicle_type);
      formData.append('vehicle_image', {
        uri: vehicleImage,
        name: 'PanFront.jpg',
        type: 'image/jpeg',
    });
    try {
        setLoading(true);
         const response = await apiService('/api/deliveryBoy/vehicleUpdate', 'PATCH', formData, {
        Authorization: `Bearer ${token}`,
    });
    if (response.data.status === "success") {
        setLoading(false);
        alert("Vehicle details submitted successfully!");
        console.log(response.data);
        // navigation.navigate("bank-account-details");
    }
    else {
        alert("Failed to submit vehicle details. Please try again later.");
    }  
    } catch (error) {
        console.error("Error in HandleSubmit:", error.response.data.message);
        alert("An error occurred while submitting vehicle details. Please try again later.");
        
        
    }finally{
        setLoading(false);
    }
    
}

    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <Header title={"Enter Vehicle Information"} showicon={true}/>
            <ScrollView showsVerticalScrollIndicator={false}>
              <InputField
  label="Vehicle Number"
  placeholder="Enter Vehicle Number"
  value={inputs.vehicle_no}
  onChangeText={(text) => setInputs({ ...inputs, vehicle_no: text })}
/>
              <InputField
  label="Registration Number"
  placeholder="Enter Registration Number"
  value={inputs.registration_no}
  onChangeText={(text) => setInputs({ ...inputs, registration_no: text })}
/>
 <DynamicDropdown
  label="Select Vehicle Type"
  selectedValue={inputs.vehicle_type}
  onValueChange={(value) => setInputs({ ...inputs, vehicle_type: value })}
  options={vehicleOptions}
/>
                <VehicleUpload pickImage={pickImage} setVehicleImage={setVehicleImage} vehicleImage={vehicleImage}/>
            </ScrollView>
            <TouchableOpacity onPress={handleSubmit} style={{ marginVertical: "10%", backgroundColor: "#FA4A0C", borderRadius: 10, height: 50, display: "flex", justifyContent: "center", alignItems: "center", width: "80%", marginHorizontal: "auto" }}>
                               {loading ? (<ActivityIndicator size="small" color="#fff" />) : <Text style={{ color: "#fff", fontSize: 16, fontFamily: "OpenSans-Medium", textAlign: "center", }}>Submit</Text>
           }
                           </TouchableOpacity>
        </View>
    )
}

export default VehicleDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
})



// const Input = ({ placeholder, label }) => {
//     return (
//         <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                 <View style={{ width: "90%", marginHorizontal: "auto", marginTop: "5%" }}>
//                     <View>
//                         <Text style={{
//                             color: "#202020", fontSize: 16, fontFamily: "OpenSans-Regular",
//                         }}>{label}</Text>
//                     </View>
//                     <View style={{ marginTop: 5 }}>
//                         <TextInput placeholderTextColor={"#000"} style={{ height: 50, borderColor: "#D6D6D6", borderWidth: 1, borderRadius: 10, padding: 10, fontFamily: "OpenSans-Regular", elevation: 5, backgroundColor: "#fff", paddingLeft: 20, color: "#000" }} placeholder={placeholder} />
//                     </View>
//                 </View>
//             </TouchableWithoutFeedback>
//         </KeyboardAvoidingView>
//     )
// }

const VehicleUpload = ({pickImage,setVehicleImage,vehicleImage}) => {
    return (
        <View style={{ marginTop: "10%", padding: "5%", width: "90%", marginHorizontal: "auto", borderStyle: "dashed", borderColor: "#6D6D6D", borderWidth: 1, borderRadius: 10 }}>
            <View>
                <Text
                    style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 16,
                        textAlign: "center"
                    }}
                >
                    Vehicle Image should be clear with
                    Vehicle Number visible on it.
                </Text>
                {vehicleImage && (
                    <Image
                        source={{ uri: vehicleImage }}
                        style={{ width: "100%", height: 200, marginTop: 20, borderRadius: 10 }}
                    />
                )}
            </View>
            <View style={{ marginTop: "40%" }}>
                <TouchableOpacity style={{
                    width: "90%",
                    marginHorizontal: "auto",
                    borderColor: "#6D6D6D",
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "center"
                }}
                onPress={() => pickImage(setVehicleImage)}
                >
                    <Entypo name="image" size={20} color="#FA4A0C" />
                    <Text style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 16,
                        color: "#FA4A0C"
                    }}>Upload Photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}