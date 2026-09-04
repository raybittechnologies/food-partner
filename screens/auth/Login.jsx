import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
const { height, width } = Dimensions.get("window")
import { useNavigation } from '@react-navigation/native'
import apiService from '../../services/ApiService';
import { useState } from 'react';
import ButtonComp from '../../components/common/ButtonComp';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Heading from '../../components/signup/Heading';
import Input from '../../components/signup/Input';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../../constants/colors';

const Login = () => {
  const navigation = useNavigation()
  const [error, setError] = useState(null);
  const [loading,setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(null);


const SendOtp= async () => {
  console.log("Phone Number:", phoneNumber);
  // navigation.replace("otp", { phoneNumber });
  if (!phoneNumber || phoneNumber.length < 10) {
    alert("Please enter a valid phone number");
    return;
  }
try {
  setLoading(true)
  const response = await apiService('/api/deliveryBoy/deliverySendOtp','POST', { phone_no:phoneNumber });
  if (response.data) {
    console.log("OTP sent successfully:", response.data);
    navigation.navigate("otp", { phoneNumber,otpres:response.data.otp });
  } else {
    console.log("Failed to send OTP:", response.error);
    alert("Failed to send OTP. Please try again later.");
  }
} catch (error) {
  setError(error.message);
  console.log("Error sending OTP:", error);
  alert("Failed to send OTP. Please try again later.");
  
}finally {
  setLoading(false)
}
}


 return (
     <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >


        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/images/splash.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Heading
          title="Welcome Back!"
          subtitle="Sign in with your mobile number to continue."
        />

        <View style={styles.form}>
          <Input
            placeholder="Mobile Number"
            icon={<Feather name="phone" size={18} color="#8A8A8A" />}
            value={phoneNumber}
            onChange={(text) => setPhoneNumber(text)}
            error={error }
            type="phone-pad"
            maxLength={10}
          />

           <ButtonComp
            title="Continue"
            onPress={SendOtp}
            bg={colors.primary}
            color="#fff"
            size={16}
            fw="700"
            ff="OpenSans-Bold"
            ta="center"
            height={48}
            loading={loading}
            mt={50}
          />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: height * 0.1,
  },
  backButton: {
    marginTop: height * 0.02,
    marginBottom: 16,
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 90,
    height: 60,
  },
  form: {
    marginTop: 24,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
    paddingTop: 40,
  },
});
