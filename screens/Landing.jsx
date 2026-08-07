import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, Image, Animated, Dimensions } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const LOGO_SIZE = 160

// Purely presentational — no navigation logic here. MainNavigation
// controls how long this shows and where the app goes next (it renders
// this component directly, before NavigationContainer even mounts, so
// useNavigation() is not available inside this component).
const Landing = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current
    // Starts just off-screen left, ends just off-screen right
    const translateX = useRef(new Animated.Value(-SCREEN_WIDTH / 2 - LOGO_SIZE / 2)).current

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.15,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        )
        pulse.start()

        // One-directional sweep left -> right, then snaps back to the start
        // and repeats — reads as continuous forward motion, not a bounce.
        const drive = Animated.loop(
            Animated.timing(translateX, {
                toValue: SCREEN_WIDTH / 2 + LOGO_SIZE / 2,
                duration: 2200,
                useNativeDriver: true,
            })
        )
        drive.start()

        return () => {
            pulse.stop()
            drive.stop()
        }
    }, [scaleAnim, translateX])

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/images/splash.png')}
                style={[styles.logo, { transform: [{ translateX }, { scale: scaleAnim }] }]}
                resizeMode="contain"
            />
        </View>
    )
}

export default Landing

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    logo: {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
    },
})