import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../constants/colors';
import Input from '../signup/Input';
import Feather from 'react-native-vector-icons/Feather';

const RELATIONS = ['Parent', 'Sibling', 'Spouse', 'Friend', 'Relative', 'Other'];

const AddContactModal = ({
  visible,
  onClose,
  onSave,
  initialData,
  phone,
  setPhone,
  name,
  setName,
  relation,
  setRelation,
  saving,
  error
}) => {
  // Reset / prefill fields whenever the modal is opened
  useEffect(() => {
    if (visible) {
      setName(initialData?.name || '');
      setPhone(initialData?.phone || initialData?.phone_no || '');
      setRelation(initialData?.relation || '');
    }
  }, [visible, initialData]);

  const handleSave = () => {
    // console.log('handleSave fired. Current values:', { name, phone, relation });

    // if (!name?.trim() || !phone?.trim() || !relation?.trim()) {
    //   Alert.alert('Missing info', 'Please fill in name, phone, and relation.');
    //   return;
    // }
    onSave({ name: name.trim(), phone: phone.trim(), relation: relation.trim() });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.overlay}
        >
          <View style={styles.card}>
            <Text style={styles.title}>
              {initialData ? 'Edit Contact' : 'Add Emergency Contact'}
            </Text>
    {error && <Text style={styles.error}> {error}</Text>}
    
            <Input
              placeholder="Contact Name"
              value={name}
              onChange={(text) => setName(text)}
            />

            <Input
              placeholder="Mobile Number"
              icon={<Feather name="phone" size={18} color="#8A8A8A" />}
              value={phone}
              onChange={(text) => setPhone(text)}
              type="phone-pad"
              maxLength={10}
            />

            <Input
              placeholder="Relation"
              value={relation}
              onChange={(text) => setRelation(text)}
            />

            {/* Quick-pick chips for common relations */}
            <View style={styles.chipRow}>
              {RELATIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, relation === r && styles.chipActive]}
                  onPress={() => setRelation(r)}
                >
                  <Text style={[styles.chipText, relation === r && styles.chipTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={saving}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveText}>{initialData ? 'Save' : 'Add'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddContactModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#D9DCC9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: '#555',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  saveBtn: {
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  }
});