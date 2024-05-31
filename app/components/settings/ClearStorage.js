import { Alert, Pressable, Text, View } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../../utils/context';
import { t } from '../../utils/translator';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const ClearStorage = () => {
  const {language, setFavorites, setPokemonListStoreDate, setNotes, setUserMapPhotos} = useContext(AppContext);

  //Bye data!
  const clearAll = () => {
    setPokemonListStoreDate(0);
    setFavorites([]);
    setNotes({});
    setUserMapPhotos([]);
    Alert.alert(t('settings.clear', language), t('settings.clearSuccess', language));
  };

  //Ask the client if they are sure they want to remove all settings/data
  const buttonPressed = (status) => {
    Alert.alert(t('settings.clear', language), t('settings.clearAreYouSure', language), [
      {
        text: t('settings.clearYes', language),
        onPress: clearAll,
      },
      {
        text: t('settings.clearNo', language),
        style: 'cancel',
      },
    ]);
  };

  return (
    <View className="flex-row items-center mt-6">
      <Pressable className="mt-1 p-3 bg-red-700 rounded-2xl" onPress={buttonPressed}>
        <Text className="text-white text-center font-bold">{t('settings.clear', language)}</Text>
      </Pressable>
    </View>
  );
};

export default ClearStorage;
