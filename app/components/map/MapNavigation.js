import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useContext } from 'react';
import { AppContext } from '../../utils/context';
import { t } from '../../utils/translator';

/**
 * @param {null|Object} location
 * @param {function} focusToOverview
 * @param {function} focusToLocation
 * @returns {JSX.Element}
 * @constructor
 */
const MapNavigation = ({location, focusToOverview, focusToLocation}) => {
  const {theme, language} = useContext(AppContext);

  return (
    <>
      <View className="flex-1 flex-row absolute top-1.5 justify-center w-full gap-1.5">
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500'}`} onPress={focusToOverview}>
          <Feather name="map" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t('locations.iconAllPokemon', language)}</Text>
        </Pressable>
        <Pressable className={`p-2 self-center rounded-2xl items-center flex-row ${location === null ? 'bg-gray-300' : (theme === 'dark' ? 'bg-gray-50' : 'bg-gray-500')}`}
                   onPress={focusToLocation}
                   disabled={location === null}>
          <Feather name="map-pin" size={18} color={theme === 'dark' ? 'black' : 'white'}/>
          <Text className={`ml-1.5 font-bold ${theme === 'dark' ? 'text-black' : 'text-white'}`}>{t('locations.iconMyLocation', language)}</Text>
        </Pressable>
      </View>
    </>
  );
};

export default MapNavigation;
