// hooks/useImagePicker.js
import { launchImageLibrary } from 'react-native-image-picker';

const useImagePicker = () => {
  const pickImage = async (onSuccess) => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        onSuccess(uri);
      }
    });
  };

  return pickImage;
};

export default useImagePicker;
