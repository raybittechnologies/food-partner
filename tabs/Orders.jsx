import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import EarningsCard from '../components/earnings/EarningsCard'
import EarningsOverview from '../components/earnings/EarningsOverview'
import Header from '../components/common/Header'

const Orders = () => {
  const data=[
    {
      id:1,
      name:'Item Delivered',
      status:'Food will be delivered in 30 minutes',
    },
    {
      id:2,
      name:'Location',
      status:'srinagar, Jammu and Kashmir',
    },
    {
      id:3,
      name:'Earnings',
      status:'500 INR',
    },{
      id:4,
      name:'Status',
      status:'Delivered 5th of june 2023',
    }
  ]
  return (
    <View style={styles.container}>
  <Header title={'My Orders'} showicon={true}/>
  <View style={{flex:1,backgroundColor:'white',paddingHorizontal:20,paddingTop:50,}}><MyOrders data={data}/></View>
      
    </View>
  )
}

export default Orders


function MyOrders({ data }) {
  return (
    <View style={styles.orders}>
  {data.map((item) => (
    <View key={item.id} style={styles.orderRow}>
      <Text style={styles.label}>{item.name}:</Text>
      <Text style={styles.value}> {item.status}</Text>
    </View>
  ))}
</View>
  );
}





const styles = StyleSheet.create({
  container:{
    flex:1,
     
   
  },
  heading:{fontSize:24,fontWeight:'bold',color:'#fff',marginBottom:20},
  earnings:{borderRadius:10,padding:20,width:'100%',height:200,borderWidth:1,borderColor:'#fff',marginBottom:20},
 orders: {
  padding: 10,
  width: '100%',
  borderWidth: 1,
  borderColor: '#D6D6D6',
  borderRadius: 10,
 
  marginBottom: 20,
},
orderRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 8,
},
label: {
  fontWeight: 'bold',
  color: 'black',
},
value: {
  flex: 1,
  color: 'black',
},
})