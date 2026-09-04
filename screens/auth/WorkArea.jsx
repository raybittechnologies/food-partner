import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import RadioButton from 'react-native-radio-button'
import { useState } from 'react'
import Fa from 'react-native-vector-icons/FontAwesome'
import Header from '../../components/common/Header'
const WorkArea = () => {
    const [areaPref, setAreaPref] = useState(null)
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <Header title={"Select area you want to work in"} showicon={true}/>
            <View>
                <Text
                    style={{
                        fontFamily: "OpenSans-Regular",
                        maxWidth: "80%",
                        marginHorizontal: "auto",
                        marginVertical: "3%",
                        textAlign: "center",
                        fontSize: 14,
                        lineHeight: 21,
                        letterSpacing: 0.05
                    }}
                >
                    Your Selection will be valid for 30 days. Select
                    area on the basis of earnings and distance from
                    your location.
                </Text>
            </View>
            <View style={{ marginTop: "10%" }}>
                <AreaPrefCard
                    heading={"Rajbagh"}
                    secondaryHeading={"4 km Away"}
                    areaPref={areaPref}
                    setAreaPref={setAreaPref}
                />
                <AreaPrefCard
                    heading={"Lalchowk"}
                    secondaryHeading={"6 Km Away"}
                    areaPref={areaPref}
                    setAreaPref={setAreaPref}
                />
                <AreaPrefCard
                    heading={"Soura"}
                    secondaryHeading={"10 Km Away"}
                    areaPref={areaPref}
                    setAreaPref={setAreaPref}
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("order-delivery-type")} style={{ marginTop: "15%", width: "90%", height: 64, marginHorizontal: "auto", backgroundColor: "#FA4A0C", padding: 10, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#fff", fontSize: 24, fontFamily: "OpenSans-Regular" }}>Continue</Text>
            </TouchableOpacity>
        </View>
    )
}

export default WorkArea

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
})




const AreaPrefCard = ({ heading, secondaryHeading, areaPref, setAreaPref }) => {

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
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <View>
                    <RadioButton
                        animation={'bounceIn'}
                        isSelected={heading === areaPref}
                        onPress={() => setAreaPref(heading)}
                        size={8}
                        innerColor={heading === areaPref ? "#FA4A0C" : "#fff"}
                        outerColor={"#000"}
                    />
                </View>
                <View>
                    <Text style={{
                        fontSize: 14,
                        fontFamily: "OpenSans-Bold",
                        marginLeft: 10,
                        lineHeight: 19
                    }}>
                        {heading}
                    </Text>
                </View>
            </View>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 5,
                marginLeft: 18,
            }}>
                <Fa name="location-arrow" size={16} />
                <Text style={{
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",

                    lineHeight: 17

                }}>{secondaryHeading}</Text>

            </View>
            <View>
                <Text style={{
                    fontSize: 14,
                    fontFamily: "OpenSans-Regular",
                    marginLeft: 18,
                    lineHeight: 18
                }}>Upto
                    <Text style={{
                        fontSize: 14,
                        fontFamily: "OpenSans-Medium",
                        marginLeft: 18,
                        lineHeight: 18,
                        color: "#FA4A0C",

                    }}>{" "}4000{" "}</Text>
                    Weekly Earnings</Text>
            </View>
        </View>
    )
}