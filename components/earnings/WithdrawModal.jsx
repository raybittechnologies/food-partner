import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import ButtonComp from '../common/ButtonComp'
import { colors } from '../../constants/colors'


const WithdrawModal = ({ visible, onClose, availableBalance = 0, onWithdraw ,loading}) => {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const handleAmountChange = (text) => {
    // allow only numbers and a single decimal point
    const cleaned = text.replace(/[^0-9.]/g, '')
    setAmount(cleaned)
    if (error) setError('')
  }

  const handleWithdraw = () => {
    const numeric = parseFloat(amount)

    if (!amount || isNaN(numeric) || numeric <= 0) {
      setError('Enter a valid amount')
      return
    }
    if (numeric > availableBalance) {
      setError('Amount exceeds available balance')
      return
    }

    onWithdraw?.(numeric)
    setAmount('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setAmount('')
    setError('')
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.card}
            >
              <View style={styles.headerRow}>
                <Text style={styles.title}>Withdraw Earnings</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                  <AntDesign name="close" size={18} color="#666" />
                </TouchableOpacity>
              </View>

              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceValue}>₹{availableBalance.toLocaleString('en-IN')}</Text>

              <View style={styles.inputWrap}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  placeholderTextColor="#bbb"
                  keyboardType="decimal-pad"
                  style={styles.input}
                  autoFocus
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.quickRow}>
                {[0.25, 0.5, 1].map((frac) => (
                  <TouchableOpacity
                    key={frac}
                    style={styles.quickChip}
                    onPress={() => handleAmountChange(String((availableBalance * frac).toFixed(2)))}
                  >
                    <Text style={styles.quickChipText}>
                      {frac === 1 ? 'Max' : `${frac * 100}%`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <ButtonComp
                title="Withdraw"
                bg={colors.primary}
                color="#fff"
                size={16}
                fw="700"
                ff="OpenSans-Bold"
                ta="center"
                height={54}
                mt={16}
                loading={loading}
                onPress={handleWithdraw}
              />
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default WithdrawModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'OpenSans-Regular',
  },
  balanceValue: {
    fontSize: 22,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#111',
    marginTop: 2,
    marginBottom: 18,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 58,
  },
  currencySymbol: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#111',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#111',
    padding: 0,
  },
  errorText: {
    color: '#e0453c',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    marginTop: 8,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  quickChipText: {
    fontSize: 13,
    fontFamily: 'OpenSans-Bold',
    color: colors.primary,
  },
})