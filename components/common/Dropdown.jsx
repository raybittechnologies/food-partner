import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet
} from 'react-native';

const DynamicDropdown = ({ label, selectedValue, onValueChange, options = [] }) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (item) => {
    onValueChange(item.value);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: selectedValue ? '#000' : '#888' }}>
          {options.find(o => o.value === selectedValue)?.label || 'Select'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DynamicDropdown;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: '#202020',
    marginBottom: 5,
    fontFamily: 'OpenSans-Regular',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    // elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    marginHorizontal: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    maxHeight: 300,
  },
  option: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
});
