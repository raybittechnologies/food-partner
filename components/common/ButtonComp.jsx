import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
const {width, height} = Dimensions.get('window');
const ButtonComp = ({
  title,
  size,
  color,
  lh,
  ls,
  fw,
  ff,
  maxW,
  ta,
  mv,
  mh,
  lines,
  flex,
  bg,
  el,
  bc,
  bw,
  source,
  onPress,
  icolor,
  isize,
  name,
  loading,
  position,
  bottom,
  right,
  left,
  alignSelf,
  height: customHeight,
  radius,
  mt
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        height: customHeight ?? height * 0.05,
        backgroundColor: bg,
        opacity:loading?0.5:1,
        marginVertical: height * 0.007,
        borderRadius: radius ,
        justifyContent: 'center',
        elevation: el,
        borderWidth: bw,
        borderColor: bc,
        alignItems: 'center',
        flexDirection: 'row',
        position:position,
        bottom:bottom,
        left:left,
        right:right,
        alignSelf: alignSelf,
        marginTop:mt
        
      }}
      activeOpacity={0.7}
      disabled={loading}
      onPress={onPress}>
      {source ? <Image source={source} style={styles.icon} /> : null}
      {name ? <Icon name={name} size={isize} color={icolor} style={styles.icon} /> : null}
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Text
          numberOfLines={lines}
          style={{
            fontSize: size,
            color: color,
            lineHeight: lh,
            letterSpacing: ls,
            fontWeight: fw,
            fontFamily: ff,
            maxWidth: maxW,
            textAlign: ta,
            marginVertical: mv,
            marginHorizontal: mh,
            flex: flex,
          }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonComp;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    left: 10,
    width: 27,
    height: 27,
  },
});