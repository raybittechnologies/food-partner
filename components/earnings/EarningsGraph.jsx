import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'

import { colors } from '../../constants/colors'
import { BarChart } from 'react-native-gifted-charts'

const { width } = Dimensions.get('window')

const EarningsGraph = ({
  data = [
    { label: 'M', value: 550 },
    { label: 'T', value: 820 },
    { label: 'W', value: 400 },
    { label: 'T', value: 950 },
    { label: 'F', value: 1200 },
    { label: 'S', value: 330 },
    { label: 'S', value: 0 },
  ],
}) => {
  const chartWidth = width - 80

  const barData = data.map((d) => ({
    value: d.value,
    label: d.label,
    topLabelComponent: () =>
      d.value > 0 ? (
        <Text style={styles.barTopLabel}>₹{d.value}</Text>
      ) : null,
    frontColor: colors.primary,
  }))

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Earnings Overview</Text>
      <View style={styles.chartWrap}>
        <BarChart
          data={barData}
          width={chartWidth}
          height={160}
          barWidth={22}
          spacing={18}
          initialSpacing={12}
          barBorderRadius={5}
          hideRules
          xAxisThickness={1}
          xAxisColor="#E5E5E5"
          yAxisThickness={0}
          hideYAxisText
          noOfSections={4}
          xAxisLabelTextStyle={styles.xAxisLabel}
          disablePress
        />
      </View>
    </View>
  )
}

export default EarningsGraph

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  heading: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  chartWrap: {
    marginLeft: -8,
  },
  barTopLabel: {
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    color: '#555',
    marginBottom: 2,
  },
  xAxisLabel: {
    color: '#8A8A8A',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
  },
})