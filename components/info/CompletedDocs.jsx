// components/docs/CompletedDoc.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const CompletedDoc = ({ title, href }) => {
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
        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#60B246' }}>
          {title}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <MaterialIcons name="done" size={25} color="#60B246" />
      </View>
    </TouchableOpacity>
  );
};

export default CompletedDoc;
