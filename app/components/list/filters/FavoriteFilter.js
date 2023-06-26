import { useContext, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { AppContext } from '../../../utils/context';
import { t } from '../../../utils/translator';

/**
 * @param {function} onChange
 * @param {boolean} status
 * @returns {JSX.Element}
 * @constructor
 */
const FavoriteFilter = ({onChange, status}) => {
  const {theme, language} = useContext(AppContext);
  const [isEnabled, setIsEnabled] = useState(status);

  //Simple call to the change handler
  const toggleSwitch = (status) => {
    setIsEnabled(status);
    onChange('favorites', status);
  };

  return (
    <View className="flex-row items-center">
      <Text className={`mr-1 ${theme === 'dark' ? 'text-white' : ''}`}>{t('gallery.filters.showFavorites', language)}</Text>
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

export default FavoriteFilter;
