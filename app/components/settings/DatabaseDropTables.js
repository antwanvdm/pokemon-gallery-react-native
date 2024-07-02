import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useContext, useState } from 'react';
import { t } from '../../utils/translator';
import { dropTables } from '../../utils/database';
import { SettingsContext } from '../../utils/context/Settings';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const DatabaseDropTables = () => {
  const {theme, language} = useContext(SettingsContext);
  const [isLoading, setIsLoading] = useState(false);

  const buttonPressed = async () => {
    setIsLoading(true);
    await dropTables();
    setIsLoading(false);
  };

  return (
    <View className="flex-row items-center mt-4 justify-evenly">
      <Pressable className={`flex-row items-center mt-1 p-3 ${isLoading ? 'bg-gray-300' : 'bg-red-700'} rounded-2xl`}
                 onPress={buttonPressed}
                 disabled={isLoading}>
        <Text className="text-white text-center font-bold">{t('settings.dropTables', language)}</Text>
        {isLoading ?
          <ActivityIndicator className="ml-2" size="small" color={theme === 'dark' ? '#FFF' : '#000'}/>
          : ''}
      </Pressable>
    </View>
  );
};

export default DatabaseDropTables;
