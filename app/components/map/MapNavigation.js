import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * @param {null|Object} location
 * @param {function} focusToOverview
 * @param {function} focusToLocation
 * @returns {JSX.Element}
 * @constructor
 */
const MapNavigation = ({location, focusToOverview, focusToLocation}) => {
  return (
    <View className="flex-1 flex-row absolute bottom-2 left-2">
      <Pressable className="p-2 self-center bg-yellow-400 rounded-2xl items-center" onPress={focusToOverview}>
        <Feather name="map" size={40} color="black"/>
      </Pressable>
      <Pressable className={`p-2 self-center ${location === null ? 'bg-gray-300' : 'bg-yellow-400'} rounded-2xl items-center left-2`}
                 onPress={focusToLocation}
                 disabled={location === null}>
        <Feather name="map-pin" size={40} color="black"/>
      </Pressable>
    </View>
  );
};

export default MapNavigation;
