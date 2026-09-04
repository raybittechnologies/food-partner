import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Dimensions, Platform, StatusBar, ActivityIndicator, Modal, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../../constants/colors'
import axios from 'axios'
import { BASE_URI } from '../../config/url'
import { useSelector } from 'react-redux'
import RazorpayCheckout from 'react-native-razorpay'
import Entypo from 'react-native-vector-icons/Entypo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Simple percentage helpers to replace react-native-responsive-screen
const wp = (percentage) => (SCREEN_WIDTH * percentage) / 100
const hp = (percentage) => (SCREEN_HEIGHT * percentage) / 100

const { width } = Dimensions.get('window');
const QUICK_AMOUNTS = [100, 200, 500, 1000, ]


const PAYMENT_METHODS = [
    {
        id: 'upi',
        title: 'UPI / Popular Apps',
        subtitle: 'PhonePe, Google Pay, Paytm, Bhim UPI',
        tag: 'LAST USED',
    },
    {
        id: 'card',
        title: 'Debit / Credit Card',
        subtitle: 'Visa, MasterCard, RuPay, Maestro',
    },
    {
        id: 'netbanking',
        title: 'Net Banking',
        subtitle: 'HDFC, ICICI, SBI, Axis & more',
    },
]

// Replace with real data from your store/API
const RECENT_TRANSACTIONS = [
    { id: '1', title: 'Order #4821', subtitle: '10-01-2026 · 8:42 PM', amount: -349, type: 'debit' },
    { id: '2', title: 'Wallet Top-up', subtitle: '05-01-2026 · 11:15 AM', amount: 2000, type: 'credit' },
    { id: '3', title: 'Order #4790', subtitle: '02-01-2026 · 1:05 PM', amount: -189, type: 'debit' },
]




const WalletScreen = () => {
    const insets=useSafeAreaInsets()
    const {token}=useSelector((state)=>state.auth)
    const navigation = useNavigation()
    const [amount, setAmount] = useState()
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const [transactions, setTransactions] = useState(RECENT_TRANSACTIONS)
    const [selectedQuickAmount, setSelectedQuickAmount] = useState(null)
    const [processing, setProcessing] = useState(false)
      const [showSuccessModal, setShowSuccessModal] = useState(false);


    const hasAmount = Number(amount) > 0
  // Animation values
  const scaleAnim = useState(new Animated.Value(0))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

      useEffect(() => {
    if (showSuccessModal) {
      // Animate in
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animation values
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [showSuccessModal, scaleAnim, opacityAnim]);

    const getBalance = async() => {
    try {
        setLoading(true)
        const response = await axios.get(`${BASE_URI}/api/deliveryboy/wallet`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        console.log(response.data.data.transactions)
        setBalance(response.data.data.wallet_balance)
        setTransactions(response.data.data.transactions)
        setLoading(false)
      
    }catch (error) {
        console.log(error)
    }finally {
        setLoading(false)
    }
    
}


useEffect(() => {
    getBalance()
},[])

  const handleInitiateOrder = async () => {
    setProcessing(true);
    try {
      const res = await axios.post(
        `${BASE_URI}/api/deliveryboy/refill`,
        {
        amount: amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
     console.log(res.data?.order?.id);
      const order = res?.data?.order;
      if (!order) {
        throw new Error('Failed to retrieve order details.');
      }

      const options = {
        description: 'Refill Wallet',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_test_Sk2OurfVQpGcPZ',
        amount: order.amount *0.1,
        order_id: order.id,
        name: 'Food Kart LTD.',
        prefill: {
          email: 'void@razorpay.com',
          contact: '9191919191',
          name: 'Razorpay Software',
        },
        theme: { color: colors.primary },
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          try {
            const response = await axios.post(
              `${BASE_URI}/api/deliveryboy/verifyRefill`,
              {
                razorpay_order_id: order.id,
                razorpay_payment_id: data?.razorpay_payment_id,
                razorpay_signature: data?.razorpay_signature,
              },{
                headers: {
                  Authorization: `Bearer ${token}`,
            
                }
              }
            );

            if (response?.data) {
              setShowSuccessModal(true);
              // Auto-close modal after 3 seconds
              setTimeout(() => {
                setShowSuccessModal(false);
              }, 3000);
            }
          } catch (error) {
            handleError(error, 'Payment verification failed');
          } finally {
            setProcessing(false);
          }
        })
        .catch((error) => {
          handleError(error, 'Payment failed');
          setProcessing(false);
        });
    } catch (error) {
      handleError(error, 'Order initiation failed');
      setProcessing(false);
    }
  };

    const handleError = (error, defaultMessage) => {
    const errorMessage =
      error?.response?.data?.message || error?.message || defaultMessage;
   console.log(errorMessage);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    getBalance()
  };

    const handleQuickAmountPress = (value) => {
        setSelectedQuickAmount(value)
        setAmount(String(value))
    }

    const handleAmountChange = (text) => {
        const numeric = text.replace(/[^0-9]/g, '')
        setAmount(numeric)
        setSelectedQuickAmount(numeric ? Number(numeric) : null)
    }
const formatTxnDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) // 13 Aug 2026
  const timePart = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) // 11:33 AM
  return `${datePart} · ${timePart}`
}
    

    return (
        <View style={styles.container}>
            <LinearGradient 
            colors={[colors.greenLight,colors.white]}
            >
            {/* Header */}
            <View style={[styles.header,{paddingTop: Platform.OS === 'ios' ? insets.top : 20}]} >
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Wallet</Text>
                <View style={{ width: 24 }} />
            </View>

  <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
                    <Text style={styles.balanceAmount}>₹ {balance}</Text>
                    <Text style={styles.balanceSubtext}>Last top-up on 05-01-2026</Text>
                </View>
                </LinearGradient>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(4) }}>
                {/* Balance Card */}
              

                {/* Enter Amount */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Enter Amount</Text>

                    <View style={[styles.amountInputWrapper, hasAmount && styles.amountInputWrapperActive]}>
                        <Text style={styles.amountPrefix}>₹</Text>
                        <TextInput
                            value={amount}
                            onChangeText={handleAmountChange}
                            placeholder="0"
                            placeholderTextColor="#C9C9C9"
                            keyboardType="number-pad"
                            style={styles.amountInput}
                        />
                        <Text style={styles.amountCurrency}>INR</Text>
                    </View>

                    <View style={styles.chipsRow}>
                        {QUICK_AMOUNTS.map((value) => {
                            const isSelected = selectedQuickAmount === value
                            return (
                                <TouchableOpacity
                                    key={value}
                                    onPress={() => handleQuickAmountPress(value)}
                                    style={[styles.chip, isSelected && styles.chipSelected]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                        {`+ ₹${value}`}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                {/* Toggle: Recent Transactions <-> Pay Via */}

                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Recent Transactions</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('transactions')}>
                                <Text style={styles.viewAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
                        <View style={{ gap: 12 }}>
                            {transactions.slice(0, 4).map((txn) => (
                                <View key={txn.id} style={styles.txnCard}>
                                    <View style={[styles.txnIconWrap, txn.type === 'credit' ? styles.txnIconCredit : styles.txnIconDebit]}>
                                        <AntDesign
                                            name={txn.type === 'credit' ? 'arrowdown' : 'arrowup'}
                                            size={14}
                                            color={txn.type === 'credit' ? '#1E9E5A' : '#D9534F'}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.txnTitle}>{txn.description}</Text>
                                        <Text style={styles.txnSubtitle}>{formatTxnDate(txn.created_at)}</Text>
                                    </View>
                                    <Text style={[styles.txnAmount, txn.type === 'credit' ? styles.txnAmountCredit : styles.txnAmountDebit]}>
                                        {txn.type === 'credit' ? '+' : '-'}₹{Math.abs(txn.amount)}
                                    </Text>
                                </View>
                            ))}
                        </View>)}
                    </View>

            </ScrollView>

            {/* Bottom CTA — only when an amount is entered */}
            {hasAmount && (
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.payButton} activeOpacity={0.85} onPress={handleInitiateOrder}>
                        {processing ?
                            <ActivityIndicator size="small" color="#fff" />
                            :
                            <Text style={styles.payButtonText}>{`Continue to Pay ₹${amount}`}</Text>
                        }
                    </TouchableOpacity>
                </View>
            )
                        }

                         <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <Entypo name="check" size={60} color="#4CAF50" />
            </View>
            <Text style={styles.modalTitle}>Payment Successful!</Text>
            <Text style={styles.modalSubtitle}>
              We have received your payment, your wallet has been refilled 
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closeModal}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
            
        </View>
    )
}

export default WalletScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
         padding:20,
          marginBottom:20

    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
       
    },

    balanceCard: {
        backgroundColor: '#fff',
        marginHorizontal: wp(5),
        marginTop: -hp(2.5),
        borderRadius: 20,
        padding: wp(5),
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    balanceLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
        color: '#9A9A9A',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 30,
        fontWeight: '800',
        color: '#000',
    },
    balanceSubtext: {
        fontSize: 12,
        color: '#9A9A9A',
        marginTop: 6,
    },

    section: {
        paddingHorizontal: wp(5),
        marginTop: hp(3.5),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
        marginBottom: hp(1.5),
    },
    viewAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#B8860B',
    },

    amountInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E4E4E4',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 8,
    },
    amountInputWrapperActive: {
        borderColor: colors.primary,
    },
    amountPrefix: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    amountInput: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        padding: 0,
    },
    amountCurrency: {
        fontSize: 13,
        color: '#9A9A9A',
        fontWeight: '500',
    },

    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: hp(1.8),
    },
    chip: {
        borderWidth: 1.5,
        borderColor: '#E4E4E4',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    chipTextSelected: {
        color: '#fff',
    },

    methodCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        borderWidth: 1.5,
        borderColor: '#E4E4E4',
        borderRadius: 14,
        padding: 16,
    },
    methodCardSelected: {
        borderColor: colors.primary,
    },
    methodTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    methodTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#000',
    },
    methodSubtitle: {
        fontSize: 12.5,
        color: '#9A9A9A',
        marginTop: 3,
    },
    tagPill: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    tagPillText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.3,
    },

    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D6D6D6',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },

    txnCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1.5,
        borderColor: '#EFEFEF',
        borderRadius: 14,
        padding: 14,
    },
    txnIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txnIconCredit: {
        backgroundColor: '#E5F7EC',
    },
    txnIconDebit: {
        backgroundColor: '#FBEAE9',
    },
    txnTitle: {
        fontSize: 14.5,
        fontWeight: '600',
        color: '#000',
    },
    txnSubtitle: {
        fontSize: 12,
        color: '#9A9A9A',
        marginTop: 2,
    },
    txnAmount: {
        fontSize: 14.5,
        fontWeight: '700',
    },
    txnAmountCredit: {
        color: '#1E9E5A',
    },
    txnAmountDebit: {
        color: '#D9534F',
    },

    bottomBar: {
        paddingHorizontal: wp(5),
        paddingTop: hp(1.5),
        paddingBottom: hp(3),
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    payButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        alignItems: 'center',
    },
    payButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
      modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter_18pt-Medium',
    fontSize: 22,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: 'Inter_18pt-Regular',
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'Inter_18pt-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
})