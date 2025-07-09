// SubmitOrderModal.js
import React, { useEffect, useRef } from 'react';
import {
  Modal,
  Animated,
  Easing,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  View
} from 'react-native';

const { height } = Dimensions.get('window');

const SubmitOrderModal = ({ visible, onArrive, onSubmit ,onClose}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : height,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.title}>Are you sure you want to submit the order?</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
              <Text style={styles.buttonText}>Deliver</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onArrive} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Arrived</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  submitButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#FA4A0C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
});
