import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from '@react-navigation/native'
import { colors } from '../../../../constants/colors'

const BottomNav = ({description,title,link}) => {
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "1%",
            marginLeft: 52,
            marginTop: 20
        }}>
            <Text style={{
                color: colors.text,
                fontSize: 16,
                lineHeight: 21.79,
                letterSpacing: 0.05,
                fontFamily: "OpenSans-Regular"
            }}>{description} {" "}</Text>
            <Link style={{
                color: colors.primary,
                fontFamily: "OpenSans-Bold",
                fontSize: 16,
                lineHeight: 21.79,
                letterSpacing: 0.05,
            }} to={link}>{title}</Link>
        </View>
    )
}

export default BottomNav

