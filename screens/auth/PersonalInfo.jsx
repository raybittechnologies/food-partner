import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import RadioButton from 'react-native-radio-button'
import { useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/common/Header'
import ChooseImage from '../../components/info/ChooseImage'
import { useSelector } from 'react-redux'
import apiService from '../../services/ApiService'
import SuccessModal from '../../components/common/DynamicModal'
import { colors } from '../../constants/colors'

const PersonalInfo = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation()
    const { token } = useSelector((state) => state.auth);

    // Kept separate from `inputs`, same as vehicleImage in VehicleDetails.
    // ChooseImage hands back a plain uri string via onSelect, not an object.
    const [profilePic, setProfilePic] = useState(null);

    const [inputs, setInputs] = useState({
        first_name: '',
        last_name: '',
        gender: 'male',
    });



    const SendInfo = async () => {
        if (!inputs.first_name || !inputs.last_name || !profilePic) {
            alert("Please fill all fields and upload a profile picture");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('first_name', inputs.first_name);
            formData.append('last_name', inputs.last_name);
            formData.append('gender', inputs.gender);
            formData.append('profile_pic', {
                uri: profilePic,
                name: profilePic.split('/').pop() || 'profile.jpg',
                type: 'image/jpeg',
            });


            const response = await apiService('/api/deliveryBoy/infoUpdate', 'PATCH', formData, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            });
            if (response.error) {
                console.log(response);
                alert("Failed to send personal information. Please try again later.");
            } else {
                console.log('Success:', response.data);
                setModalMessage('Personal info submitted successfully!');
                setModalVisible(true);
            }
        } catch (error) {
            console.log("Error sending personal info:", error);
            alert("Failed to send personal information. Please try again later.");

        } finally {
            setLoading(false);
        }

    }
    return (
        <View style={styles.container}>
            <Header title={"Enter Personal Information"} showicon={true} />
            <ScrollView style={{ flex: 1 }}>
                <View>
                    <Input
                        label="First Name"
                        placeholder="First Name"
                        value={inputs.first_name}
                        onChangeText={(text) => setInputs({ ...inputs, first_name: text })}
                    />
                    <Input
                        label="Last Name"
                        placeholder="Last Name"
                        value={inputs.last_name}
                        onChangeText={(text) => setInputs({ ...inputs, last_name: text })}
                    />
                </View>
                <RadioInputs
                    gender={inputs.gender}
                    setGender={(g) => setInputs({ ...inputs, gender: g })}
                />
                <ChooseImage
                    imageUri={profilePic}
                    onSelect={(uri) => setProfilePic(uri)}
                />
                <TouchableOpacity
                    onPress={SendInfo}
                    disabled={loading}
                    activeOpacity={0.8}
                    style={[styles.continueButton, loading && styles.continueButtonDisabled]}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.continueButtonText}>Continue</Text>
                    )}
                </TouchableOpacity>
                <SuccessModal
                    visible={modalVisible}
                    message={modalMessage}
                    onClose={() => {
                        setModalVisible(false);
                        navigation.goBack() // or whatever your next screen is
                    }}
                />
            </ScrollView>
        </View>
    )
}

export default PersonalInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    continueButton: {
        marginTop: "10%",
        width: "90%",
        height: 64,
        marginHorizontal: "auto",
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    continueButtonDisabled: {
        opacity: 0.7,
    },
    continueButtonText: {
        color: "#fff",
        fontSize: 24,
        fontFamily: "OpenSans-Regular",
    },
})


const Input = ({ placeholder, label, value, onChangeText }) => {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{  marginTop: "5%" }}>
                    <View>
                        <Text style={{ color: "#202020", fontSize: 16 }}>{label}</Text>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <TextInput
                            value={value}
                            onChangeText={onChangeText}
                            placeholderTextColor="#000"
                            style={{
                                height: 50,
                                borderColor: "#D6D6D6",
                                borderWidth: 1,
                                borderRadius: 10,
                                padding: 10,
                                backgroundColor: "#fff",
                                paddingLeft: 20,
                                color: "#000",
                            }}
                            placeholder={placeholder}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};


const RadioInputs = ({ gender, setGender }) => {
    return (
        <View style={{ paddingTop: "5%" }}>
            <View>
                <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 16, color: "#000000" }}>Select Your  Gender</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20, marginTop: "5%" }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <RadioButton
                        animation={'bounceIn'}
                        isSelected={gender === "male"}
                        onPress={() => setGender("male")}
                        size={10}
                        innerColor={gender === "male" ? colors.primary : "#fff"}
                        outerColor={"#000"}
                    />
                    <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 16, color: "#000000", marginLeft: 10 }}>Male</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <RadioButton
                        animation={'bounceIn'}
                        isSelected={gender === "female"}
                        onPress={() => setGender("female")}
                        size={10}
                        innerColor={gender === "female" ? colors.primary : "#fff"}
                        outerColor={"#000"}
                    />
                    <Text style={{ marginLeft: 10, fontFamily: "OpenSans-Regular", fontSize: 16, color: "#000000" }}>Female</Text>
                </View>
            </View>
        </View>
    )
}

const UploadPic = () => {
    return (
        <View style={{ padding: "5%" }}>
            <View>
                <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 16, color: "#000000" }}>Upload Profile Picture</Text>
            </View>
            <View style={{ backgroundColor: "#fff", elevation: 5, marginTop: "5%", borderRadius: 10, padding: "5%", borderColor: "#D6D6D6", borderWidth: 1, paddingHorizontal: 20 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View>
                        <Image source={require("../../assets/images/avatar.png")} style={{ height: 50, width: 50, borderRadius: 50 }} />
                    </View>
                    <TouchableOpacity style={{ padding: 10, borderRadius: 10, borderColor: "#D6D6D6", borderWidth: 1, elevation: 5, backgroundColor: "#fff", display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <View>
                            <Entypo name="image" size={20} />
                        </View>
                        <View>
                            <Text style={{ fontFamily: "OpenSans-Regular", fontSize: 14, color: "#000000", textAlign: "center" }}>Upload Profile</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}