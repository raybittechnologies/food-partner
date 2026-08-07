import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../../constants/colors'

const EarningsCard = ({ totalEarnings = 4250, onDutyMinutes = 30, ordersCompleted = 28 }) => {
  const [startDate, setStartDate] = useState(getStartOfWeek(new Date()))

  function getStartOfWeek(date) {
    const day = date.getDay() || 7 // Sunday=0 => 7
    const start = new Date(date)
    start.setDate(date.getDate() - day + 1)
    return start
  }

  function formatDateRange(start) {
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    const format = (date) =>
      date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      })

    return `${format(start)} - ${format(end)}`
  }

  const handlePrev = () => {
    const newDate = new Date(startDate)
    newDate.setDate(startDate.getDate() - 7)
    setStartDate(getStartOfWeek(newDate))
  }

  const handleNext = () => {
    const newDate = new Date(startDate)
    newDate.setDate(startDate.getDate() + 7)
    setStartDate(getStartOfWeek(newDate))
  }

  const formatCurrency = (amount) =>
    amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <View>
      <View style={styles.dateRow}>
        <TouchableOpacity onPress={handlePrev} style={styles.dateArrowBtn}>
          <Ionicons name="chevron-back" size={18} color="#333" />
        </TouchableOpacity>

        <View style={styles.dateLabelWrap}>
          <Ionicons name="calendar-outline" size={15} color="#333" style={{ marginRight: 6 }} />
          <Text style={styles.date}>{formatDateRange(startDate)}</Text>
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.dateArrowBtn}>
          <Ionicons name="chevron-forward" size={18} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeading}>Total Earnings</Text>
        <Text style={styles.amount}>₹{formatCurrency(totalEarnings)}</Text>

        <View style={styles.divider} />

        <Text style={styles.dutyLabel}>ON DUTY</Text>
        <Text style={styles.dutyValue}>{onDutyMinutes} min</Text>
      </View>

      <View style={styles.ordersCard}>
        <View style={styles.ordersIconWrap}>
          <Ionicons name="bag-handle-outline" size={18} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.ordersCount}>{ordersCompleted}</Text>
          <Text style={styles.ordersLabel}>Orders Completed</Text>
        </View>
      </View>
    </View>
  )
}

export default EarningsCard

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
  },
  card: {
    borderWidth: 1,
    borderColor: colors.primary + '33',
    backgroundColor: colors.primary + '14',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  subHeading: {
    color: '#6D6D6D',
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    marginBottom: 6,
  },
  amount: {
    fontSize: 26,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
  },
  divider: {
    height: 1,
    backgroundColor: colors.primary + '33',
    marginVertical: 14,
  },
  dutyLabel: {
    color: '#8A8A8A',
    fontFamily: 'OpenSans-Bold',
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dutyValue: {
    color: '#111',
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    fontSize: 15,
  },
  ordersCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  ordersIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersCount: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
  },
  ordersLabel: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: '#6D6D6D',
    marginTop: 2,
  },
})