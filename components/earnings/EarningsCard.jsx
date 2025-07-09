import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const EarningsCard = () => {
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

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <TouchableOpacity onPress={handlePrev}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View>
          <Text style={styles.date}>{formatDateRange(startDate)}</Text>
          {/* <Text style={styles.week}>This week</Text> */}
        </View>

        <TouchableOpacity onPress={handleNext}>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.earningsSection}>
        <Text style={styles.subHeading}>Total earnings</Text>
        <Text style={styles.amount}>Rs 580</Text>
        <Text style={styles.time}>30m on duty</Text>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
          style={styles.avatar}
        />
      </View>
    </View>
  )
}

export default EarningsCard

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  week: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  earningsSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  subHeading: {
    color: '#888',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'absolute',
    right: 10,
  },
})
