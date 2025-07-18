import { FlatList, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Header from '../components/common/Header';

const Orders = () => {
  const ordersData = [
    {
      id: '1',
      data: [
        { id: '1', name: 'Item Delivered', status: 'Pizza + Coke' },
        { id: '2', name: 'Location', status: 'Srinagar, J&K' },
        { id: '3', name: 'Earnings', status: '₹500' },
        { id: '4', name: 'Status', status: 'Delivered on June 5, 2023' },
      ],
    },
    {
      id: '2',
      data: [
        { id: '1', name: 'Item Delivered', status: 'Burger Combo' },
        { id: '2', name: 'Location', status: 'Rajbagh, Srinagar' },
        { id: '3', name: 'Earnings', status: '₹300' },
        { id: '4', name: 'Status', status: 'Delivered on May 20, 2023' },
      ],
    },
    {
      id: '3',
      data: [
        { id: '1', name: 'Item Delivered', status: 'Biryani' },
        { id: '2', name: 'Location', status: 'Lal Chowk, Srinagar' },
        { id: '3', name: 'Earnings', status: '₹400' },
        { id: '4', name: 'Status', status: 'Delivered on May 10, 2023' },
      ],
    },
    {
      id: '4',
      data: [
        { id: '1', name: 'Item Delivered', status: 'Tandoori Chicken' },
        { id: '2', name: 'Location', status: 'Nowgam, Srinagar' },
        { id: '3', name: 'Earnings', status: '₹450' },
        { id: '4', name: 'Status', status: 'Delivered on May 1, 2023' },
      ],
    },
    {
      id: '5',
      data: [
        { id: '1', name: 'Item Delivered', status: 'Veg Thali' },
        { id: '2', name: 'Location', status: 'Hyderpora, Srinagar' },
        { id: '3', name: 'Earnings', status: '₹350' },
        { id: '4', name: 'Status', status: 'Delivered on April 25, 2023' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Header title={'My Orders'} showicon={true} />
      <View style={styles.body}>
        <FlatList
          data={ordersData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MyOrders data={item.data} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default Orders;

function MyOrders({ data }) {
  return (
    <View style={styles.orders}>
      {data.map((item) => (
        <View key={item.id} style={styles.orderRow}>
          <Text style={styles.label}>{item.name}:</Text>
          <Text style={styles.value}>{item.status}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  orders: {
    padding: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  orderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
  },
  value: {
    flex: 1,
    color: 'black',
  },
});
