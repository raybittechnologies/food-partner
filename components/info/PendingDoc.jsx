// components/info/PendingDoc.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDocMeta } from './Docmeta';


const GREEN_DARK = '#4F7A63';

const PendingDoc = ({ title, href }) => {
  const navigation = useNavigation();
  const { icon, subtitle } = getDocMeta(title);


  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate(href)}
      style={styles.card}
    >
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {<Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );
};

export default PendingDoc;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    minHeight: 64,
    marginVertical: 6,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 15,
    color: '#1A1A1A',
  },
  subtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12.5,
    color: '#8E8E93',
    marginTop: 2,
  },
});