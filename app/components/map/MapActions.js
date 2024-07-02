import { Pressable, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { t } from '../../utils/translator';
import * as MediaLibrary from 'expo-media-library';
import { SettingsContext } from '../../utils/context/Settings';
import { UserDataContext } from '../../utils/context/UserData';

/**
 * @param {null|Object} location
 * @param {function} focusToOverview
 * @param {function} focusToLocation
 * @param {boolean} showPokemon
 * @param {boolean} showPhotos
 * @param {function} togglePokemon
 * @param {function} togglePhotos
 * @returns {JSX.Element}
 * @constructor
 */
const MapActions = ({location, focusToOverview, focusToLocation, showPokemon, showPhotos, togglePokemon, togglePhotos}) => {
  const {setUserMapPhotos} = useContext(UserDataContext);
  const {theme, language} = useContext(SettingsContext);

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
    <ScrollView horizontal={true} className="max-w-full absolute top-1.5 flex-1">
      <View className="flex-1 flex-row justify-center gap-1.5 px-1.5">
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500'}`} onPress={focusToOverview}>
          <MaterialCommunityIcons name="pokemon-go" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t('locations.iconAllPokemon', language)}</Text>
        </Pressable>
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${location === null ? 'bg-gray-300' : (theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500')}`}
                   onPress={focusToLocation}
                   disabled={location === null}>
          <MaterialIcons name="my-location" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t('locations.iconMyLocation', language)}</Text>
        </Pressable>
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${location === null ? 'bg-gray-300' : (theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500')}`}
                   onPress={pickImage}
                   disabled={location === null}>
          <Feather name="camera" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t('locations.iconTakePhoto', language)}</Text>
        </Pressable>
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500'}`} onPress={togglePokemon}>
          <MaterialIcons name="catching-pokemon" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t(`locations.${showPokemon ? 'iconPokemonHide' : 'iconPokemonShow'}`, language)}</Text>
        </Pressable>
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500'}`} onPress={togglePhotos}>
          <FontAwesome6 name="camera-rotate" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t(`locations.${showPhotos ? 'iconPhotosHide' : 'iconPhotosShow'}`, language)}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default MapActions;
