import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Animated,
  Easing,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  Keyboard
} from 'react-native';

const { height } = Dimensions.get('window');
const OTP_LENGTH = 6; // change to 6 if your OTP is 6 digits

const SubmitOrderModal = ({ visible, hasArrived, onArrive, onSubmit, onClose }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [otp, setOtp] = useState('')

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : height,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // clear the OTP field whenever the modal closes or the stage resets
  useEffect(() => {
    if (!visible) {
      setOtp('')
      Keyboard.dismiss()
    }
  }, [visible]);

  const handleSubmitPress = () => {
    
    onSubmit(otp) // pass the entered otp up to Tracking's handleSubmit
  }

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <Animated.View
            style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
          >
            <Text style={styles.title}>
              {hasArrived
                ? 'Enter the OTP to complete delivery'
                : 'Have you arrived at the restaurant?'}
            </Text>

            {hasArrived && (
              <TextInput
                style={styles.otpInput}
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                placeholder="Enter OTP"
                placeholderTextColor="#999"
                textAlign="center"
                autoFocus
              />
            )}

            <View style={styles.buttonRow}>
              {!hasArrived ? (
                <TouchableOpacity onPress={onArrive} style={styles.submitButton}>
                  <Text style={styles.buttonText}>Arrived</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleSubmitPress}
                  style={[
                    styles.submitButton,
                    otp.length !== OTP_LENGTH && styles.submitButtonDisabled
                  ]}
                  disabled={otp.length !== OTP_LENGTH}
                >
                  <Text style={styles.buttonText}>Deliver</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default SubmitOrderModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    fontSize: 20,
    letterSpacing: 8,
    marginBottom: 20,
    fontFamily: 'OpenSans-SemiBold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
});