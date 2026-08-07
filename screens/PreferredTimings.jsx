import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import apiService from '../services/ApiService'
import { colors } from '../constants/colors'
import ButtonComp from '../components/common/ButtonComp'

// Local theme for this screen (matches the design spec)
const theme = {
    green: '#5B8C6E',
    greenDark: '#4F7A5D',
    greenLight: '#EAF3EC',
    badgeBg: '#DCEEE0',
    border: '#E2E2E2',
    textGray: '#6D6D6D',
}

const SCHEDULES = [
    {
        key: 'full_time',
        heading: 'Full Time',
        badge: 'Recommended',
        schedule: 'Mon–Sat • Minimum 9 Hours Daily',
        earning: '₹4,000',
        highlight: true,
    },
    {
        key: 'part_time',
        heading: 'Part Time',
        badge: null,
        schedule: 'Flexible 4–6 Hours Daily',
        earning: '₹2,500',
        highlight: false,
    },
    {
        key: 'weekends',
        heading: 'Weekend Only',
        badge: "Students' Choice",
        schedule: 'Friday • Saturday • Sunday',
        earning: null,
        note: 'Ideal pocket-money option',
        highlight: false,
    },
]

const PreferredTimings = () => {
    const [loading, setLoading] = useState(false)
    const { token } = useSelector((state) => state.auth)
    const [workPref, setWorkPref] = useState('full_time')
    const navigation = useNavigation()

    const handlecontinue = async () => {
        if (!workPref) {
            alert('Please select your preferred work timings')
            return
        }
        setLoading(true)
        try {
            const response = await apiService('/api/deliveryBoy/workUpdate', 'PATCH', { type: workPref }, {
                Authorization: `Bearer ${token}`,
            })
            if (response.data.status === 'success') {
                console.log('Work preference updated successfully:', response.data)
                alert('Your work preference has been saved successfully!')
            } else {
                alert('Failed to save your preferences. Please try again later.')
            }
        } catch (error) {
            console.error('Error in handlecontinue:', error)
            alert('An error occurred while saving your preferences. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <AntDesign name="arrowleft" size={22} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Schedule</Text>
                <View style={styles.backBtn} />
            </View>

            <Text style={styles.subtitle}>
                Select the schedule that works best for you. You can update it after 30 days.
            </Text>

            <View style={styles.list}>
                {SCHEDULES.map((item) => (
                    <TimingCard
                        key={item.key}
                        item={item}
                        selected={workPref === item.key}
                        onPress={() => setWorkPref(item.key)}
                    />
                ))}
            </View>

               <ButtonComp
            title="Continue"
            onPress={handlecontinue}
            bg={colors.primary}
            color="#fff"
            size={16}
            fw="700"
            ff="OpenSans-Bold"
            ta="center"
            height={54}
            loading={loading}
            mt={50}
          />

        </View>
    )
}

export default PreferredTimings

const TimingCard = ({ item, selected, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={[styles.card, selected && styles.cardSelected]}
        >
            <View style={styles.cardRow}>
                <View style={styles.cardHeadingRow}>
                    <Text style={styles.cardHeading}>{item.heading}</Text>
                    {item.badge ? (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                    {selected ? <View style={styles.radioInner} /> : null}
                </View>
            </View>

            <Text style={styles.cardSchedule}>{item.schedule}</Text>

            {item.earning ? (
                <View style={styles.earningRow}>
                    {selected ? (
                        <Feather name="trending-up" size={14} color={theme.greenDark} style={{ marginRight: 6 }} />
                    ) : null}
                    <Text style={[styles.earningText, selected && styles.earningTextSelected]}>
                        Earn up to {item.earning}/week
                    </Text>
                </View>
            ) : (
                <Text style={styles.note}>{item.note}</Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backBtn: {
        width: 32,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        color: '#111',
    },
    subtitle: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
        marginBottom: 24,
    },
    list: {
        gap: 14,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: theme.border,
        padding: 18,
        marginBottom: 14,
    },
    cardSelected: {
        borderColor: theme.green,
        backgroundColor: theme.greenLight,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardHeadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardHeading: {
        fontSize: 17,
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        color: '#111',
    },
    badge: {
        backgroundColor: theme.badgeBg,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: 'OpenSans-Medium',
        color: theme.greenDark,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: '#C6C6C6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioOuterSelected: {
        borderColor: theme.green,
    },
    radioInner: {
        width: 11,
        height: 11,
        borderRadius: 6,
        backgroundColor: theme.green,
    },
    cardSchedule: {
        fontSize: 14,
        fontFamily: 'OpenSans-Regular',
        color: '#444',
        marginTop: 10,
    },
    earningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    earningText: {
        fontSize: 14,
        fontFamily: 'OpenSans-Regular',
        color: theme.textGray,
    },
    earningTextSelected: {
        color: theme.greenDark,
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
    },
    note: {
        fontSize: 14,
        fontFamily: 'OpenSans-Regular',
        color: theme.textGray,
        marginTop: 6,
    },
    continueBtn: {
        marginTop: 8,
        marginBottom: 24,
        width: '100%',
        height: 58,
        backgroundColor: theme.green,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
    },
})