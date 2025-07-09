import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Header from '../components/common/Header'
import apiService from '../services/ApiService'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import PendingDoc from '../components/info/PendingDoc'
import CompletedDoc from '../components/info/CompletedDocs'
import { setisAuthenticated } from '../redux/authSlice'
import SuccessModal from '../components/common/DynamicModal'
const { height } = Dimensions.get("window")

const PartnerOnboarding = () => {
    const [successModal, setSuccessModal] = useState(false);
    const [pending,setPending] = useState([]);
    const [approved,setApproved] = useState([]);
    const {token}=useSelector((state) => state.auth);
    const dispatch=useDispatch()
    const navigation = useNavigation()

const handleNext = () => {
    if (pending.length === 0 ) {
//    dispatch(setisAuthenticated(true))
setSuccessModal(true);
  
}else {
    Alert.alert("You have pending documents to upload. Please complete the required documents before proceeding.",)}

}

const GetInfo=async()=>{
    try {
        const res= await apiService('/api/deliveryBoy/getDocsStatus', 'GET',null,{
            Authorization: `Bearer ${token}`,
        });
        console.log("res",res.data.data);
        setPending(res.data.data.pendingDocuments);
        setApproved(res.data.data.completedDocuments);
    } catch (error) {
        console.error("Error fetching data:", error);
        
    }
}
useFocusEffect(
    useCallback(() => {
    GetInfo();
  }, [])
)


    return (
        <View style={styles.container}>
            <Header title={'Welcome to Food Kart '} subtitle={'Just a few more steps will help you finish creating your profile and begin making money.' } fd='column'/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                    <View>
                        <Text style={{ color: "#000", fontFamily: "OpenSans-Medium", fontSize: 20, lineHeight: 27 }}>Pending Docs</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                       {pending.length === 0 ? (
  <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 15, color: "#000" ,textAlign: "center"}}>
    No pending documents
  </Text>
) : (
  pending.map((doc, index) => (
    <PendingDoc
      key={index}
      title={doc}
      href={doc.toLowerCase().replace(/ /g, "-")}
    />
  ))
)}
                      
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 30 }}>
                    <View>
                        <Text style={{ color: "#000", fontFamily: "OpenSans-Medium", fontSize: 20, lineHeight: 27 }}>Completed Docs</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        {approved.map((doc, index) => (
                            <CompletedDoc key={index} title={doc} href={doc.toLowerCase().replace(/ /g, "-")} navigation={navigation}/>
                        ))}
                    </View>
                </View>
                <TouchableOpacity 
                onPress={handleNext}
                style={{ backgroundColor: "#FA4A0C", padding: 10, borderRadius: 10, marginBottom: 20, minHeight: 50, display: "flex", justifyContent: "center", alignItems: "center", marginHorizontal: 40 }}>
                    <Text style={{ color: "white", fontFamily: "OpenSans-Bold", fontSize: 16, textAlign: "center" }}>Continue</Text>
                </TouchableOpacity>
            </ScrollView>
            <SuccessModal visible={successModal} setVisible={setSuccessModal} message={'Your documents have been successfully uploaded'} onClose={()=>dispatch(setisAuthenticated(true))}/>
        </View>
    )
}

export default PartnerOnboarding

const styles = StyleSheet.create({
    container: {
        flex: 1,

    }
})

// const Header = () => {
//     return (
//         <View style={{ width: "100%", backgroundColor: "#202020", elevation: 5, borderBottomStartRadius: 25, borderBottomEndRadius: 25, padding: "7%" ,  paddingTop: Platform.OS === "ios" ? 50 : 20, 
// }}>
//             <View>
//                 <Text style={{ color: "white", fontSize: 20, fontFamily: "OpenSans-Bold", textAlign: "center" }}>Welcome to Food kart</Text>
//             </View>
//             <View style={{ marginTop: "7%", maxWidth: "80%", marginHorizontal: "auto" }}>
//                 <Text style={{ color: "white", fontSize: 12, fontFamily: "OpenSans-Regular", textAlign: "center" }}>Just a few more steps will help you finish creating
//                     your profile and begin making money.</Text>
//             </View>
//         </View>
//     )
// }

// const PendingDoc = ({ title, href }) => {
//     const navigation = useNavigation()
//     return (
//         <TouchableOpacity onPress={() => navigation.navigate(href)} style={{ backgroundColor: "#fff", padding: 10, borderColor: "#D6D6D6", borderWidth: 0.5, display: "flex", flexDirection: "row", alignItems: "center", borderRadius: 10, minHeight: 50, marginVertical: 5 }}>
//             <View>
//                 <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 15 }}>{title}</Text>
//             </View>
//             <View style={{ flex: 1, alignItems: "flex-end" }}>
//                 <EvilIcons name='chevron-right' size={25} color={"#000000"} />
//             </View>
//         </TouchableOpacity>
//     )
// }

// const CompletedDoc = ({ title, navigation,href}) => {
//     return (
//         <TouchableOpacity onPress={() => navigation.navigate(href)} style={{ backgroundColor: "#fff", padding: 10, borderColor: "#D6D6D6", borderWidth: 0.5, display: "flex", flexDirection: "row", alignItems: "center", borderRadius: 10, minHeight: 50, marginVertical: 5 }}>
//             <View>
//                 <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 15, color: "#60B246" }}>{title}</Text>
//             </View>
//             <View style={{ flex: 1, alignItems: "flex-end" }}>
//                 <MaterialIcons name='done' size={25} color={"#60B246"} />
//             </View>
//         </TouchableOpacity>
//     )
// }