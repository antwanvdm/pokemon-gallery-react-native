import { View } from 'react-native';
import DarkModeToggle from '../components/settings/DarkModeToggle';
import ClearStorage from '../components/settings/ClearStorage';
import ForceDownload from '../components/settings/ForceDownload';
import LanguageChange from '../components/settings/LanguageChange';
import NotifyWhenCloseToPokemon from '../components/settings/NotifyWhenCloseToPokemon';
import TestNotification from '../components/settings/TestNotification';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const SettingsScreen = () => {
  return (
    <View className="flex-1 items-center">
      <DarkModeToggle/>
      <NotifyWhenCloseToPokemon/>
      <LanguageChange/>
      <ClearStorage/>
      <ForceDownload/>
      <TestNotification/>
    </View>
  );
};

export default SettingsScreen;
