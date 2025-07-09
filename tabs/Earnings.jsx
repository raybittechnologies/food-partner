import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import EarningsCard from '../components/earnings/EarningsCard'
import EarningsOverview from '../components/earnings/EarningsOverview'
import EarningsGraph from '../components/earnings/EarningsGraph'
import Buttoncomp from '../components/common/ButtonComp'

const Earnings = () => {
  return (
   <ScrollView style={styles.container}>
        <Text style={styles.heading}>Earnings</Text>
        <EarningsCard />
         <EarningsGraph />
        <EarningsOverview />
          <Buttoncomp
        title="Withdraw Money"
        width={250}
        height={60}
        backgroundColor="#28a745"
        textColor="#fff"
        borderRadius={12}
        onPress={() => Alert.alert('Button pressed!')}
      />
      </ScrollView>
  )
}

export default Earnings
const styles = StyleSheet.create({
  container:{
    flex:1,
     backgroundColor:'#202020',
     paddingHorizontal:20,
     paddingTop:Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  heading:{fontSize:24,fontWeight:'bold',color:'#fff',marginBottom:20},
  earnings:{borderRadius:10,padding:20,width:'100%',height:200,borderWidth:1,borderColor:'#fff',marginBottom:20},
})
