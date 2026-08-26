import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'

import { colors } from '../../constants/colors'
import { BarChart } from 'react-native-chart-kit'

const { width } = Dimensions.get('window')

const EarningsGraph = ({
graphData,
}) => {
  const chartWidth = width
  const hasData = Array.isArray(graphData) && graphData.length > 0

  const chartData = {
    labels: hasData ? graphData.map((d) => d.day) : [],
    datasets: [
      {
        data: hasData ? graphData.map((d) => d.value) : [0],
      },
    ],
  }

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
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
      fontSize: 10,
    },
  }

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Earnings Overview</Text>
      <View style={styles.chartWrap}>
        {hasData ? (
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
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No earnings data for this week</Text>
          </View>
        )}
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
    marginLeft: -60,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  emptyState: {
    height: 160,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: '#8A8A8A',
  },
})