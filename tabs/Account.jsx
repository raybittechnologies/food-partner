import { Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import Profile from '../components/account/Profile'



const Account = () => {
    return (
        <ScrollView style={styles.container}>
       
            <Profile />
        </ScrollView>
    )
}

export default Account

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight  : 50,
    }
})