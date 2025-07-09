import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const EarningsOverview = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Earnings Overview</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Orders Completed</Text>
        <Text style={styles.value}>121</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Recent Withdrawal</Text>
        <Text style={styles.value}>220.00</Text>
      </View>
    </View>
  )
}

export default EarningsOverview

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
  },
  heading: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#555',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  label: {
    color: '#ccc',
  },
  value: {
    color: '#fff',
    fontWeight: '600',
  },
})
