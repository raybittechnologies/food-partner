import { Dimensions, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
const { height } = Dimensions.get("window")
import { useNavigation } from '@react-navigation/native'
import { OtpInput } from 'react-native-otp-entry'
import { useEffect, useState } from 'react'
import apiService from '../services/ApiService'
import { useDispatch, useSelector } from 'react-redux'
import { setisAuthenticated, setPhoneDetails, setToken, setUser } from '../redux/authSlice'
import Button from '../components/signup/Button'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../constants/colors'
import ButtonComp from '../components/common/ButtonComp'
import Heading from '../components/signup/Heading'
const RESEND_SECONDS = 60;
const Otp = ({route}) => {
  const {deviceToken} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
      const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

    const {phoneNumber,otpres} = route.params || {};
    const navigation = useNavigation()
    const [otp, setOtp] = useState("");
console.log("OTP:", deviceToken);


  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const canResend = secondsLeft <= 0;
  const formattedCountdown = `0:${secondsLeft.toString().padStart(2, '0')}`;


const VerifyOtp=async()=>{
    // navigation.replace("onboarding", { phoneNumber });
    if (otp.length < 4) {
        alert("Please enter a valid OTP");
        return;
    }
   try {
    setLoading(true);
    const response = await apiService(`/api/deliveryBoy/deliveryLogin/${phoneNumber}`, 'POST', { givenOTP: otp,fcm_token: deviceToken });
    console.log("Response:", response);
    if (response.data) {
        console.log("OTP verified successfully:", response.data);
        dispatch(setPhoneDetails(phoneNumber))
        dispatch(setToken(response.data.token))
        dispatch(setUser(response.data.deliverBoy))
        if(response.data.deliveryDocs===true){
          dispatch(setisAuthenticated(true))
          
        }else{
                  navigation.replace("onboarding");

        }
    } else {
        setError(response.error || "Failed to verify OTP");
        console.log("Failed to verify OTP:", response.error);
        // alert("Failed to verify OTP. Please try again later.");
    }
   } catch (error) {
    setError(error.message);
       console.error("Error verifying OTP:", error);
       alert("Failed to verify OTP. Please try again later.");
    
   }finally {
    setLoading(false);
   }

}


console.log("Phone Number:", phoneNumber);
    return (
     <KeyboardAvoidingView style={styles.container} behavior="height">
    <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={22} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/images/splash.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Heading
          title="Verify Your Number"
          subtitle="We've sent a 4-digit code to"
        />

        <Text style={{color:'red'}}>{otpres}</Text>
        <Text style={{color: colors.text, fontSize: 16, textAlign: 'center'}}>+91 {phoneNumber} <Text style={{color: colors.primary, marginLeft: 5,fontWeight: 'bold',fontSize: 16}} onPress={()=>navigation.goBack()}> Change</Text></Text>

         <OtpInputs setOtp={setOtp}   error={error} />

         <Text style={{color: colors.text, fontSize: 16, textAlign: 'center', marginTop: 16}}>
           {canResend ? 'You can resend the code now' : `Resend code in ${formattedCountdown}`}
         </Text>

 <View style={styles.footer}>

         {/* <Text style={{color: colors.text, fontSize: 16, textAlign: 'center'}}>
           Didn't receive code :
           <Text
             style={{
               color: colors.primary,
               marginLeft: 5,
               fontWeight: 'bold',
               fontSize: 16,
               opacity: canResend ? 1 : 0.1,
             }}
             onPress={canResend ? handleResendOtp : undefined}
           > Resend</Text>
         </Text> */}
        </View>
        <View style={styles.form}>
       

           <ButtonComp
            title=" Verify & Continue"
            onPress={VerifyOtp}
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
    )
}

export default Otp

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
    bottomContainer: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        height: "50%",
        width: "100%",
        backgroundColor: "#202020",
        borderTopEndRadius: 25,
        borderTopStartRadius: 25,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    otpWrapper: {
        paddingHorizontal: 12,
        paddingVertical: 16
    },
    otpPinCodeContainer: {
        backgroundColor: "#fff",
        height: 70,
        width: 70
    },
    pinCodeText: {
        color: "#FA4A0C",
        fontWeight: "400",
        fontSize: 40,
        lineHeight: 45.12,
        letterSpacing: 0.05,

    },
    optionWrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingLeft: "7%",
        paddingVertical: "2%",
        marginBottom: "1%"
    },
        otpWrapper: {
        paddingHorizontal: 12,
        paddingVertical: 24,
    },
    otpPinCodeContainer: {
        backgroundColor: '#fff',
        height: 60,
        width: 60,
    },
    pinCodeText: {
        color: colors.text,
        fontWeight: '700',
        fontSize: 32,
        lineHeight: 45.12,
        letterSpacing: 0.05,
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
})








const OtpInputs = ({ setOtp,error }) => {
    return (
        <View style={styles.otpWrapper}>
            <OtpInput
                focusColor={colors.primary}
                theme={{
                    pinCodeContainerStyle: styles.otpPinCodeContainer,
                    pinCodeTextStyle: styles.pinCodeText,
                }}
                numberOfDigits={4}
                onTextChange={text => setOtp(text)}
            />
             {error ? (
                <Text style={{
                    color: "#ff5555",
                    fontFamily: "OpenSans-Regular",
                    fontSize: 12,
                    marginTop: 5,
                }}>{error}</Text>
            ) : null}
        </View>
    );
};


