import { Text, View } from 'react-native';
import { useContext, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { t } from '../../utils/translator';
import config from '../../config.json';
import { SettingsContext } from '../../utils/context/Settings';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const LanguageChange = () => {
  const {theme, language, setLanguage} = useContext(SettingsContext);
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-row items-center justify-center mt-4">
      <Text className={`pt-2 mr-1.5 ml-4 ${theme === 'dark' ? 'text-white' : ''}`}>{t('settings.language', language)}</Text>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        items={Object.entries(config.languages).map(([key, value]) => {
          return {label: value, value: key};
        })}
        value={language}
        setValue={setLanguage}
        containerStyle={{height: 40, width: 150}}
        zIndex={1000}
        listMode="MODAL"
        theme={theme.toUpperCase()}
      />
    </View>
  );
};

export default LanguageChange;
