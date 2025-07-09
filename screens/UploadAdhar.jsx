import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Header from '../components/common/Header'
import useImagePicker from '../components/hooks/useImagePicker'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import apiService from '../services/ApiService'

const UploadAdhar = () => {
const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);
     const pickImage = useImagePicker();
  const [adharFront, setAdharFront] = useState(null);
  const [adharBack, setAdharBack] = useState(null);
const navigation = useNavigation()

const handleSubmit = async() => {
     console.log("Upload Adhar Screen Rendered",adharFront, adharBack);
    if (!adharFront || !adharBack) {
        alert("Please upload both front and back images of your Aadhar card.");
        return;
    }
     const formData = new FormData();
    formData.append('adhar_front', {
        uri: adharFront,
        name: 'adharFront.jpg',
        type: 'image/jpeg',
    });
    formData.append('adhar_back', {
        uri: adharBack,
        name: 'adharBack.jpg',
        type: 'image/jpeg',
    });
try {
   
setLoading(true);
    const response = await apiService('/api/deliveryBoy/adharUpdate', 'PATCH', formData, {
            Authorization: `Bearer ${token}`,
    });
   if(response.data.status === "success") {
    setLoading(false);
//     console.log("Aadhar card submitted successfully:", response.data);
    alert("Aadhar card submitted successfully!");
    navigation.goBack();
}} catch (error) {
    console.error("Error submitting Aadhar card:", error);
    alert("Failed to submit Aadhar card. Please try again later.");
    
}finally{
    setLoading(false);  
}

}

    return (
        <View style={styles.container}>
            <Header title={'Upload Adhar Card'} showicon={true}/>
            <ScrollView style={{ marginBottom: 10 }}>
                <View style={{ padding: "5%", borderStyle: "dashed", borderBottomColor: "#D6D6D6", borderBottomWidth: 1, }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontFamily: "OpenSans-Regular",
                            textAlign: "center",
                            lineHeight: 21,
                            maxWidth: "90%",
                            marginHorizontal: "auto",
                            letterSpacing: 0.05
                        }}
                    >
                        Provide sharp images of the documents
                        below for quicker verification.
                    </Text>
                </View>
                <AdharUpload pickImage={pickImage} setAdharFront={setAdharFront} adharFront={adharFront}/>
                <UploadedAdharCards setAdharBack={setAdharBack} pickImage={pickImage} adharBack={adharBack} />
                <TouchableOpacity onPress={handleSubmit} style={{ marginVertical: "10%", backgroundColor: "#FA4A0C", borderRadius: 10, height: 50, display: "flex", justifyContent: "center", alignItems: "center", width: "80%", marginHorizontal: "auto" }}>
                    {loading ? (<ActivityIndicator size="small" color="#fff" />) : (<Text style={{ color: "#fff", fontSize: 16, fontFamily: "OpenSans-Medium", textAlign: "center", }}>Submit</Text>)}
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default UploadAdhar

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
})



const AdharUpload = ({setAdharFront,pickImage,adharFront={adharFront}}) => {
    return (
        <View style={{ marginTop: "10%", padding: "5%", width: "90%", marginHorizontal: "auto", borderStyle: "dashed", borderColor: "#6D6D6D", borderWidth: 1, borderRadius: 10 }}>
            <View>
                <Text
                    style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 16
                    }}
                >Your name and photo Should be clearly
                    visible on the front of your Aadhar card.
                </Text>
                
               {adharFront && (
        <Image
          source={{ uri: adharFront }}
          style={{ width: "100%", height: 200, marginTop: 20, borderRadius: 10 }}
        />
      )}
            </View>
           
            <View style={{ marginTop: "10%" }}>
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
                onPress={() => pickImage(setAdharFront)}
                >
                    <Entypo name="image" size={20} color="#FA4A0C" />
                    <Text style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 16,
                        color: "#FA4A0C"
                    }}>Upload Front</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const UploadedAdharCards = ({ setAdharBack, pickImage,adharBack}) => {
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
                    Upload Back-Side photo and details
                    should be clearly Visible.
                </Text>
            </View>
            {/* adhar card */}
             {adharBack && (
        <Image
          source={{ uri: adharBack }}
          style={{ width: "100%", height: 200, marginTop: 20, borderRadius: 10 }}
        />
      )}
            
            <View style={{marginTop: "10%" }}>
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
                onPress={() => pickImage(setAdharBack)}
                >
                     <Entypo name="image" size={20} color="#FA4A0C" />
                    <Text style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 16,
                        color: "#FA4A0C"
                    }}>Upload Back</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}
