import { Alert, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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

function getStartOfWeek(date) {
  const day = date.getDay() || 7 // Sunday=0 => 7
  const start = new Date(date)
  start.setDate(date.getDate() - day + 1)
  start.setHours(0, 0, 0, 0)
  return start
}

function getEndOfWeek(start) {
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

function toApiDateString(date) {
  // YYYY-MM-DD
  return date.toISOString().split('T')[0]
}

const Earnings = () => {
  const insets = useSafeAreaInsets()
  const {token} = useSelector((state) => state.auth)
  const navigation = useNavigation()
  const [loading,setLoading] = useState(false)
  const [data, setData] = useState()
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [startDate, setStartDate] = useState(getStartOfWeek(new Date()))

  const endDate = getEndOfWeek(startDate)

  const handlePrevWeek = () => {
    const newDate = new Date(startDate)
    newDate.setDate(startDate.getDate() - 7)
    setStartDate(getStartOfWeek(newDate))
  }

  const handleNextWeek = () => {
    const newDate = new Date(startDate)
    newDate.setDate(startDate.getDate() + 7)
    setStartDate(getStartOfWeek(newDate))
  }

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

  const handleEarnings = async() => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URI}/api/deliveryBoy/earningStats`,{
        params: {
          startDate: toApiDateString(startDate),
          endDate: toApiDateString(endDate),
        },
        headers: {
          'Authorization':  `Bearer ${token} `
        }
      })
      console.log(res.data.data)
      setData(res.data.data)
    } catch (error) {
      console.log(error)
    }finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleEarnings()
  },[startDate]) // ✅ refetch whenever the week changes

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
        <EarningsCard
          totalEarnings={data?.total_earnings}
          ordersCompleted={data?.orders_completed}
          startDate={startDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
        <EarningsGraph graphData={data?.earnings_overview}/>
        <RecentWithdrawals withdrawals={data?.recent_withdrawals}/>

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
        availableBalance={data?.total_earnings}
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