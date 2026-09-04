import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import Buttoncomp from '../../components/common/ButtonComp';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import DynamicModal from '../../components/common/DynamicModal';
import { colors } from '../../constants/colors';
import ButtonComp from '../../components/common/ButtonComp';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BASE_URI } from '../../config/url';
import axios from 'axios';
import { useSelector } from 'react-redux';



const BankInfo = () => {
  const {token} = useSelector((state) => state.auth);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!accountNumber.trim() || !bankName.trim() || !bankCode.trim() || !accountHolder.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleUpdateInfo = async () => {
    if (!validate()) return;

    const payload = {
      account_no: accountNumber,
      bank_name: bankName,
       IFSC_code:bankCode,
      // accountHolder,
    };

     try {
      setLoading(true)
      const res = await axios.patch(`${BASE_URI}/api/deliveryBoy/bankUpdate`,payload,{
        
        headers: {
          'Authorization':  `Bearer ${token} `
        }
      })
       console.log(res.data)
       setModalVisible(true)
    } catch (error) {
      console.log(error)
    }finally {
      setLoading(false)
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Bank Info</Text>
        </View>

        {/* Account Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Account Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="number-pad"
          />
        </View>

        {/* Bank Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Bank Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="State Bank of India, Rajbagh"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={bankName}
            onChangeText={setBankName}
          />
        </View>

        {/* Bank Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Bank Code <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="SBIN0001234"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={bankCode}
            onChangeText={setBankCode}
          />
        </View>

        {/* Account Holder Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Account Holder Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Jaun Dela Cruz"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={accountHolder}
            onChangeText={setAccountHolder}
          />
        </View>

        <View style={styles.buttonWrapper}>
     
            <ButtonComp
              title="Update Info"
              onPress={handleUpdateInfo}
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

        <DynamicModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title={'Bank Info Saved'}
          message={'Your bank info has been saved successfully'}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BankInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'OpenSans-Bold',
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  required: {
    color: '#E74C3C',
  },
  input: {
    fontSize: 15,
    color: '#000',
    borderWidth: 1,
    borderColor: '#D9DCC9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    marginTop: 40,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F2C037',
    opacity: 0.8,
  },
});