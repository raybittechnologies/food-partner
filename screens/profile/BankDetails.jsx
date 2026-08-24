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

// TODO: replace with your real base URL (e.g. from an env/config file)
const BASE_URL = 'https://your-api-domain.com/api';

const BankInfo = () => {
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
      accountNumber,
      bankName,
      bankCode,
      accountHolder,
    };

    try {
      setLoading(true);

      // If auth is required, pull the token from wherever you store it
      // (AsyncStorage, redux, context, etc.) and add it to the headers below.
      // const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${BASE_URL}/bank-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update bank info');
      }

      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
          {loading ? (
            <View style={[styles.button, styles.buttonDisabled]}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
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
          )}
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