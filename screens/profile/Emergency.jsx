import { Platform, StyleSheet, Text, TouchableOpacity, View, TextInput, Dimensions, StatusBar } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Buttoncomp from '../../components/common/ButtonComp';
const {width,height}=Dimensions.get('window')
const Emergency = ({ navigation }) => {
  const [contact, setContact] = useState('');
  const [showActions, setShowActions] = useState(false);

  const handleEdit = () => {
    setShowActions(true);
  };

  const handleCancel = () => {
    setShowActions(false);
  };

  const handleUpdate = () => {
    // Add your update logic here
    setShowActions(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name='arrowleft' size={28} color='#000' />
        </TouchableOpacity>
        <Text style={styles.title}>Emergency Contact</Text>
      </View>

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add emergency contact"
          placeholderTextColor="#aaa"
          value={contact}
          onChangeText={setContact}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TouchableOpacity onPress={handleEdit}>
          <Feather name="edit" size={20} color="#FA4A0C" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <MaterialIcons name="delete-outline" size={22} color="#FA4A0C" />
        </TouchableOpacity>
      </View>
      <View style={styles.underline} />

      {/* Action Buttons */}
      {showActions && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{marginTop:height*0.65}}>
      <Buttoncomp title={'Add Contact'} backgroundColor='#FA4A0C'/>
      </View>
    </View>
  );
};

export default Emergency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight  : 50,
    paddingHorizontal: 16,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingBottom: 8,
    paddingVertical: 20,
  },
  underline: {
    height: 1.5,
    backgroundColor: '#ccc',
    marginTop: -1,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  updateBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FA4A0C',
    borderRadius: 8,
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
  },
  updateText: {
    color: '#fff',
    fontWeight: '500',
  },
});
