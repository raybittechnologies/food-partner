import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'

import { colors } from '../../constants/colors'
import { BarChart } from 'react-native-chart-kit'

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

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
      },
    ],
  }

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: () => colors.primary,
    labelColor: () => '#8A8A8A',
    fillShadowGradient: colors.primary,
    fillShadowGradientOpacity: 1,
    barPercentage: 0.6,
    propsForBackgroundLines: {
      stroke: 'transparent',
    },
    propsForLabels: {
      fontFamily: 'OpenSans-Regular',
      fontSize: 12,
    },
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Earnings Overview</Text>
      <View style={styles.chartWrap}>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={160}
          yAxisLabel="₹"
          yAxisSuffix=""
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
          withInnerLines={false}
          withHorizontalLabels={false}
          withVerticalLabels
          style={styles.chart}
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
    marginLeft: -20,
    alignItems: 'center',

  },
  chart: {
    borderRadius: 16,
  },
})