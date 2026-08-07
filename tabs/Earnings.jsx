import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'


import ButtonComp from '../components/common/ButtonComp'
import { colors } from '../constants/colors'
import EarningsCard from '../components/earnings/EarningsCard'
import RecentWithdrawals from '../components/earnings/EarningsOverview'
import EarningsGraph from '../components/earnings/EarningsGraph'

const Earnings = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
          height={58}
          mt={10}
          onPress={() => { }}
        />
      </ScrollView>
    </View>
  )
}

export default Earnings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20
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