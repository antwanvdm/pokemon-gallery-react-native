import { Alert, Pressable, Text, View } from 'react-native';
import { useContext } from 'react';
import { t } from '../../utils/translator';
import { SettingsContext } from '../../utils/context/Settings';
import { UserDataContext } from '../../utils/context/UserData';
import { AppDataContext } from '../../utils/context/AppData';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const ClearStorage = () => {
  const {setFavorites, setCatches, setNotes, setUserMapPhotos} = useContext(UserDataContext);
  const {language} = useContext(SettingsContext);

  //Bye data!
  const clearAll = () => {
    setFavorites([]);
    setCatches([]);
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
    <View className="w-9/12 flex-row items-center mt-6">
      <Pressable className="w-full mt-1 p-3 bg-red-700 rounded-2xl" onPress={buttonPressed}>
        <Text className="text-white text-center font-bold">{t('settings.clear', language)}</Text>
      </Pressable>
    </View>
  );
};

export default ClearStorage;
