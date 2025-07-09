// components/docs/PendingDoc.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const PendingDoc = ({ title, href }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(href)}
      style={{
        backgroundColor: '#fff',
        padding: 10,
        borderColor: '#D6D6D6',
        borderWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        minHeight: 50,
        marginVertical: 5,
      }}
    >
      <View>
        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 15 }}>{title}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <EvilIcons name="chevron-right" size={25} color="#000000" />
      </View>
    </TouchableOpacity>
  );
};

export default PendingDoc;
