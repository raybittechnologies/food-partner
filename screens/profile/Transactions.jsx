import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { BASE_URI } from '../../config/url'
import { colors } from '../../constants/colors'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const wp = (percentage) => (SCREEN_WIDTH * percentage) / 100
const hp = (percentage) => (SCREEN_HEIGHT * percentage) / 100

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'credit', label: 'Credits' },
    { key: 'debit', label: 'Debits' },
]

const formatTxnDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const datePart = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
    const timePart = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
    return `${datePart} · ${timePart}`
}

const Transactions = () => {
    const { token } = useSelector((state) => state.auth)
    const navigation = useNavigation()

    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)
    const [activeFilter, setActiveFilter] = useState('all')

    const fetchTransactions = useCallback(async () => {
        try {
            setError(null)
            const response = await axios.get(`${BASE_URI}/api/deliveryboy/wallet`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setTransactions(response.data?.data?.transactions || [])
        } catch (err) {
            console.log(err)
            setError('Could not load transactions. Pull down to try again.')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [token])

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchTransactions()
    }

    const filteredTransactions =
        activeFilter === 'all'
            ? transactions
            : transactions.filter((txn) => txn.type === activeFilter)

    const renderItem = ({ item }) => (
        <View style={styles.txnCard}>
            <View
                style={[
                    styles.txnIconWrap,
                    item.type === 'credit' ? styles.txnIconCredit : styles.txnIconDebit,
                ]}
            >
                <AntDesign
                    name={item.type === 'credit' ? 'arrowdown' : 'arrowup'}
                    size={14}
                    color={item.type === 'credit' ? '#1E9E5A' : '#D9534F'}
                />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.txnTitle} numberOfLines={1}>
                    {item.description || (item.type === 'credit' ? 'Wallet Credit' : 'Wallet Debit')}
                </Text>
                <Text style={styles.txnSubtitle}>{formatTxnDate(item.created_at)}</Text>
            </View>
            <Text
                style={[
                    styles.txnAmount,
                    item.type === 'credit' ? styles.txnAmountCredit : styles.txnAmountDebit,
                ]}
            >
                {item.type === 'credit' ? '+' : '-'}₹{Math.abs(item.amount)}
            </Text>
        </View>
    )

    const renderEmpty = () => {
        if (loading) return null
        return (
            <View style={styles.emptyWrap}>
                <View style={styles.emptyIconWrap}>
                    <Ionicons name="receipt-outline" size={32} color="#B8B8B8" />
                </View>
                <Text style={styles.emptyTitle}>No transactions yet</Text>
                <Text style={styles.emptySubtitle}>
                    Your wallet activity will show up here once you have some.
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transactions</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Filter chips */}
            <View style={styles.filterRow}>
                {FILTERS.map((f) => {
                    const isSelected = activeFilter === f.key
                    return (
                        <TouchableOpacity
                            key={f.key}
                            onPress={() => setActiveFilter(f.key)}
                            style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    isSelected && styles.filterChipTextSelected,
                                ]}
                            >
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : error ? (
                <View style={styles.emptyWrap}>
                    <Ionicons name="alert-circle-outline" size={32} color="#D9534F" />
                    <Text style={styles.emptyTitle}>Something went wrong</Text>
                    <Text style={styles.emptySubtitle}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchTransactions}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item, index) => String(item.id ?? item._id ?? index)}
                    renderItem={renderItem}
                    contentContainerStyle={[
                        styles.listContent,
                        filteredTransactions.length === 0 && { flexGrow: 1 },
                    ]}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                    ListEmptyComponent={renderEmpty}
                />
            )}
        </View>
    )
}

export default Transactions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: wp(5),
        marginBottom: hp(2),
    },
    filterChip: {
        borderWidth: 1.5,
        borderColor: '#E4E4E4',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 40,
    },
    filterChipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
    },
    filterChipTextSelected: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: wp(5),
        paddingBottom: hp(4),
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
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(10),
        paddingTop: hp(6),
    },
    emptyIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginTop: 12,
        marginBottom: 6,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9A9A9A',
        textAlign: 'center',
        lineHeight: 19,
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 10,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
})