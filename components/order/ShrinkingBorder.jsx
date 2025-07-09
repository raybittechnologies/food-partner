import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const Countdown = ({onComplete}) => (
  <View style={styles.container}>
    <CountdownCircleTimer
      isPlaying
      duration={60}
      size={200}
      strokeWidth={8}
      colors={['#00FFD1', '#FA4A0C', '#FF0066', '#5500FF']}
      colorsTime={[60, 40, 20, 0]}
      trailColor="#2e2e2e"
      isLinearGradient
      onComplete={onComplete}
    >
      {({ remainingTime }) => (
        <Text
    accessibilityRole="timer"
    accessibilityLiveRegion="assertive"
    importantForAccessibility="yes"
  
    style={styles.timerText}
  >
    {remainingTime} sec
  </Text>
      )}
    </CountdownCircleTimer>
  </View>
);

export default Countdown;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 30,
    elevation: 8,
    shadowColor: '#FA4A0C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  timerText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold',
  },
});
