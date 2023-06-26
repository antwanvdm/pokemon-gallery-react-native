import { Switch, Text, View } from 'react-native';
import { useContext, useState } from 'react';
import { AppContext } from '../../utils/context';
import { t } from '../../utils/translator';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const DarkModeToggle = () => {
  const {theme, setTheme, language} = useContext(AppContext);
  const [isEnabled, setIsEnabled] = useState(theme === 'dark');

  //Simple call to the change handler to overwrite active theme in context
  const toggleSwitch = (status) => {
    setIsEnabled(status);
    setTheme(status ? 'dark' : 'light');
  };

  return (
    <View className="flex-row items-center mt-6">
      <Text className={`mr-1.5 ml-4 ${theme === 'dark' ? 'text-white' : ''}`}>{t('settings.darkMode', language)}</Text>
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

export default DarkModeToggle;
