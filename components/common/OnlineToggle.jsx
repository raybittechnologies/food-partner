import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Animated, StyleSheet, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'

const OnlineToggle = ({ onToggle, loading = false }) => {
  const { isOnline } = useSelector((state) => state.auth)
  const anim = useRef(new Animated.Value(isOnline ? 1 : 0)).current

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isOnline ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 80,
    }).start()
  }, [isOnline])

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E4E4E4', '#B7EBC9'],
  })

  const thumbColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#4E8B6B'],
  })

  const thumbTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  })

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={loading}
      onPress={() => onToggle(!isOnline)}
      style={[
        styles.pill,
        { backgroundColor: isOnline ? '#EAF7EE' : '#F2F2F2' },
        loading && styles.pillLoading,
      ]}
    >
      <View style={styles.labelRow}>
        <View
          style={[
            styles.dot,
            { backgroundColor: isOnline ? '#4E8B6B' : '#9A9A9A' },
          ]}
        />
        <Text
          style={[
            styles.label,
            { color: isOnline ? '#4E8B6B' : '#9A9A9A' },
          ]}
        >
          {loading ? 'Updating…' : isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>

      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbColor,
              transform: [{ translateX: thumbTranslate }],
            },
          ]}
        >
          {loading && (
            <ActivityIndicator
              size="small"
              color={isOnline ? '#ffffff' : '#4E8B6B'}
              style={StyleSheet.absoluteFill}
            />
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  )
}

export default OnlineToggle

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 32,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 16,
    alignSelf: 'flex-start',
    minWidth: 190,
  },
  pillLoading: {
    opacity: 0.65,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
  },
  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
})