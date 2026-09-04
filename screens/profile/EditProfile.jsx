import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { colors } from '../../constants/colors';
import { BASE_URI } from '../../config/url';
import useImagePicker from '../../components/hooks/useImagePicker';


// TODO: swap in your image-picker lib of choice
// (expo-image-picker or react-native-image-picker) inside handlePickImage.

const VEHICLE_TYPES = ['bike', 'Scooter', 'Bicycle', 'Car'];

const EditProfile = ({ navigation, route }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = route.params || {};

  console.log(user);

  const [avatar, setAvatar] = useState(user?.profile_pic || null);
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [mobile, setMobile] = useState(user?.phone_no || '');
  const [vehicleNumber, setVehicleNumber] = useState(user?.vehicle_no|| '');
  const [registrationNumber, setRegistrationNumber] = useState(
    user?.registration_no || ''
  );
  const [vehicleType, setVehicleType] = useState(user?.vehicle_type || 'Motorcycle');
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const pickImage = useImagePicker();

  const handlePickImage = () => {
    pickImage((uri) => {
      setAvatar(uri);
      setAvatarChanged(true);
    });
  };

  const handleSave = async () => {
    // if (!.trim() || !mobile.trim()) {
    //   Alert.alert('Missing info', 'Full name and mobile number are required.');
    //   return;
    // }

    try {
      setSaving(true);

      // avatarChanged is true only when the user just picked a new local image
      // via react-native-image-picker — that's what needs uploading as multipart.
      // If it's false, the avatar is unchanged (already on the server), so skip it.
      const isNewLocalImage = avatarChanged && avatar;

      let res;
      if (isNewLocalImage) {
        const formData = new FormData();
        formData.append('first_name', firstName.trim());
        formData.append('last_name', lastName.trim());
        formData.append('phone_no', mobile.trim());
        formData.append('vehicle_no', vehicleNumber.trim());
        formData.append('registration_no', registrationNumber.trim());
        formData.append('vehicle_type', vehicleType);
        formData.append('profile_pic', {
          uri: avatar,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        });

        res = await axios.patch(`${BASE_URI}/api/deliveryBoy/infoUpdate`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        const payload = {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone_no: mobile.trim(),
          vehicleNumber: vehicleNumber.trim(),
          registration_no: registrationNumber.trim(),
         vehicle_type: vehicleType,
        };

        res = await axios.patch(`${BASE_URI}/api/deliveryBoy/infoUpdate`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      console.log('EditProfile save response:', res);
      if (res.data.status==="success") {
        Alert.alert('Success', 'Profile updated successfully');
        setAvatarChanged(false);
        navigation.goBack();
      }
    } catch (error) {
      console.log('EditProfile save error:', error?.response?.data || error.message);
      Alert.alert('Error', error?.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarRing}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Feather name="user" size={44} color="#bbb" />
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
            <Feather name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John Doe"
            placeholderTextColor="#9BB89B"
            style={styles.input}
          />
<Text style={styles.label}>Last Name</Text>
            <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="John Doe"
            placeholderTextColor="#9BB89B"
            style={styles.input}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            value={mobile}
            onChangeText={setMobile}
            placeholder="+91 9876543210"
            placeholderTextColor="#9BB89B"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text style={styles.label}>Vehicle Number</Text>
          <TextInput
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
            placeholder="KA-01-AB-1234"
            placeholderTextColor="#9BB89B"
            autoCapitalize="characters"
            style={styles.input}
          />

          <Text style={styles.label}>Registration Number</Text>
          <TextInput
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            placeholder="REG-2024-5678"
            placeholderTextColor="#9BB89B"
            autoCapitalize="characters"
            style={styles.input}
          />

          <Text style={styles.label}>Vehicle Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setTypePickerVisible(true)}
          >
            <Text style={styles.dropdownText}>{vehicleType}</Text>
            <Feather name="chevron-down" size={18} color="#333" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, saving && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Vehicle Type Picker */}
      <Modal
        visible={typePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTypePickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setTypePickerVisible(false)}
        >
          <View style={styles.pickerCard}>
            {VEHICLE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.pickerOption}
                onPress={() => {
                  setVehicleType(type);
                  setTypePickerVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    type === vehicleType && styles.pickerOptionTextActive,
                  ]}
                >
                  {type}
                </Text>
                {type === vehicleType && (
                  <Feather name="check" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default EditProfile;

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
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 24,
    width: 110,
    height: 110,
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2.5,
    borderColor: colors.primary,
    padding: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: '#F1F1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  formCard: {
    borderWidth: 1,
    borderColor: '#EDEDE4',
    borderRadius: 18,
    padding: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#E2E5D8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 18,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E5D8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dropdownText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1EC',
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#333',
  },
  pickerOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});