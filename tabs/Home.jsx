import React, { useEffect, useRef, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import { colors } from '../constants/colors'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import OnlineToggle from '../components/common/OnlineToggle'
import { clearOrder, setDelivery, setIsOnline } from '../redux/authSlice'
import { useLocation } from '../components/tracking/LocationProvider'
import { useSocket } from '../context/sockets'
import ButtonComp from '../components/common/ButtonComp'
import notifee, { AndroidImportance } from '@notifee/react-native';
import axios from 'axios'
import { BASE_URI } from '../config/url'

// ---- Circular progress ring ----
const ProgressRing = ({ completed, total, size = 100, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const progress = total > 0 ? completed / total : 0
    const strokeDashoffset = circumference * (1 - progress)

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                <Circle
                    stroke="#F1E9E4"
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={colors.primary}
                    fill="none"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={styles.progressRingCenter}>
                <Text style={styles.progressRingValue}>
                    {completed}/{total}
                </Text>
                <Text style={styles.progressRingLabel}>Orders</Text>
            </View>
        </View>
    )
}

const Home = () => {
    const {user,token}=useSelector((state)=>state.auth);
     const { socket } = useSocket();
     const toggleTimeoutRef = useRef(null) 
     const [loading,setLoading]=useState(false);
    const dispatch = useDispatch();
    const [data,setData]=useState(null);
      const { location } = useLocation();
      const [toggleLoading, setToggleLoading] = useState(false)

    const today = new Date()
    const navigation=useNavigation();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    })

    // ── Derive display data from API response, with safe fallbacks ──────────
    const currentDelivery = data?.current_delivery
    const recentActivity = data?.recent_activity ?? []
    const todayPerformance = data?.today_performance
    const todayProgress = data?.today_progress ?? { completed: 0, target: 20, percentage: 0, remaining: 20 }

    const performanceStats = [
        {
            key: 'orders',
            value: String(todayPerformance?.orders_completed ?? 0),
            label: 'Orders Completed',
            iconBg: '#FDE8DD',
            icon: <MaterialCommunityIcons name="moped" size={22} color="#FA4A0C" />,
        },
        {
            key: 'earnings',
            value: `₹${todayPerformance?.earnings ?? '0.00'}`,
            label: "Today's Earnings",
            iconBg: '#DFF5E6',
            icon: <Feather name="dollar-sign" size={20} color="#2FAE60" />,
        },
        {
            key: 'withdrawals',
            value: `₹${todayPerformance?.withdrawals ?? '0.00'}`,
            label: 'Withdrawals',
            iconBg: '#FEF6DD',
            icon: <Ionicons name="wallet-outline" size={20} color="#F5B400" />,
        },
    ]

const handleToggleOnline = (next) => {

  setToggleLoading(true)

  const payload = {
    location: { lat: location.latitude, lng: location.longitude },
    status: next ? 'online' : 'offline',
  }
console.log(payload)
    console.log('handleToggleOnline called with next:', socket.id)
  socket?.emit('deliveryBoyConnect', payload, (res) => {
    console.log('✅ ack received — server confirmed the update',res)
    // Note: the ack only confirms the server got the request,
    // not that the status flip happened — the real confirmation
    // is the 'deliveryBoyConnected' listener below.
  })

  // Safety net so the loader can't get stuck forever if the
  // 'deliveryBoyConnected' event never arrives (dropped connection, etc.)
  if (toggleTimeoutRef.current) clearTimeout(toggleTimeoutRef.current)
  toggleTimeoutRef.current = setTimeout(() => {
    setToggleLoading(false)
    Alert.alert('Still working on it', 'Taking longer than usual to update your status. Please check your connection.')
  }, 8000)
}


const handleEarnings = async() => {
    try {
      setLoading(true)
      const res = await axios.get(`${BASE_URI}/api/deliveryBoy/dashboard`,{
        headers: {
          'Authorization':  `Bearer ${token} `
        }
      })
      setData(res.data.data)
    } catch (error) {
      console.log(error)
    }finally {
      setLoading(false)
    }
  }

    useEffect(() => {
      handleEarnings()
    },[])


useEffect(() => {
  socket?.on('deliveryBoyConnected', (data) => {

    console.log('🔔 deliveryBoyConnected event received:', data)
    dispatch(setIsOnline(data.status === 'online' ? true : false))
    setToggleLoading(false)
    if (toggleTimeoutRef.current) clearTimeout(toggleTimeoutRef.current)
  }
)

  return () => {
    socket?.off('deliveryBoyConnected')
    if (toggleTimeoutRef.current) clearTimeout(toggleTimeoutRef.current)
  }
}, [])
 

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.greeting}>Hello {user?.first_name} {user?.last_name} 👋</Text>
                        <Text style={styles.dateText}>{formattedDate}</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.bellButton} onPress={() => navigation.navigate('notifications')}>
                            <Ionicons name="notifications-outline" size={20} color="#202020" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>navigation.navigate('wallet')}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                            style={styles.avatar}
                        />
                        </TouchableOpacity>
                    </View>
                </View>

<OnlineToggle onToggle={handleToggleOnline} loading={toggleLoading} />
                {/* Today's Performance */}
                <Text style={styles.sectionTitle}>Today's Performance</Text>
                <View style={styles.statsGrid}>
                    {performanceStats.map(stat => (
                        <View key={stat.key} style={styles.statCard}>
                            <View style={[styles.statIconWrap, { backgroundColor: stat.iconBg }]}>
                                {stat.icon}
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Current Delivery — only render if there's an active one */}
                {currentDelivery && (
                    <View style={styles.deliveryCard}>
                        <View style={styles.deliveryAccent} />
                        <View style={styles.deliveryContent}>
                            <View style={styles.deliveryTopRow}>
                                <View style={styles.deliveryStatusRow}>
                                    <View style={styles.liveDot} />
                                    <Text style={styles.deliveryStatusText}>
                                        {currentDelivery.status?.toUpperCase() ?? 'CURRENT DELIVERY'}
                                    </Text>
                                </View>
                                <Text style={styles.deliveryEta}>{currentDelivery.duration}</Text>
                            </View>

                            <View style={styles.deliveryTitleRow}>
                                <Text style={styles.deliveryRestaurant}>{currentDelivery.restaurant_name}</Text>
                                <Text style={styles.deliveryDistance}>{currentDelivery.distance}</Text>
                            </View>

                            <View style={styles.addressRow}>
                                <Ionicons name="location" size={16} color="#FA4A0C" />
                                <Text style={styles.addressText}>{currentDelivery.pickup_address}</Text>
                            </View>
                            <View style={styles.addressRow}>
                                <Ionicons name="person" size={16} color="#5B5B5B" />
                                <Text style={styles.addressText}>{currentDelivery.dropoff_address}</Text>
                            </View>

                            <ButtonComp
                                title="Track Order"
                                onPress={() => navigation.navigate('Tracking', { orderId: currentDelivery.order_id })}
                                bg={colors.primary}
                                color="#fff"
                                size={16}
                                fw="700"
                                ff="OpenSans-Bold"
                                ta="center"
                                height={48}
                                mt={20}
                            />
                        </View>
                    </View>
                )}

                {/* Today's Progress */}
                <Text style={styles.sectionTitle}>Today's Progress</Text>
                <View style={styles.progressCard}>
                    <ProgressRing completed={todayProgress.completed} total={todayProgress.target} />
                    <Text style={styles.progressText}>
                        You're{' '}
                        <Text style={styles.progressPercent}>
                            {Math.round(todayProgress.percentage)}%
                        </Text>{' '}
                        towards today's delivery goal! Just{' '}
                        {todayProgress.remaining} more to go.
                    </Text>
                </View>

                {/* Recent Activity */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.activityCard}>
                    {recentActivity.length === 0 ? (
                        <View style={styles.emptyActivity}>
                            <Text style={styles.emptyActivityText}>No recent activity yet</Text>
                        </View>
                    ) : (
                        recentActivity.map((item, index) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.activityRow,
                                    index !== recentActivity.length - 1 && styles.activityDivider,
                                ]}
                            >
                                <View style={styles.activityLeft}>
                                    <View style={styles.checkCircle}>
                                        <Ionicons name="checkmark" size={14} color="#2FAE60" />
                                    </View>
                                    <View>
                                        <Text style={styles.activityName}>{item.restaurant_name}</Text>
                                        <Text style={styles.activityTime}>{item.time_ago}</Text>
                                    </View>
                                </View>
                                <Text style={styles.activityAmount}>+₹{item.amount}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home

const CARD_RADIUS = 16

const styles = StyleSheet.create({
    // ...all your existing styles unchanged...
    safeArea: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    greeting: { fontSize: 20, fontWeight: '700', color: '#141414', fontFamily: 'OpenSans-Bold' },
    dateText: { fontSize: 13, color: '#8A8A8A', marginTop: 4, fontFamily: 'OpenSans-Regular' },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    bellButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.primary },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#141414', marginTop: 24, marginBottom: 12, fontFamily: 'OpenSans-Bold' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    statCard: { width: '48%', backgroundColor: '#fff', borderRadius: CARD_RADIUS, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
    statIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    statValue: { fontSize: 20, fontWeight: '700', color: '#141414', fontFamily: 'OpenSans-Bold' },
    statLabel: { fontSize: 12, color: '#8A8A8A', marginTop: 4, fontFamily: 'OpenSans-Regular' },
    deliveryCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: CARD_RADIUS, marginTop: 4, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    deliveryAccent: { width: 4, backgroundColor: colors.primary },
    deliveryContent: { flex: 1, padding: 16 },
    deliveryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    deliveryStatusRow: { flexDirection: 'row', alignItems: 'center' },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2FAE60', marginRight: 6 },
    deliveryStatusText: { color: colors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, fontFamily: 'OpenSans-Bold' },
    deliveryEta: { color: '#8A8A8A', fontSize: 13, fontFamily: 'OpenSans-Regular' },
    deliveryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    deliveryRestaurant: { fontSize: 17, fontWeight: '700', color: '#141414', fontFamily: 'OpenSans-Bold' },
    deliveryDistance: { fontSize: 13, color: '#8A8A8A', fontFamily: 'OpenSans-Regular' },
    addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    addressText: { marginLeft: 8, fontSize: 13, color: '#3A3A3A', fontFamily: 'OpenSans-Regular' },
    progressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: CARD_RADIUS, padding: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
    progressRingCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    progressRingValue: { fontSize: 16, fontWeight: '700', color: '#141414', fontFamily: 'OpenSans-Bold' },
    progressRingLabel: { fontSize: 11, color: '#8A8A8A', fontFamily: 'OpenSans-Regular' },
    progressText: { flex: 1, marginLeft: 20, fontSize: 14, color: '#3A3A3A', lineHeight: 20, fontFamily: 'OpenSans-Regular' },
    progressPercent: { color: '#FA4A0C', fontWeight: '700', fontFamily: 'OpenSans-Bold' },
    activityCard: { backgroundColor: '#fff', borderRadius: CARD_RADIUS, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
    activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
    activityDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EEE' },
    activityLeft: { flexDirection: 'row', alignItems: 'center' },
    checkCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E4F7EA', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    activityName: { fontSize: 14, fontWeight: '600', color: '#141414', fontFamily: 'OpenSans-SemiBold' },
    activityTime: { fontSize: 12, color: '#8A8A8A', marginTop: 2, fontFamily: 'OpenSans-Regular' },
    activityAmount: { fontSize: 14, fontWeight: '700', color: '#2FAE60', fontFamily: 'OpenSans-Bold' },
    emptyActivity: { paddingVertical: 24, alignItems: 'center' },
    emptyActivityText: { fontSize: 13, color: '#8A8A8A', fontFamily: 'OpenSans-Regular' },
})