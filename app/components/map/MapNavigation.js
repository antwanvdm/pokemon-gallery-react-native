import { Pressable, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

/**
 * @param {null|Object} location
 * @param {function} focusToOverview
 * @param {function} focusToLocation
 * @returns {JSX.Element}
 * @constructor
 */
const MapNavigation = ({location, focusToOverview, focusToLocation, hasRoute}) => {
  return (
    <>
      <View className="flex-1 flex-row absolute bottom-2 left-2">
        <Pressable className="p-2 self-center bg-yellow-400 rounded-2xl items-center" onPress={focusToOverview}>
          <Feather name="map" size={40} color="black"/>
        </Pressable>
        <Pressable className={`p-2 self-center ${location === null ? 'bg-gray-300' : 'bg-yellow-400'} rounded-2xl items-center m-2`}
                   onPress={focusToLocation}
                   disabled={location === null}>
          <Feather name="map-pin" size={40} color="black"/>
        </Pressable>
      </View>
      {hasRoute ? (
        <View className="flex-1 flex-row absolute bottom-2 right-2">
          <Pressable className="p-2 self-center bg-red-600 rounded-2xl items-center" onPress={() => focusToOverview(true)}>
            <MaterialIcons name="route" size={40} color="white"/>
          </Pressable>
        </View>
      ) : <></>}
    </>
  );
};

export default MapNavigation;
