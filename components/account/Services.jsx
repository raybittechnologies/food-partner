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
import { colors } from '../../constants/colors'

// Same tokens as Profile.jsx — keep in sync if either file's palette changes.
const COLORS = {
  ink: '#14171F',
  paper: '#F5F6F8',
  card: '#FFFFFF',
  brand: '#FA4A0C',
  brandTint: '#FFF1EA',
  text: '#14171F',
  subtext: '#7A7F8A',
  divider: '#EDEEF1',
  rejected: '#D3392F',
  rejectedTint: '#FDEAE9',
}

const Services = ({ user }) => {
  const navigation = useNavigation()
  const [isModalVisible, setModalVisible] = useState(false)
  const dispatch = useDispatch()
  const toggleModal = () => setModalVisible(!isModalVisible)

  const handleLogout = () => {
    toggleModal()
    console.log('Logged out')
    dispatch(setUser(null))
    dispatch(setisAuthenticated(false))
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.sectionCard}>
        {data.map((item, index) => {
          const isLogout = item.title === 'Logout'
          return (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.item}
                activeOpacity={0.6}
                onPress={() => {
                  if (isLogout) {
                    toggleModal()
                  } else {
                    // Pass the current user through to whichever screen we're
                    // navigating to (e.g. Edit Profile) so it can prefill fields.
                    navigation.navigate(item.screen, { user })
                  }
                }}
              >
                <View style={styles.left}>
                  <View style={styles.iconWrap}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={isLogout ? COLORS.rejected : colors.primary}
                    />
                  </View>
                  <Text style={[styles.title, isLogout && styles.titleDanger]}>
                    {item.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.subtext} />
              </TouchableOpacity>
              {index < data.length - 1 && <View style={styles.rowDivider} />}
            </View>
          )
        })}
      </View>

      {/* Logout confirmation */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalIconWrap}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.rejected} />
          </View>
          <Text style={styles.modalTitle}>Log out?</Text>
          <Text style={styles.modalSubtitle}>
            You'll need to sign in again to receive new orders.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleModal} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Services

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'OpenSans-Medium',
    color: COLORS.subtext,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontFamily: 'OpenSans-Medium',
    color: COLORS.text,
  },
  titleDanger: {
    color: COLORS.rejected,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.rejectedTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: 'OpenSans-Bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: COLORS.paper,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: COLORS.rejected,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontFamily: 'OpenSans-Medium',
    color: COLORS.text,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: 'OpenSans-Medium',
    color: '#fff',
  },
})