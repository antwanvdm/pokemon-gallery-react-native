import ReactNativeModal from 'react-native-modal';
import { Image, Pressable, Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { t } from '../../utils/translator';
import { useContext } from 'react';
import { AppContext } from '../../utils/context';
import * as MediaLibrary from 'expo-media-library';

const UserPhotoModal = ({userPhoto, closeCallback}) => {
  const {theme, language, userMapPhotos, setUserMapPhotos} = useContext(AppContext);

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
      setUserMapPhotos(userMapPhotos.filter((asset) => asset.id !== userPhoto.id));
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
          <Shadow className="rounded-2xl self-stretch"
                  distance={2}
                  startColor={theme === 'dark' ? '#FFF' : '#000'} offset={[1, 1]}>
            <View className={`rounded-2xl bg-white p-8 items-center shadow-black ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
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
          </Shadow>
        </View>
      ) : (
        <Text>''</Text>
      )}
    </ReactNativeModal>
  );
};

export default UserPhotoModal;
