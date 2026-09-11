import { FlatList, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { colors } from '../constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URI } from '../config/url';

const Orders = () => {
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [orders, setOrders] = useState([])
  const {token} = useSelector((state) => state.auth)
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const GetOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      const res = await axios.get(`${BASE_URI}/api/deliveryBoy/myOrders`, {
        headers: {
          'Authorization': `Bearer ${token} `
        }
      })
      console.log(res.data.data.orders)
      setOrders(res.data.data.orders ?? [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useFocusEffect(useCallback(() => {
    GetOrders()
  }, []))



  const handleRefresh = useCallback(() => {
    GetOrders(true)
  }, [])

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AntDesign name="arrowleft" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.heading}>My Orders</Text>
        <View style={styles.backBtn} />
      </View>

      <Text style={styles.subheading}>{orders.length} deliveries completed</Text>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => (item.order_id)}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={[
            { paddingBottom: 24, paddingTop: 6 },
            orders.length === 0 && styles.emptyContentContainer,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="receipt-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>
                Your completed deliveries will show up here once you start accepting orders.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Orders;

function OrderCard({ order }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.itemIconWrap}>
          <Ionicons name="fast-food-outline" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>{order.item}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color="#8A8A8A" />
            <Text style={styles.locationText}>{order.location}</Text>
          </View>
        </View>
        <Text style={styles.earnings}>₹{order.earnings}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottomRow}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color="#8A8A8A" />
          <Text style={styles.dateText}>{order.date}</Text>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backBtn: {
    width: 32,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
  },
  subheading: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: '#8A8A8A',
    textAlign: 'center',
    marginBottom: 18,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '14',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: '#8A8A8A',
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#8A8A8A',
  },
  earnings: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#8A8A8A',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCF3E3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E9E56',
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#2E9E56',
  },
});