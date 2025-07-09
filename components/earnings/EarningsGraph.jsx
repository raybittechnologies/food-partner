import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

const ChartComponent = () => {
  const data = [
    { value: 100 },
    { value: 100 },
    { value: 80 },
    { value: 200 },
    { value: 180 },
    { value: 250 },
    { value: 170 },
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const chartWidth = width - 80;
  const totalPoints = data.length;
  const initialSpacing = 0;
  const spacing = chartWidth / (totalPoints - 1); // space between points

  return (
    <View style={styles.container}>
      <LineChart
        areaChart
        curved
        data={data}
        height={220}
        width={chartWidth}
        initialSpacing={initialSpacing}
        spacing={spacing}
        hideDataPoints
        color="#ff4c4c"
        thickness={2}
        startFillColor="#ff4c4c"
        endFillColor="#ff4c4c"
        startOpacity={0.25}
        endOpacity={0.02}
        animated
        animateOnDataChange
        yAxisColor="#aaa"
        xAxisColor="#aaa"
        noOfSections={4}
        yAxisTextStyle={{ color: '#aaa' }}
        rulesColor="transparent"
        xAxisLabelTexts={daysOfWeek}
        xAxisLabelTextStyle={{ color: '#aaa', fontWeight: '600' }}
      />
    </View>
  );
};

export default ChartComponent;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
});
