import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setDelivery } from '../../redux/authSlice';
import apiService from '../../services/ApiService';


const theme = {
    green: '#5B8C6E',
    border: '#E5E5E5',
    textGray: '#6D6D6D',
    labelGray: '#8A8A8A',
}

const ConfirmPickupModal = ({ visible, onClose }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const { order, token } = useSelector((state) => state.auth);

    const handleConfirm = async () => {
        try {
            setIsConfirming(true);
            const res = await apiService(
                `/api/deliveryBoy/confirmOrder?order_id=${order?.order_id}`,
                "PATCH",
                null,
                { Authorization: `Bearer ${token}` },
            );

            console.log("Pickup confirmed successfully:", res);
            if (res.data?.status === 'on the way') {
                dispatch(setDelivery("delivering"))
                onClose();
                navigation.replace("Tracking");
            } else {
                Alert.alert("Alert", res.error || "Failed to confirm pickup. Please try again.");
            }
        } catch (error) {
            console.error("Error confirming pickup:", error);
            Alert.alert("Alert", "Failed to confirm pickup. Please try again.");
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.sheet}>
                    <View style={styles.handle} />

                    <Text style={styles.title}>🛵 Confirm Pickup</Text>
                    <Text style={styles.subtitle}>Confirm that you've picked up this order.</Text>

                    <View style={styles.card}>
                        <Text style={styles.cardLabelRow}>PICKUP FROM</Text>
                        <Text style={styles.restaurantName}>{order?.restaurant_name}</Text>
                        <Text style={styles.address}>
                            {order?.street}{order?.landmark ? `, ${order?.landmark}` : ''}{order?.area ? `, ${order?.area}` : ''}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleConfirm}
                        style={[styles.confirmBtn, isConfirming && { opacity: 0.7 }]}
                        activeOpacity={0.85}
                        disabled={isConfirming}
                    >
                        <Text style={styles.confirmText}>{isConfirming ? 'Confirming...' : 'Confirm'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.7}>
                        <Text style={styles.cancelText}>Not Yet</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmPickupModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 30,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.border,
        alignSelf: 'center',
        marginBottom: 16,
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
        marginBottom: 20,
    },
    cardLabelRow: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 12,
        color: theme.labelGray,
        letterSpacing: 0.5,
        marginBottom: 10,
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
    },
    confirmBtn: {
        backgroundColor: theme.green,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmText: {
        color: '#fff',
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 17,
    },
    cancelBtn: {
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    cancelText: {
        color: theme.textGray,
        fontFamily: 'OpenSans-Bold',
        fontWeight: '700',
        fontSize: 16,
    },
})