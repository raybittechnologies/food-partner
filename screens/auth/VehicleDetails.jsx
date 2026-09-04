import { ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/common/Header'
import InputField from '../../components/common/InputField'
import { useState } from 'react'
import DynamicDropdown from '../../components/common/Dropdown'
import { useSelector } from 'react-redux'
import useImagePicker from '../../components/hooks/useImagePicker'
import apiService from '../../services/ApiService'
import { colors } from '../../constants/colors'
import ButtonComp from '../../components/common/ButtonComp'



const VehicleDetails = () => {
    const { token } = useSelector((state) => state.auth)
    const pickImage = useImagePicker()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [vehicleImage, setVehicleImage] = useState(null)
    const [inputs, setInputs] = useState({
        vehicle_no: '',
        registration_no: '',
        vehicle_type: '', // 'bike' or 'ev'
    })

    const vehicleOptions = [
        { label: 'Bike', value: 'bike' },
        { label: 'EV', value: 'ev' },
    ]

    const handleSubmit = async () => {
        if (!inputs.vehicle_no || !inputs.registration_no || !inputs.vehicle_type || !vehicleImage) {
            alert('Please fill all valid fields and upload a vehicle image')
            return
        }

        const formData = new FormData()
        formData.append('vehicle_no', inputs.vehicle_no)
        formData.append('registration_no', inputs.registration_no)
        formData.append('vehicle_type', inputs.vehicle_type)
        formData.append('vehicle_image', {
            uri: vehicleImage,
            name: 'PanFront.jpg',
            type: 'image/jpeg',
        })

        try {
            setLoading(true)
            const response = await apiService('/api/deliveryBoy/vehicleUpdate', 'PATCH', formData, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            })

            if (response?.data?.status === 'success') {
                alert('Vehicle details submitted successfully!')
                console.log(response.data)
                // navigation.navigate("bank-account-details");
            } else {
                alert('Failed to submit vehicle details. Please try again later.')
            }
        } catch (error) {
            console.log('Error in HandleSubmit:', error)
            alert('An error occurred while submitting vehicle details. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Header title="Enter Vehicle Information" showicon={false} />
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
                <VehicleUpload
                    pickImage={pickImage}
                    setVehicleImage={setVehicleImage}
                    vehicleImage={vehicleImage}
                />
            </ScrollView>


           
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
        </KeyboardAvoidingView>
    )
}

export default VehicleDetails

const VehicleUpload = ({ pickImage, setVehicleImage, vehicleImage }) => {
    return (
        <View style={styles.uploadCard}>
            <Text style={styles.uploadHint}>
                Vehicle Image should be clear with Vehicle Number visible on it.
            </Text>

            {vehicleImage ? (
                <Image source={{ uri: vehicleImage }} style={styles.uploadedImage} />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Entypo name="image" size={36} color={colors.primary} />
                </View>
            )}

            <TouchableOpacity
                style={styles.uploadButton}
                activeOpacity={0.8}
                onPress={() => pickImage(setVehicleImage)}
            >
                <Entypo name="image" size={20} color={colors.primary} />
                <Text style={styles.uploadButtonText}>
                    {vehicleImage ? 'Change Photo' : 'Upload Photo'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding:16
    },
    scrollContent: {
        paddingBottom: 20,
    },
    submitButton: {
        marginVertical: 16,
        marginHorizontal: '10%',
        backgroundColor: colors.primary,
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: 'OpenSans-Medium',
        textAlign: 'center',
    },
    uploadCard: {
        marginTop: 24,
        padding: 16,
        borderStyle: 'dashed',
        borderColor: colors.dashedBorder,
        borderWidth: 1.5,
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
    },
    uploadHint: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: colors.subtext,
        textAlign: 'center',
    },
    imagePlaceholder: {
        height: 160,
        marginTop: 16,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadedImage: {
        width: '100%',
        height: 180,
        marginTop: 16,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    uploadButton: {
        marginTop: 20,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    uploadButtonText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 16,
        color: colors.primary,
    },
})