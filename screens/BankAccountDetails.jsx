import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import Header from '../components/common/Header'
import InputField from '../components/common/InputField'
import { useState } from 'react'
import DynamicDropdown from '../components/common/Dropdown'
import { Banks } from '../static/Data'
import { useSelector } from 'react-redux'
import apiService from '../services/ApiService'
import { colors } from '../constants/colors'
import ButtonComp from '../components/common/ButtonComp'

const BankAccountDetails = () => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation()
    const [confirmAccountNo, setConfirmAccountNo] = useState('');
      const [inputs, setInputs] = useState({
      account_no: '',
      IFSC_code: '',
       bank_name: '',
    });


const handleSubmit = async() => {
    if (inputs.account_no.length<16 || !inputs.IFSC_code || !inputs.bank_name || !confirmAccountNo) {
        alert("Please fill all fields correctly.");
        return;
    }
    if (inputs.account_no !== confirmAccountNo) {
        alert("Account numbers do not match. Please re-enter.");
        return;
    }
   try {
    setLoading(true);
    const response = await apiService('/api/deliveryBoy/bankUpdate', 'PATCH', inputs, {
        Authorization: `Bearer ${token}`,
    });
    if (response.data) {
        setLoading(false);
        alert("Bank details submitted successfully!");
        console.log(response.data);
        
    } else {
        alert("Failed to submit bank details. Please try again later.");
    }
  
   } catch (error) {
        console.error("Error in HandleSubmit:", error);
        alert("An error occurred while submitting bank details. Please try again later.");
    } finally {
        setLoading(false);
   }
}

    return (
        <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
            <Header title={"Enter Bank Information"} showicon={false}/>
            
                       
              <InputField
  label="Account Number"
  placeholder="Enter Account Number"
  value={inputs.account_no}
  onChangeText={(text) => setInputs({ ...inputs, account_no: text })}
/>
<InputField
  label="Re-Enter Account Number"
  placeholder="Enter Account Number"
  value={confirmAccountNo}
  onChangeText={(text) => setConfirmAccountNo(text)}
/>
 <DynamicDropdown
  label="Select your Bank"
  selectedValue={inputs.bank_name}
  onValueChange={(value) => setInputs({ ...inputs, bank_name: value })}
  options={Banks}
/>
            <InputField
  label="IFSC Code"
  placeholder="Enter IFSC Code"
  value={inputs.IFSC_code}
  onChangeText={(text) => setInputs({ ...inputs, IFSC_code: text })}
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

export default BankAccountDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        paddingTop:Platform.OS === "ios" ? 40 : 0
    
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