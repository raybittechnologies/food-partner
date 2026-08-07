// components/common/ChooseImage.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Entypo from 'react-native-vector-icons/Entypo';

const ChooseImage = ({ imageUri, onSelect }) => {
    
  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        onSelect(uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Upload Profile Picture</Text>
      <View style={styles.box}>
        <Image
          source={imageUri ? { uri: imageUri } : require('../../assets/images/avatar.png')}
          style={styles.image}
        />
        <TouchableOpacity onPress={handlePickImage} style={styles.button}>
          <Entypo name="image" size={20} />
          <Text style={styles.buttonText}>Upload Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseImage;

const styles = StyleSheet.create({
  container: {
    paddingTop: '5%',
  },
  label: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#000000',
  },
  box: {
    backgroundColor: '#fff',
    elevation: 5,
    marginTop: '5%',
    borderRadius: 10,
    padding: '5%',
    borderColor: '#D6D6D6',
    borderWidth: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: '#D6D6D6',
    borderWidth: 1,
    elevation: 5,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
});
