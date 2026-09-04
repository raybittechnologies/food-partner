import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import RadioButton from 'react-native-radio-button'
import { useState } from 'react'
import Header from '../../components/common/Header'

const VehicleSelection = () => {
    const [chooseVehicle, setChooseVehicle] = useState(false)
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <Header title={"Select Your Vehicle"} showicon={true}/>
            <View style={{ marginTop: "5%" }}>
                <VehicleCard imgSrc={require("../../assets/images/scooty.png")} vehicle={chooseVehicle} setVehicle={setChooseVehicle} heading={"Bike"} text={"Deliver By Bike"} />
                <VehicleCard imgSrc={require("../../assets/images/cycle.png")} vehicle={chooseVehicle} setVehicle={setChooseVehicle} heading={"EV"} text={"Cycle Not Allowed"} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("work-area")} style={{ marginTop: "15%", width: "90%", height: 64, marginHorizontal: "auto", backgroundColor: "#FA4A0C", padding: 10, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#fff", fontSize: 24, fontFamily: "OpenSans-Regular" }}>Continue</Text>
            </TouchableOpacity>
        </View>
    )
}

export default VehicleSelection

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
})



const VehicleCard = ({ heading, imgSrc, text, vehicle, setVehicle }) => {
    return (
        <View style={{
            backgroundColor: "#fff",
            elevation: 1,
            width: "90%",
            marginHorizontal: "auto",
            padding: "5%",
            borderRadius: 10,
            marginVertical: "3%",
            borderColor: "#6D6D6D80",
            borderWidth: 1
        }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                    <View>
                        <RadioButton
                            animation={'bounceIn'}
                            isSelected={heading === vehicle}
                            onPress={() => setVehicle(heading)}
                            size={8}
                            innerColor={vehicle === heading ? "#FA4A0C" : "#fff"}
                            outerColor={"#000"}
                        />
                    </View>
                    <View >
                        <Text style={{ fontSize: 16, fontFamily: "OpenSans-Bold", lineHeight: 21 }}>{heading}</Text>
                        <Text style={{ fontSize: 14, fontFamily: "OpenSans-Regular", lineHeight: 19 }}>{text}</Text>
                    </View>
                </View>
                <View>
                    <Image style={{ height: 50, width: 100, resizeMode: "cover" }} source={imgSrc} />
                </View>
            </View>
        </View>
    )
}
