import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';

// TODO: replace with your real base URL (e.g. from an env/config file)
const BASE_URL = 'https://your-api-domain.com/api';

const initialContacts = [
  { id: '1', name: 'Rashid Ali', phone: '+91 9876543210' },
  { id: '2', name: 'Sana Mir', phone: '+91 8765432109' },
  { id: '3', name: 'Tariq Mahmood', phone: '+91 7654321098' },
];

const Emergency = ({ navigation }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setPhone('');
  };

  const handleAddNew = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setPhone(item.phone);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    Alert.alert('Remove Contact', 'Are you sure you want to remove this contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setContacts((prev) => prev.filter((c) => c.id !== id)),
      },
    ]);
  };

  const handleSaveContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Please enter both name and phone number.');
      return;
    }

    if (editingId) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, name, phone } : c))
      );
    } else {
      setContacts((prev) => [...prev, { id: Date.now().toString(), name, phone }]);
    }
    resetForm();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // If auth is required, pull the token from wherever you store it
      // (AsyncStorage, redux, context, etc.) and add it to the headers below.
      // const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${BASE_URL}/emergency-contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contacts }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update emergency contacts');
      }

      Alert.alert('Success', 'Emergency contacts updated successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Contact List */}
        {contacts.map((item) => (
          <View key={item.id} style={styles.contactCard}>
            <View>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
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
                onPress={() => handleDelete(item.id)}
              >
                <MaterialIcons name="delete-outline" size={20} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add / Edit Form */}
        {showForm && (
          <View style={styles.formCard}>
            <TextInput
              placeholder="Contact name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              style={styles.formInput}
            />
            <TextInput
              placeholder="Phone number"
              placeholderTextColor="#aaa"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.formInput}
            />
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.formCancelBtn} onPress={resetForm}>
                <Text style={styles.formCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.formSaveBtn} onPress={handleSaveContact}>
                <Text style={styles.formSaveText}>{editingId ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Add New Contact */}
        {!showForm && (
          <TouchableOpacity style={styles.addNewBtn} onPress={handleAddNew}>
            <AntDesign name="plus" size={16} color="#F2C037" />
            <Text style={styles.addNewText}>Add New Contact</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.updateBtn, loading && { opacity: 0.7 }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.updateText}>Update</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Emergency;

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
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#F2C037',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 14,
  },
  addNewText: {
    color: '#D9A61C',
    fontWeight: '700',
    fontSize: 15,
  },
  formCard: {
    borderWidth: 1,
    borderColor: '#E7E7DE',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  formInput: {
    fontSize: 15,
    color: '#000',
    borderWidth: 1,
    borderColor: '#D9DCC9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  formCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  formSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#F2C037',
    borderRadius: 10,
  },
  formCancelText: {
    color: '#333',
    fontWeight: '500',
  },
  formSaveText: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  updateText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});