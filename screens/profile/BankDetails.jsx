import { Platform, StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState } from 'react';
import Buttoncomp from '../../components/common/ButtonComp';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import DynamicModal from '../../components/common/DynamicModal'
const BankInfo = () => {
  const navigation=useNavigation()
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
       <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name='arrowleft' size={28} color='#000' />
              </TouchableOpacity>
              <Text style={styles.title}>Bank Info</Text>
            </View>

      {/* Account Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Account Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          placeholder="Enter account number"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={accountNumber}
          onChangeText={setAccountNumber}
          keyboardType="number-pad"
        />
        <View style={styles.underline} />
      </View>

      {/* Bank Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Bank Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          placeholder="Enter bank name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={bankName}
          onChangeText={setBankName}
        />
        <View style={styles.underline} />
      </View>

      {/* Bank Code */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Bank Code <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          placeholder="Enter bank code"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={bankCode}
          onChangeText={setBankCode}
        />
        <View style={styles.underline} />
      </View>

      {/* Account Holder Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Account Holder Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          placeholder="Enter account holder name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={accountHolder}
          onChangeText={setAccountHolder}
        />
        <View style={styles.underline} />
      </View>
      <Buttoncomp title={'Save Bank Info'} backgroundColor='#FA4A0C' onPress={()=>setModalVisible(true)}/>
      <DynamicModal
        visible={modalVisible}
        onClose={()=>setModalVisible(false)}
        title={'Bank Info Saved'}
        message={'Your bank info has been saved successfully'}
      />

    </ScrollView>
  );
};

export default BankInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  required: {
    color: 'red',
  },
  input: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  underline: {
    height: 1.5,
    backgroundColor: '#ccc',
  },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
   title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    fontFamily:'OpenSans-Bold'
  },
});
