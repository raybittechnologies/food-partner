import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'

const Header = ({title,subtitle,showicon=false,fd='row'}) => {
    const navigation = useNavigation()
    return (
        <View style={{ width: "100%", backgroundColor: "#202020", elevation: 5, borderBottomStartRadius: 25, borderBottomEndRadius: 25, padding: "7%" ,  paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10, 
            alignItems: "center", justifyContent: "space-between", flexDirection: fd, gap: 10, paddingHorizontal: "5%"
}}>
    {showicon && (  <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" color="#fff" size={20} />
          </TouchableOpacity>)}
            <View>
                <Text style={{ color: "white", fontSize: 18, fontFamily: "OpenSans-Bold", textAlign: "center" }}>{title}</Text>
            </View>
            <View style={{ marginTop: "7%", maxWidth: "80%", marginHorizontal: "auto" }}>
                <Text style={{ color: "white", fontSize: 12, fontFamily: "OpenSans-Regular", textAlign: "center" }}>{subtitle}</Text>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({})