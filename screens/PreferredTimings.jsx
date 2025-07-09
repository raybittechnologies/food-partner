import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import RadioButton from 'react-native-radio-button'
import { useState } from 'react'
import Header from '../components/common/Header'
import { useSelector } from 'react-redux'
import apiService from '../services/ApiService'

const PreferredTimings = () => {
    const [loading, setLoading] = useState(false)
    const { token } = useSelector((state) => state.auth);
    const [workPref, setWorkPref] = useState(null)
    const navigation = useNavigation()


const handlecontinue = async () => {
    if (!workPref) {
        alert("Please select your preferred work timings");
        return;
    }
   try {
    const response =await apiService('/api/deliveryBoy/workUpdate', 'PATCH', { type: workPref }, {
        Authorization: `Bearer ${token}`,
    });
    if (response.data.status === "success") {
        setLoading(false);
        console.log("Work preference updated successfully:", response.data);
        alert("Your work preference has been saved successfully!");
        
    } else {
        alert("Failed to save your preferences. Please try again later.");
    }
   } catch (error) {
       console.error("Error in handlecontinue:", error);
       alert("An error occurred while saving your preferences. Please try again later.");
    
   }finally {
       setLoading(false);
   }

}
    return (
        <View style={styles.container}>
            <Header title={"Select your preferred work Timings"} showicon={true}/>
            <View>
                <Text
                    style={{
                        fontFamily: "OpenSans-Regular",
                        maxWidth: "75%",
                        marginHorizontal: "auto",
                        marginVertical: "3%",
                        textAlign: "center",
                        fontSize: 14,
                        lineHeight: 21,
                        letterSpacing: 0.05
                    }}
                >
                    Your Selection will be valid for 30 days. You
                    can change your preferences after that.
                </Text>
            </View>
            <View style={{ marginTop: "10%" }}>
                <TimingCard
                    heading={"Full Time | All days"}
                    data={'full_time'}
                    secondaryHeading={"6 days a week"}
                    workPref={workPref}
                    setWorkPref={setWorkPref}
                />
                <TimingCard
                    heading={"Part Time | 4-6 hours"}
                    data={'part_time'}
                    secondaryHeading={"6 days a week"}
                    workPref={workPref}
                    setWorkPref={setWorkPref}
                />
                <TimingCard
                    heading={"Part Time | Weekends Only"}
                    data={'weekends'}
                    secondaryHeading={"Fri, Sat, Sun."}
                    workPref={workPref}
                    setWorkPref={setWorkPref}
                />
            </View>
            <TouchableOpacity onPress={handlecontinue} style={{ marginTop: "15%", width: "90%", height: 64, marginHorizontal: "auto", backgroundColor: "#FA4A0C", padding: 10, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {loading ? (<ActivityIndicator size={"small"} color={"#fff"} />) : (<Text style={{ color: "#fff", fontSize: 24, fontFamily: "OpenSans-Regular" }}>Continue</Text>)}
            </TouchableOpacity>
        </View>
    )
}

export default PreferredTimings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
})




const TimingCard = ({ heading, secondaryHeading, workPref, setWorkPref,data }) => {

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
                        isSelected={data === workPref}
                        onPress={() => setWorkPref(data)}
                        size={8}
                        innerColor={data === workPref ? "#FA4A0C" : "#fff"}
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
            <View>
                <Text style={{
                    fontSize: 12,
                    fontFamily: "OpenSans-Regular",
                    marginLeft: 18,
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