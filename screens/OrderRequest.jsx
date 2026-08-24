import { Alert, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSocket } from '../context/sockets';
import { useDispatch, useSelector } from 'react-redux';
import { clearOrder, setDelivery } from '../redux/authSlice';
import apiService from '../services/ApiService';

const theme = {
    green: '#5B8C6E',
    greenDark: '#4F7A5D',
    border: '#E5E5E5',
    textGray: '#6D6D6D',
    labelGray: '#8A8A8A',
}

const COUNTDOWN_SECONDS = 60

const OrderRequest = () => {
    const [isAccepting, setIsAccepting] = useState(false);
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const { setDispatchOrder } = useSocket()
    const { order, token } = useSelector((state) => state.auth);
    const { setIsNewOrder, setNewOrder } = useSocket();

    const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);

    const handleOrder = async () => {
        try {
            const res = await apiService(
                `/api/deliveryBoy/acceptOrder?order_id=${order?.order_id}`,
                "PATCH",
                null,
                { Authorization: `Bearer ${token}` },
            );

            console.log("Order accepted successfully:", res);
            if (res.data?.status === 'accepted') {
                dispatch(setDelivery(""))
                navigation.replace("Tracking");
            } else {
                Alert.alert("Error", "Failed to process the order. Please try again.");
            }
        } catch (error) {
            console.error("Error handling order:", error);
            Alert.alert("Error", "Failed to handle the order. Please try again.");
        }
    };

    const handleTimeOut = () => {
        dispatch(clearOrder())
        setNewOrder(false)
        dispatch(setDelivery(""))
        setDispatchOrder(true)
        navigation.replace("dashboard", { screen: "Home" });
    }

    const handleAccept = () => {
        setIsAccepting(true);
        handleOrder();
        setNewOrder(false);
        setIsNewOrder(true)
    };

    const handleDecline = () => {
        handleTimeOut();
    };

    // Countdown ticker
    useEffect(() => {
        if (isAccepting) return;

        if (timeLeft <= 0) {
            handleTimeOut();
            return;
        }
        const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timeLeft, isAccepting]);

    const pickupKm = (order?.delivery_boy_route?.to_restaurant?.distanceValue ?? 0) / 1000;
    const dropKm = ((order?.delivery_boy_route?.full_journey?.distanceValue ?? 0) / 1000) - pickupKm;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.mapWrap}>
                    <View style={styles.mapCircle}>
                        <Image
                            source={require("../assets/images/map.png")}
                            style={styles.mapImage}
                        />
                    </View>
                    <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>{timeLeft}s</Text>
                    </View>
                </View>

                <Text style={styles.title}>🚀 New Delivery Request</Text>
                <Text style={styles.subtitle}>You have received a nearby pickup.</Text>

                {/* Estimated earnings card */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>💰  ESTIMATED EARNINGS</Text>
                    <Text style={styles.earnings}>₹{order?.del_amount ?? '0.00'}</Text>
                    <View style={styles.divider} />
                    <View style={styles.distanceRow}>
                        <View style={styles.distanceItem}>
                            <Ionicons name="location-outline" size={16} color={theme.green} />
                            <Text style={styles.distanceText}>
                                Pickup: <Text style={styles.distanceValue}>{pickupKm} km</Text>
                            </Text>
                        </View>
                        <View style={styles.vDivider} />
                        <View style={styles.distanceItem}>
                            <Ionicons name="flag-outline" size={16} color={theme.green} />
                            <Text style={styles.distanceText}>
                                Total: <Text style={styles.distanceValue}>{dropKm} km</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Pickup from card */}
                <View style={styles.card}>
                    <Text style={styles.cardLabelRow}>
                        <Ionicons name="cart-outline" size={13} color={theme.labelGray} />  PICKUP FROM
                    </Text>
                    <Text style={styles.restaurantName}>{order?.restaurant_name}</Text>
                    <Text style={styles.address}>
                        {order?.street}{order?.landmark ? `, ${order?.landmark}` : ''}{order?.area ? `, ${order?.area}` : ''}
                    </Text>
                    <View style={styles.pillRow}>
                        <View style={styles.pill}>
                            <Ionicons name="time-outline" size={14} color="#333" />
                            <Text style={styles.pillText}>
                                Ready in {order?.delivery_boy_route?.to_restaurant?.estimated_time ?? '—'} min
                            </Text>
                        </View>
                        {order?.restaurant_rating ? (
                            <View style={styles.pill}>
                                <Ionicons name="star" size={14} color="#E3B341" />
                                <Text style={styles.pillText}>{order?.restaurant_rating} Rating</Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                {/* Delivery route card */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>DELIVERY ROUTE</Text>
                    <View style={styles.routeRow}>
                        <View style={styles.routeDotCol}>
                            <View style={styles.routeDot} />
                            <View style={styles.routeLine} />
                        </View>
                        <View style={styles.routeTextCol}>
                            <Text style={styles.routeTitle}>{order?.restaurant_name}</Text>
                            <Text style={styles.routeSubtitle}>Pickup Location</Text>
                        </View>
                    </View>
                    <View style={styles.routeRow}>
                        <View style={styles.routeDotCol}>
                            <View style={styles.routeDot} />
                        </View>
                        <View style={styles.routeTextCol}>
                            <Text style={styles.routeTitle}>Customer Destination</Text>
                            <Text style={styles.routeSubtitle}>
                                {order?.area ?? 'Destination'}{dropKm ? ` (${dropKm} km away)` : ''}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity onPress={handleAccept} style={styles.acceptBtn} activeOpacity={0.85}>
                    <Text style={styles.acceptText}>Accept Order</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDecline} style={styles.declineBtn} activeOpacity={0.7}>
                    <Text style={styles.declineText}>Decline Request</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default OrderRequest

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: "10%",
    },
    mapWrap: {
        width: 130,
        height: 130,
        alignSelf: 'center',
        marginBottom: 20,
    },
    mapCircle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 1.5,
        borderColor: theme.green,
        overflow: 'hidden',
        backgroundColor: '#F2F2F2',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    timerBadge: {
        position: 'absolute',
        top: -6,
        right: -30,
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: theme.green,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        color: theme.green,
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 13,
    },
    title: {
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 20,
        color: '#111',
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        color: theme.textGray,
        textAlign: 'center',
        marginTop: 4,
        marginBottom: 20,
    },
    card: {
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
    },
    cardLabel: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 12,
        color: theme.labelGray,
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    cardLabelRow: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 12,
        color: theme.labelGray,
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    earnings: {
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 26,
        color: theme.green,
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: theme.border,
        marginBottom: 12,
    },
    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    vDivider: {
        width: 1,
        height: 20,
        backgroundColor: theme.border,
        marginHorizontal: 10,
    },
    distanceText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        color: '#333',
    },
    distanceValue: {
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        color: theme.green,
    },
    restaurantName: {
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 18,
        color: '#111',
        marginBottom: 6,
    },
    address: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        color: theme.textGray,
        lineHeight: 19,
        marginBottom: 12,
    },
    pillRow: {
        flexDirection: 'row',
        gap: 10,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#F4F4F4',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    pillText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 12,
        color: '#333',
    },
    routeRow: {
        flexDirection: 'row',
    },
    routeDotCol: {
        alignItems: 'center',
        width: 18,
    },
    routeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.green,
        marginTop: 4,
    },
    routeLine: {
        width: 1,
        flex: 1,
        minHeight: 22,
        backgroundColor: theme.border,
        marginVertical: 2,
    },
    routeTextCol: {
        flex: 1,
        marginLeft: 10,
        marginBottom: 14,
    },
    routeTitle: {
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 14,
        color: '#111',
    },
    routeSubtitle: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 12,
        color: theme.textGray,
        marginTop: 2,
    },
    acceptBtn: {
        backgroundColor: theme.green,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    acceptText: {
        color: '#fff',
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 17,
    },
    declineBtn: {
        height: 54,
        borderRadius: 27,
        borderWidth: 1,
        borderColor: theme.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    declineText: {
        color: theme.textGray,
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 16,
    },
})