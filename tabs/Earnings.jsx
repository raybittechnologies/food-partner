import { Alert, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'

import ButtonComp from '../components/common/ButtonComp'
import { colors } from '../constants/colors'
import EarningsCard from '../components/earnings/EarningsCard'
import RecentWithdrawals from '../components/earnings/EarningsOverview'
import EarningsGraph from '../components/earnings/EarningsGraph'
import WithdrawModal from '../components/earnings/WithdrawModal'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { BASE_URI } from '../config/url'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Earnings = () => {
  const insets = useSafeAreaInsets()
  const {token} = useSelector((state) => state.auth)
  const navigation = useNavigation()
  const [loading,setLoading] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)

  // TODO: replace with your real balance from state/API
  const availableBalance = 12500

  const handleWithdraw = async(amount) => {
   try {
    setLoading(true)
    const res = await axios.post(`${BASE_URI}/api/deliveryboy/withdraw`,{
     amount: amount
    },{
      headers: {
       'Authorization':  `Bearer ${token} `
      }
    })
    console.log(res.data.data.message)
    Alert.alert(res.data.message)
   } catch (error) {
    console.log(error)
   }finally {
    setLoading(false)
   }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header,{paddingTop:insets.top}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AntDesign name="arrowleft" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.heading}>Earnings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <EarningsCard />
        <EarningsGraph />
        <RecentWithdrawals />

        <ButtonComp
          title="Withdraw Earnings"
          bg={colors.primary}
          color="#fff"
          size={16}
          fw="700"
          ff="OpenSans-Bold"
          ta="center"
          height={48}
          mt={10}
          onPress={() => setWithdrawVisible(true)}
        />
      </ScrollView>

      <WithdrawModal
        visible={withdrawVisible}
        onClose={() => setWithdrawVisible(false)}
        availableBalance={availableBalance}
        onWithdraw={handleWithdraw}
        loading={loading}
      />
    </View>
  )
}

export default Earnings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 32,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
  },
})