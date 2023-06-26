import { Switch, Text, View } from 'react-native';
import { useContext, useState } from 'react';
import { AppContext } from '../../utils/context';
import { t } from '../../utils/translator';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const NotifyWhenCloseToPokemon = () => {
  const {theme, notifications, setNotifications, language} = useContext(AppContext);
  const [isEnabled, setIsEnabled] = useState(notifications?.allClosePokemon || false);

  //Simple call to the change handler to overwrite notification setting in context
  const toggleSwitch = (status) => {
    setIsEnabled(status);
    setNotifications({...notifications, allClosePokemon: status});
  };

  return (
    <View className="flex-row items-center mt-2">
      <Text className={`mr-1.5 ml-4 ${theme === 'dark' ? 'text-white' : ''}`}>{t('settings.notifyPokemon', language)}</Text>
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default NotifyWhenCloseToPokemon;
