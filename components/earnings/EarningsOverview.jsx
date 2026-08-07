import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

const DEFAULT_WITHDRAWALS = [
  { amount: 2500, date: '14 Dec, 2024', time: '04:30 PM', status: 'Completed' },
  { amount: 1200, date: '11 Dec, 2024', time: '11:15 AM', status: 'Completed' },
  { amount: 550, date: '08 Dec, 2024', time: '09:00 AM', status: 'Pending' },
]

const RecentWithdrawals = ({ withdrawals = DEFAULT_WITHDRAWALS }) => {
  const formatCurrency = (amount) =>
    amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Recent Withdrawals</Text>

      {withdrawals.map((item, index) => (
        <View
          key={`${item.date}-${index}`}
          style={[
            styles.row,
            index === withdrawals.length - 1 && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
          ]}
        >
          <View>
            <Text style={styles.amount}>₹{formatCurrency(item.amount)}</Text>
            <Text style={styles.dateTime}>
              {item.date} • {item.time}
            </Text>
          </View>

          <View
            style={[
              styles.pill,
              item.status === 'Completed' ? styles.pillCompleted : styles.pillPending,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                item.status === 'Completed' ? styles.pillTextCompleted : styles.pillTextPending,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

export default RecentWithdrawals

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 14,
    marginBottom: 14,
  },
  amount: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
  },
  dateTime: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#8A8A8A',
    marginTop: 3,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pillCompleted: {
    backgroundColor: '#DCF3E3',
  },
  pillPending: {
    backgroundColor: colors.primary + '1F',
  },
  pillText: {
    fontSize: 11,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
  },
  pillTextCompleted: {
    color: '#2E9E56',
  },
  pillTextPending: {
    color: colors.primary,
  },
})