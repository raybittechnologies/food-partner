import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { data } from '../../static/Data'
import Modal from 'react-native-modal'
import { useDispatch } from 'react-redux'
import { setisAuthenticated, setUser } from '../../redux/authSlice'

const Services = () => {
  const navigation = useNavigation()
  const [isModalVisible, setModalVisible] = useState(false)
const dispatch = useDispatch()
  const toggleModal = () => setModalVisible(!isModalVisible)

  const handleLogout = () => {
    toggleModal()
    // Perform logout logic here (e.g., clear Redux/auth state, navigate to login)
    console.log('Logged out')
    dispatch(setUser(null))
     dispatch(setisAuthenticated(false))
  }

  return (
    <View style={styles.container}>
      {data.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => {
            if (item.title === 'Logout') {
              toggleModal()
            } else {
              navigation.navigate(item.screen)
            }
          }}
        >
          <View style={styles.left}>
            <Ionicons name={item.icon} size={24} color="#333" />
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      ))}

      {/* Logout Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Services

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#FA4A0C',
    padding: 12,
    borderRadius: 5,
    flex: 1,
  },
  cancelText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: '600',
  },
  logoutText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
})
