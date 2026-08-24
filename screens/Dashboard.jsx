import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../tabs/Home'
import Account from '../tabs/Account'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Octicons from 'react-native-vector-icons/SimpleLineIcons'
import { useOrder } from '../context/OrderContext'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

import Earnings from '../tabs/Earnings'
import Wallet from 'react-native-vector-icons/SimpleLineIcons'
import Orders from '../tabs/Orders'
import { colors } from '../constants/colors'
import { useSocket } from '../context/sockets'
const Tab = createBottomTabNavigator()

const Dashboard = () => {
    const navigation = useNavigation()
    const { socket } = useSocket();
    console.log("Socket in Dashboard:", socket?.id);

useEffect(() => {
    console.log("Socket in Dashboard useEffect:", socket?.id);
},[socket])


// const initialRoute = route?.params?.screen ?? 'home';
//     useEffect(() => {
//         if (newOrder) {
//             navigation.navigate('order-request'); // Navigate to the popup screen if there's a new order
//         }
//     }, [newOrder]);
    return (
        <Tab.Navigator
        // initialRouteName={initialRoute}
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: "#202020",
                tabBarLabelStyle: {
                    fontFamily: "OpenSans-Medium",
                    fontSize: 12,
                },
                tabBarStyle: {
                    height: 80,
                    paddingBottom: 20,
                    paddingTop: 10
                }
            }}
        >
            <Tab.Screen name='home' component={Home} options={{
                headerShown: false,
                tabBarIcon: ({  color, focused }) => (
                    <View style={{
                        backgroundColor: focused ? "#E8DEF8" : "#fff",
                        height: 32,
                        width: 64,
                        marginHorizontal: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center", borderRadius: 16,
                    }}>
                        <AntDesign name="home" size={20} color={color} />
                    </View>
                )
            }} />
            <Tab.Screen name='earnings' component={Earnings} options={{
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <View style={{
                        backgroundColor: focused ? "#E8DEF8" : "#fff",
                        height: 32,
                        width: 64,
                        marginHorizontal: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center", borderRadius: 16,
                    }}>
                        <Wallet name="wallet" size={20} color={color} />
                    </View>
                )
            }} />
             <Tab.Screen name='Orders' component={Orders} options={{
                headerShown: false,
                tabBarIcon: ({  color, focused }) => (
                    <View style={{
                        backgroundColor: focused ? "#E8DEF8" : "#fff",
                        height: 32,
                        width: 64,
                        marginHorizontal: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center", borderRadius: 16,
                    }}>
                        <Octicons name="basket" size={20} color={color} />
                    </View>
                )
            }} />
             <Tab.Screen name='Profile' component={Account} options={{
                headerShown: false,
                tabBarIcon: ({  color, focused }) => (
                    <View style={{
                        backgroundColor: focused ? "#E8DEF8" : "#fff",
                        height: 32,
                        width: 64,
                        marginHorizontal: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center", borderRadius: 16,
                    }}>
                        <Feather name="user" size={20} color={color} />
                    </View>
                )
            }} />
        </Tab.Navigator>
    )
}

export default Dashboard

const styles = StyleSheet.create({})