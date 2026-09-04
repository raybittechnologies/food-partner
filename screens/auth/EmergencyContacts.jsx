import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import { colors } from '../../constants/colors';
import axios from 'axios';

import { useSelector } from 'react-redux';
import AddContactModal from '../../components/account/AddContactModal';
import { BASE_URI } from '../../config/url';

const EmergencyContacts = ({ navigation }) => {
  const { token } = useSelector((state) => state.auth);
const [error,setError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null); // null = adding new

  const [loading, setLoading] = useState(false); // list fetch spinner
  const [saving, setSaving] = useState(false);   // add/edit spinner (separate from fetch!)

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');

  const handleAddNew = () => {
    setEditingContact(null);
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingContact(item);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert('Remove Contact', 'Are you sure you want to remove this contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URI}/api/deliveryBoy/emergencyContacts/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            GetContacts();
            
          } catch (error) {
            console.log(error?.response?.data.message);
            Alert.alert('Alert', error?.response?.data.message);
          }
        },
      },
    ]);
  };

  // data comes from the modal already trimmed: { name, phone, relation }
  const handleSaveContact = async (data) => {
    if (!data?.name || !data?.phone || !data?.relation) {
      setError('Please fill all fields');
      return;
    }

    const payload = {
      name: data.name,
      phone_no: data.phone,
      relation: data.relation,
    };

    console.log('payload', payload);

    try {
      setSaving(true);

      if (editingContact) {
        // EDIT — update existing contact
        const id = editingContact._id || editingContact.id;
        const res = await axios.patch(
          `${BASE_URI}/api/deliveryBoy/emergencyContacts/${id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.status==="success") {
          setModalVisible(false);
          setEditingContact(null);
          resetFields();
        }
      } else {
        // ADD — create new contact
        const res = await axios.post(
          `${BASE_URI}/api/deliveryBoy/emergencyContacts`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('res', res.data);
        if (res.data.status==='success') {
          setModalVisible(false);
          resetFields();
          navigation.goBack(); // Navigate to work-area after adding a contact
        //   GetContacts(); // refresh list so the new contact actually shows up
        }
      }
    } catch (error) {
         console.log('GetContacts error:', error);
      Alert.alert('Alert',  error?.response?.data.message);
    } finally {
      setSaving(false);
    }
  };

  const resetFields = () => {
    setName('');
    setPhone('');
    setRelation('');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingContact(null);
    resetFields();
  };

//   const GetContacts = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URI}/api/deliveryBoy/emergencyContacts`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log('res', res.data);
//       setContacts(res.data.data || []);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     GetContacts();
//   }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Emergency Details</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Info Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Immediate Assistance Contacts</Text>
          <Text style={styles.bannerText}>
            These trusted contacts will be notified instantly during safety alerts or road
            emergencies.
          </Text>
        </View>

        {loading && contacts.length === 0 ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          contacts?.map((item) => {
            const id = item._id || item.id;
            const phoneValue = item.phone_no
            return (
              <View key={id} style={styles.contactCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactPhone}>{phoneValue}</Text>
                  {!!item.relation && (
                    <Text style={styles.contactRelation}>{item.relation}</Text>
                  )}
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity
                    style={[styles.iconCircle, styles.editCircle]}
                    onPress={() => handleEdit(item)}
                  >
                    <Feather name="edit-2" size={16} color="#B8860B" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconCircle, styles.deleteCircle]}
                    onPress={() => handleDelete(id)}
                  >
                    <MaterialIcons name="delete-outline" size={20} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add / Edit Contact Modal */}
      <AddContactModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveContact}
        initialData={editingContact}
        phone={phone}
        setPhone={setPhone}
        name={name}
        setName={setName}
        relation={relation}
        setRelation={setRelation}
        saving={saving}
        error={error}
      />

      {/* Bottom Actions */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={[styles.updateBtn, { flex: 1 }]}
          onPress={handleAddNew}
        >
          <Text style={styles.updateText}>Add Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmergencyContacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'OpenSans-Bold',
  },
  banner: {
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  bannerTitle: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 6,
  },
  bannerText: {
    color: '#555',
    fontSize: 13,
    lineHeight: 19,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E7DE',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#999',
  },
  contactRelation: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editCircle: {
    backgroundColor: '#FBEFCE',
  },
  deleteCircle: {
    backgroundColor: '#FBDEDD',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  updateBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});