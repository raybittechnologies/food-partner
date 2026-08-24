import { useCallback, useState } from 'react'
import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Profile from '../components/account/Profile'
import { useDispatch, useSelector } from 'react-redux'
import apiService from '../services/ApiService'
import { colors } from '../constants/colors'


const Account = () => {
    const { token } = useSelector((state) => state.auth)
    const [deliveryBoy, setDeliveryBoy] = useState(null)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const getProfile = async () => {
        try {
            setLoading(true)
            const res = await apiService('/api/deliveryBoy/getme', 'GET', null, {
                Authorization: `Bearer ${token}`,
            })

            if (res.error) {
                console.log('Error fetching profile:', res.error)
                return
            }

            setDeliveryBoy(res.data.data)
        } catch (error) {
            console.log('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getProfile()
        }, [])
    )

    return (
        <ScrollView style={styles.container}>
            <Profile  user={deliveryBoy}/>
        </ScrollView>
    )
}

export default Account

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        // paddingHorizontal: 16,
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight  : 50,
    }
})