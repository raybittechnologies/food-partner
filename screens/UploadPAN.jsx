import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Header from '../components/common/Header'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import useImagePicker from '../components/hooks/useImagePicker'
import apiService from '../services/ApiService'
import { colors } from '../constants/colors'
import ButtonComp from '../components/common/ButtonComp'

const UploadPAN = () => {
    const [loading, setLoading] = useState(false);
        const { token } = useSelector((state) => state.auth);
     const pickImage = useImagePicker();
  const [PanFront, setPanFront] = useState(null);
  const [PanBack, setPanBack] = useState(null);
const navigation = useNavigation()

const handleSubmit = async() => {

    if (!PanFront || !PanBack) {
        alert("Please upload both front and back images of your Aadhar card.");
        return;
    }
try {
    const formData = new FormData();
    formData.append('pan_front', {
        uri: PanFront,
        name: 'PanFront.jpg',
        type: 'image/jpeg',
    });
    formData.append('pan_back', {
        uri: PanBack,
        name: 'PanBack.jpg',
        type: 'image/jpeg',
    });
    console.log("Form Data:", formData);
    setLoading(true);
    const response = await apiService('/api/deliveryBoy/panUpdate', 'PATCH', formData, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
    });
   if(response?.data?.status === "success") {
    setLoading(false);
    console.log("Pan card submitted successfully:", response);
    alert("Pan card submitted successfully!");
    navigation.goBack();
   }
} catch (error) {
    console.error("Error submitting pan card:", error);
    alert("Failed to submit pan card. Please try again later.");
    
}finally{
    setLoading(false);
}

}
    return (
        <View style={styles.container}>
            <Header showicon={false} title={'Upload PAN'}/>
            <ScrollView style={{ marginBottom: 10 }} showsVerticalScrollIndicator={false}>
                <View style={{ padding: "5%", borderStyle: "dashed", borderBottomColor: "#D6D6D6", borderBottomWidth: 1 }}>
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
                <PANUpload pickImage={pickImage} setPanFront={setPanFront} PanFront={PanFront}/>
                <UploadedPANCard setPanBack={setPanBack} pickImage={pickImage} PanBack={PanBack} />
                  <ButtonComp
            title="Submit"
            onPress={handleSubmit}
            bg={colors.primary}
            color="#fff"
            size={16}
            fw="700"
            ff="OpenSans-Bold"
            ta="center"
            height={54}
            loading={loading}
            mt={50}
          />
            </ScrollView>
        </View>
    )
}

export default UploadPAN

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    }
})



const PANUpload = ({pickImage, setPanFront, PanFront}) => {
    return (
        <View style={{ marginTop: "10%", padding: "5%", width: "100%", marginHorizontal: "auto", borderStyle: "dashed", borderColor: "#6D6D6D", borderWidth: 1, borderRadius: 10 }}>
            <View>
                <Text
                    style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 16
                    }}
                >Your name and photo Should be clearly
                    visible on the front of your PAN card.
                </Text>
                      {PanFront && (
        <Image
          source={{ uri: PanFront }}
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
                onPress={() => pickImage(setPanFront)}
                >
                    <Entypo name="image" size={20} color={colors.primary} />
                    <Text style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 16,
                        color: colors.primary
                    }}>Upload Photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const UploadedPANCard = ({setPanBack, PanBack,pickImage}) => {
    return (
        <View style={{ marginTop: "10%", padding: "5%", width: "100%", marginHorizontal: "auto", borderStyle: "dashed", borderColor: "#6D6D6D", borderWidth: 1, borderRadius: 10 }}>
            <View>
               <Text
                    style={{
                        fontFamily: "OpenSans-Regular",
                        fontSize: 16
                    }}
                >Upload the back side of your PAN card.
                </Text>
            </View>
            {/* adhar card */}
               {PanBack && (
        <Image
          source={{ uri: PanBack }}
          style={{ width: "100%", height: 200, marginTop: 20, borderRadius: 10 }}
        />
      )}
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
                onPress={() => pickImage(setPanBack)}
                >
                     <Entypo name="image" size={20} color={colors.primary} />
                                       <Text style={{
                                           fontFamily: "OpenSans-Regular",
                                           fontSize: 16,
                                           color: colors.primary
                                       }}>Upload Back</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}
