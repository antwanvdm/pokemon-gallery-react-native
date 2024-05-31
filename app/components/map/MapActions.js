import { Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useContext } from 'react';
import { AppContext } from '../../utils/context';
import { t } from '../../utils/translator';
import * as MediaLibrary from 'expo-media-library';

/**
 * @param {null|Object} location
 * @param {function} focusToOverview
 * @param {function} focusToLocation
 * @param {function} imageCallback
 * @returns {JSX.Element}
 * @constructor
 */
const MapActions = ({location, focusToOverview, focusToLocation, imageCallback}) => {
  const {theme, language, setUserMapPhotos} = useContext(AppContext);

  const pickImage = async () => {
    let permissionCamera = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionCamera.granted) {
      alert(t('locations.cameraDenied', language));
      return;
    }

    const permissionLibrary = await MediaLibrary.requestPermissionsAsync();

    if (!permissionLibrary.granted) {
      alert(t('locations.libraryDenied', language));
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    });

    if (!result.canceled) {
      const album = await MediaLibrary.getAlbumAsync('Pokémon Gallery');
      const asset = await MediaLibrary.createAssetAsync(result.assets[0].uri);
      if (album) {
        //TODO: I actually want to move the asset (third parameter), but this breaks my reference to the whole image.
        await MediaLibrary.addAssetsToAlbumAsync([asset], album);
      } else {
        await MediaLibrary.createAlbumAsync('Pokémon Gallery', asset);
      }
      setUserMapPhotos((currentPhotos) => [...currentPhotos, {id: asset.id, location: location.coords, uri: asset.uri, albumId: asset.albumId}]);
    }
  };

  return (
    <>
      <View className="flex-1 flex-row absolute top-1.5 justify-center w-full gap-1.5">
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500'}`} onPress={focusToOverview}>
          <Feather name="map" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t('locations.iconAllPokemon', language)}</Text>
        </Pressable>
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${location === null ? 'bg-gray-300' : (theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500')}`}
                   onPress={focusToLocation}
                   disabled={location === null}>
          <Feather name="map-pin" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t('locations.iconMyLocation', language)}</Text>
        </Pressable>
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${location === null ? 'bg-gray-300' : (theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500')}`}
                   onPress={pickImage}
                   disabled={location === null}>
          <Feather name="camera" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t('locations.iconTakePhoto', language)}</Text>
        </Pressable>
      </View>
    </>
  );
};

export default MapActions;
