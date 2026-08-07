import React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const InputField = ({ placeholder, label, value, onChangeText }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            marginTop: '5%',
          }}>
          <Text
            style={{
              color: '#202020',
              fontSize: 16,
              fontFamily: 'OpenSans-Regular',
            }}>
            {label}
          </Text>

          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#000"
            value={value}
            onChangeText={onChangeText}
            style={{
              height: 50,
              borderColor: '#D6D6D6',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 20,
              fontFamily: 'OpenSans-Regular',
              backgroundColor: '#fff',
              color: '#000',
              elevation: 5,
              marginTop: 5,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
