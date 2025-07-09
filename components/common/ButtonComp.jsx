import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Buttoncomp = ({
  title,
  onPress,
  width = 200,
  height = 50,
  backgroundColor = '#007bff',
  textColor = '#fff',
  borderRadius = 8,
  style,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.button,
        {
          width,
          height,
          backgroundColor: disabled ? '#ccc' : backgroundColor,
          borderRadius,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Buttoncomp;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
    // elevation for Android
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
