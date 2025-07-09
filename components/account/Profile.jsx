import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Services from './Services'

const Profile = () => {
  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center', }}> 
        {/* <AntDesign name='arrowleft' size={30} color='#757575' /> */}
        <Text style={styles.header}>Profile</Text>
      </View>
      <ProfileCard/>
      <Services/>
    </View>
  )
}

export default Profile



function ProfileCard() {
    return (
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, marginTop: 20 }}>
            <View style={{ flexDirection: 'row', }}>
            <Image
                source={{ uri: 'https://img.favpng.com/17/24/10/computer-icons-user-profile-male-avatar-png-favpng-jhVtWQQbMdbcNCahLZztCF5wk.jpg' }}
                style={{ width: 100, height: 100, borderRadius: 50,  }}
            />
            <View style={{marginLeft: 20,}}>
            <Text style={{fontSize: 16, marginTop: 20, fontFamily: 'OpenSans-Medium', color: '#000', letterSpacing: 1.5, }}>User Ratings</Text>
            <AntDesign name='star' size={20} color='#FFD700' />
               
                </View>
            </View>
            <Text style={{ fontSize: 18, marginTop: 10, fontFamily: 'OpenSans-Medium', color: '#000', letterSpacing: 1.5, }}>Owais Parwaiz</Text>
            <Text style={{ fontSize: 14, marginTop: 5, fontFamily: 'OpenSans-Regular', color: '#757575', letterSpacing: 1.5, }}>FOOD I'D : 76856</Text>
            <View style={{ flexDirection:'row',  marginTop: 10,borderTopWidth: 1,borderBottomWidth:1, borderColor: '#E0E0E0', paddingVertical: 30,justifyContent: 'space-between', }}>
                <View style={{  justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontFamily: 'OpenSans-Medium', color: '#000', letterSpacing: 1.5, }}>Mobile Number</Text>
             <Text style={{ fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#000', letterSpacing: 0.5,marginBottom:30 }}>1234567890</Text>
  <Text style={{ fontSize: 16, fontFamily: 'OpenSans-Medium', color: '#000', letterSpacing: 1.5, }}>Mobile Number</Text>
             <Text style={{ fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#000', letterSpacing: 0.5, }}>1234567890</Text>       
</View>
            <View style={{  justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontFamily: 'OpenSans-Medium', color: '#000', letterSpacing: 1.5, }}>Mobile Number</Text>
             <Text style={{ fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#000', letterSpacing: 0.5,marginBottom:30 }}>1234567890</Text>
  <Text style={{ fontSize: 16, fontFamily: 'OpenSans-Medium', color: '#000', letterSpacing: 1.5, }}>Mobile Number</Text>
             <Text style={{ fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#000', letterSpacing: 0.5, }}>1234567890</Text>       
</View>


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontFamily: 'OpenSans-Medium',
        color: '#000',
        marginLeft: 10,
        letterSpacing: 1.5,
    },
})