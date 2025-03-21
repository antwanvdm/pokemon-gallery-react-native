import ReactNativeModal from 'react-native-modal';
import { Image, Pressable, Text, View } from 'react-native';
import { t } from '../../utils/translator';
import { useContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { SettingsContext } from '../../utils/context/Settings';
import { UserDataContext } from '../../utils/context/UserData';

const UserPhotoModal = ({userPhoto, onDelete, closeCallback}) => {
  const {userMapPhotos, setUserMapPhotos} = useContext(UserDataContext);
  const {theme, language} = useContext(SettingsContext);

  /**
   * TODO: Monitor expo go documentation/issues as image still is not actually removed from device (and gets backup on Google Photos..)
   * TODO: Deleting the actual asset also doesn't help/work.
   * @returns {Promise<void>}
   */
  const removeAsset = async () => {
    const albumAssetRemoval = await MediaLibrary.removeAssetsFromAlbumAsync([userPhoto.id], userPhoto.albumId);
    // const assetRemoval = await MediaLibrary.deleteAssetsAsync([userPhoto.id]);
    console.log(albumAssetRemoval);
    // console.log(assetRemoval);
    if (albumAssetRemoval) {
      setUserMapPhotos((currentPhotos) => currentPhotos.filter((asset) => asset.id !== userPhoto.id));
      onDelete(userPhoto.id);
      closeCallback();
    }
  };

  return (
    <ReactNativeModal
      animationType="slide"
      backdropOpacity={0.85}
      backdropColor={theme === 'dark' ? '#000' : '#FFF'}
      isVisible={userPhoto !== null}
      onBackdropPress={closeCallback}
      onRequestClose={closeCallback}
    >
      {userPhoto ? (
        <View className="flex-1 justify-center items-center">
            <View className={`w-9/12 rounded-2xl border p-8 items-center shadow-black ${theme === 'dark' ? 'bg-gray-800 text-white border-white' : 'bg-white text-black border-gray-800'}`}>
              <Image
                source={{uri: userPhoto.uri}}
                style={{width: 200, height: 260}}
              />
              <Pressable className={`w-full mt-4 p-3 bg-red-600 rounded-2xl`} onPress={removeAsset}>
                <Text className="text-white text-center font-bold">{t('locations.deletePhoto', language)}</Text>
              </Pressable>
              <Pressable className="w-full mt-1.5 p-3 bg-blue-400 rounded-2xl" onPress={closeCallback}>
                <Text className="text-white text-center font-bold">{t('detailModal.close', language)}</Text>
              </Pressable>
            </View>
        </View>
      ) : (
        <Text>''</Text>
      )}
    </ReactNativeModal>
  );
};

export default UserPhotoModal;
