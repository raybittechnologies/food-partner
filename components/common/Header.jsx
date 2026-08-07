// components/common/OnboardingHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GREEN_DARK = '#4F7A63';
const GREEN_TINT = '#EAF2ED';

const OnboardingHeader = ({ title, subtitle, icon = 'bag-outline', showBack = true, showicon = true }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.wrapper}>
            {showBack && (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
                </TouchableOpacity>
            )}

            <View style={styles.card}>
                {showicon && (
                    <View style={styles.iconBox}>
                        <Ionicons name={icon} size={24} color="#fff" />
                    </View>
                )}
                <Text style={styles.title}>{title}</Text>
                {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </View>
    );
};

export default OnboardingHeader;

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 16
    },
    backButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        marginBottom: 12,
    },
    card: {
        backgroundColor: GREEN_TINT,
        borderRadius: 20,
        padding: 20,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: GREEN_DARK,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    title: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 22,
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: '#5C6B62',
    },
});