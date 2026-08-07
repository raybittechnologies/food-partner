import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/colors';



const INITIAL_DATA = {
  today: [
    {
      id: '1',
      icon: 'notifications-outline',
      title: 'New Order Assigned',
      time: '2 mins ago',
      text: 'You have been assigned a new delivery to Sector 4. Please accept within 2 mins.',
    },
    {
      id: '2',
      icon: 'gift-outline',
      title: 'Incentive Unlocked!',
      time: '2 hrs ago',
      text: 'Congratulations! You completed 5 deliveries today and earned an extra bonus of ₹150.',
    },
    {
      id: '3',
      icon: 'chatbubble-outline',
      title: 'Customer Message',
      time: '5 hrs ago',
      text: "'Please leave the parcel near the doorstep on the first floor.' - Anish S.",
    },
  ],
  thisWeek: [
    {
      id: '4',
      icon: 'card-outline',
      title: 'Weekly Earnings Deposited',
      time: '2 days ago',
      text: 'Your total payout of ₹4,850 for the past week has been transferred to your linked bank account.',
    },
    {
      id: '5',
      icon: 'checkmark-circle-outline',
      title: 'Driving License Approved',
      time: '4 days ago',
      text: 'Great news! Your uploaded Driving License has been successfully verified. You are ready to ride.',
    },
    {
      id: '6',
      icon: 'trending-up-outline',
      title: 'Srinagar Zone Surge Active',
      time: '5 days ago',
      text: 'High order volume detected in Srinagar. Earn up to 1.5x extra on all orders placed before 9 PM.',
    },
  ],
};

const NotificationCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <Ionicons name={item.icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.cardText}>{item.text}</Text>
      </View>
    </View>
  );
};

const Notifications = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(INITIAL_DATA);

  const handleClearAll = () => {
    setData({ today: [], thisWeek: [] });
  };

  const isEmpty = data.today.length === 0 && data.thisWeek.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <AntDesign name="arrowleft" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.clearAll}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={32} color={colors.textGray} />
            <Text style={styles.emptyText}>You're all caught up</Text>
          </View>
        ) : (
          <>
            {data.today.length > 0 && (
              <>
                <Text style={styles.section}>Today</Text>
                {data.today.map((item) => (
                  <NotificationCard key={item.id} item={item} />
                ))}
              </>
            )}

            {data.thisWeek.length > 0 && (
              <>
                <Text style={styles.section}>This Week</Text>
                {data.thisWeek.map((item) => (
                  <NotificationCard key={item.id} item={item} />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  backBtn: {
    width: 32,
  },
  title: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
  },
  clearAll: {
    fontSize: 14,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: colors.primary,
  },
  section: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
    marginRight: 8,
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'OpenSans-Regular',
    color: colors.textGray,
  },
  cardText: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: '#555',
    lineHeight: 19,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: colors.textGray,
  },
});