import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Platform, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
const data = {
  today: [
    {
      id: '1',
      icon: 'payments',
      text: 'A Netflix payout of $19 has been successful!',
      time: '11.00 AM',
      amount: '$19',
    },
    {
      id: '2',
      icon: 'account-balance-wallet',
      text: 'Successfully top up balance $150 from US CITIBAN. See details here.',
      time: '08.00 AM',
      amount: '$150',
    },
    {
      id: '3',
      icon: 'credit-card',
      text: 'Please top up to continue transactions on Netflix',
      time: '01.00 AM',
    },
  ],
  thisWeek: [
    {
      id: '4',
      icon: 'payments',
      text: 'A Netflix payout of $19 has been successful!',
      time: '11.00 AM',
      amount: '$19',
      highlight: true,
    },
    {
      id: '5',
      icon: 'account-balance-wallet',
      text: 'Successfully top up balance $150 from US CITIBAN. See details here.',
      time: '08.00 AM',
      amount: '$150',
    },
    {
      id: '6',
      icon: 'credit-card',
      text: 'Please top up to continue transactions on Netflix',
      time: '01.00 AM',
    },
  ],
};

const NotificationItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.iconWrapper}>
        <Icon name={item.icon} size={20} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.notificationText}>
          {item.text.split(item.amount || '').map((part, index) => (
            <Text key={index}>
              <Text style={styles.textNormal}>{part}</Text>
              {index !== item.text.split(item.amount || '').length - 1 && (
                <Text style={styles.amountText}>{item.amount}</Text>
              )}
            </Text>
          ))}
        </Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );
};


const Notifications = () => {
    const navigation=useNavigation();
  return (
    <View style={styles.container}>


      {/* Title */}
      <View style={styles.titleWrapper}>
<TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
  <AntDesign name="arrowleft" size={24} color="#000" />
</TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <Text style={styles.subtext}>
        You have <Text style={{ color: '#FF5722' }}>2 Notifications</Text> today.
      </Text>

      {/* Today */}
      <Text style={styles.section}>Today</Text>
      {data.today.map(item => (
        <NotificationItem key={item.id} item={item} />
      ))}

      {/* This Week */}
      <Text style={styles.section}>This Week</Text>
      {data.thisWeek.map(item => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop:Platform.OS==='android'?StatusBar.currentHeight:50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  signal: {
    width: 15,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  wifi: {
    width: 12,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  battery: {
    width: 18,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  backArrow: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
  },
  subtext: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
    marginBottom: 16,
  },
  section: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
  amountText: {
    color: '#FF5722',
    fontWeight: 'bold',
  },
  textNormal: {
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  
});

export default Notifications;
