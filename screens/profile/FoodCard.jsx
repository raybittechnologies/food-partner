import { Dimensions, Image, Platform, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
const {width,height}= Dimensions.get('window')
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
const FoodCard = () => {
    const navigation = useNavigation()
  return (
    <View style={styles.container}>
 <Image  source={require('../../assets/images/background.png')} style={{alignSelf:'center',width:width,height:height*0.4}}/>
  <View style={{flexDirection: 'row', alignItems: 'center',position:'absolute',paddingHorizontal:20,paddingTop:Platform.OS==='ios'? 50 :StatusBar.currentHeight }}> 
        <TouchableOpacity onPress={()=>navigation.goBack()}>
         <AntDesign name='arrowleft' size={30} color='#fff' />
         </TouchableOpacity>
         <Text style={styles.header}>Food identity card</Text>
       </View>
       <View style={styles.cardContainer}>
       <FoodId/>
       <Text style={{fontFamily:'Opensans-SemiBold',fontSize:12,color:'#fff',paddingHorizontal:20,textAlign:'center'}}>Valid only for food & grocery distribution</Text>
       </View>
       
    </View>
  )
}

export default FoodCard



function FoodId() {
    return(
    <View style={{paddingTop:40,backgroundColor:'#fff',marginBottom:20,borderTopLeftRadius:10,borderTopRightRadius:10,paddingBottom:10}}>
       <View style={{alignSelf:'center',alignItems:'center'}}>
        <Image source={{uri:'https://img.favpng.com/17/24/10/computer-icons-user-profile-male-avatar-png-favpng-jhVtWQQbMdbcNCahLZztCF5wk.jpg'}} style={styles.image}/>
        <Text style={{fontFamily:'OpenSans-Bold',fontSize:20,color:'#000',textAlign:'center',marginTop:10}}>Owais Parvez</Text>
        <Text style={{fontFamily:'OpenSans-Regular',fontSize:15,color:'#A09E9E',textAlign:'center'}}>Courier I’D: 12534</Text>
       </View>
       <View style={styles.infoContainer}>
  <View style={styles.row}>
    <Text style={styles.label}>Number :</Text>
    <Text style={styles.value}>23456789</Text>
  </View>
  <View style={styles.row}>
    <Text style={styles.label}>Address :</Text>
    <Text style={styles.value}>jygfukyfyul</Text>
  </View>
  <View style={styles.row}>
    <Text style={styles.label}>Photo ID :</Text>
    <Text style={styles.value}>45678</Text>
  </View>
    <View style={styles.row}>
    <Text style={styles.label}>Blood Group :</Text>
    <Text style={styles.value}>B+</Text>
  </View>
</View>
        
    </View>
    )
}

const styles = StyleSheet.create({
 header: {
        fontSize: 20,
        fontFamily: 'OpenSans-Medium',
        color: '#fff',
        marginLeft: 10,
        letterSpacing: 1.5,
    },
    cardContainer: {
      width:width*0.8,
      height:height*0.5,
      backgroundColor:'#FA4A0C',
      borderRadius: 10,
      position:'absolute',
      alignSelf:'center',
      top:height*0.2,
      elevation:5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
    },
    image:{
      width:width*0.2,
      height:height*0.1,
      borderRadius:100,
      
      
    },
    infoContainer: {
  marginTop: 20,
  paddingHorizontal: 40,
},
row: {
  flexDirection: 'row',
  marginBottom: 10,
  gap:50
},
label: {
fontSize:16,
  fontFamily:'OpenSans-Bold',
  color: '#333',
  marginBottom:10
 
},
value: {
  color: '#555',
  
},


})