import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'
import Header from '../../components/common/Header'
import apiService from '../../services/ApiService'
import { useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import CompletedDoc from '../../components/info/CompletedDocs'
import PendingDoc from '../../components/info/PendingDoc'
const PersonalDocs = () => {
const navigation = useNavigation()
const { token } = useSelector((state) => state.auth);
const [pending, setPending] = useState([]);
const [approved, setApproved] = useState([]);

    const GetInfo=async()=>{
    try {
        const res= await apiService('/api/deliveryBoy/getPersonalDocsStatus', 'GET',null,{
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
            <Header title={'Upload Personal Documents'} showicon={false}/>

            <View style={{  marginTop: "5%" }}>
                {pending.map((doc, index) => (
                    <PendingDoc key={index} title={doc} href={doc.toLowerCase().replace(/ /g, "-")} />
                ))}
                {/* <DocumentItem title={"Aadhar Card"} href="upload-adhar" />
                <DocumentItem title={"PAN Card"} href="upload-pan" />
                <DocumentItem title={"Driving License"} href="upload-driving-license" /> */}
            </View>
            <View>
                        <Text style={{ color: "#000", fontFamily: "OpenSans-Medium", fontSize: 20, lineHeight: 27 }}>Completed Docs</Text>
                    </View>
             <View style={{ marginTop: 20 }}>
                        {approved.map((doc, index) => (
                            <CompletedDoc key={index} title={doc} href={doc.toLowerCase().replace(/ /g, "-")} navigation={navigation}/>
                        ))}

                    </View>
        </View>
    )
}

export default PersonalDocs

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff"
    }
})


const DocumentItem = ({ title, href }) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={() => navigation.navigate(href)} style={{ padding: "5%", backgroundColor: "#fff", elevation: 5, borderRadius: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: "3%" }}>
            <View>
                <Text style={{
                    fontFamily: "OpenSans-Regular",
                    fontSize: 16,
                    color: "#000"
                }}>{title}</Text>
            </View>
            <View>
                <Entypo name="chevron-right" size={20} color="#000" />
            </View>
        </TouchableOpacity>
    )
}