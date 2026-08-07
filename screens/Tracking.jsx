import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MapComponent from '../components/map/MapComponent'
import { useNavigation } from '@react-navigation/native'
import Entypo from 'react-native-vector-icons/Entypo'

const Tracking = () => {
    const navigation = useNavigation()
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Entypo name="chevron-left" size={20} color="black" />
        </TouchableOpacity>
      <MapComponent />
    </View>
  )
}

export default Tracking

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn:{
    position: 'absolute',
    top: 40,
    left: 40,
    zIndex: 1000,
    width:40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation:5,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
  }
})