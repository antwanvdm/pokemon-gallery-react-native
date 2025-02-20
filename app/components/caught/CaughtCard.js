import Animated, { ZoomIn, ZoomInRotate } from 'react-native-reanimated';
import { useContext } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { OnlineContext } from '../../utils/context/Online';
import { SettingsContext } from '../../utils/context/Settings';
import { AppDataContext } from '../../utils/context/AppData';
import { dateFormatted } from '../../utils/strings';

/**
 * @param {Object} pokemon
 * @param {function} mapClickHandler
 * @param {number} listIndex
 * @returns {JSX.Element}
 * @constructor
 */
const CaughtCard = ({caughtPokemon, mapClickHandler, listIndex}) => {
  //Set state variables
  const {pokemonList} = useContext(AppDataContext);
  const {isOnline} = useContext(OnlineContext);
  const {theme} = useContext(SettingsContext);

  //Handle the click on button
  const mapClick = () => mapClickHandler(caughtPokemon);

  const enterZoomInRotate = (duration, delay) => listIndex < 35 ? ZoomInRotate.duration(duration).delay(delay + (listIndex * 30)) : null;
  const enterZoomIn = (duration, delay) => listIndex < 35 ? ZoomIn.duration(duration).delay(delay + (listIndex * 30)) : null;

  return (
    <Animated.View className={`w-1/2 p-1.5 ${!isOnline ? 'bg-gray-300' : ''}`} entering={enterZoomInRotate(300, 100)}>
      <Pressable onPress={mapClick} disabled={!isOnline}>
        <View className={`rounded-2xl border text-center ${theme === 'dark' ? 'bg-gray-800 border-white' : 'bg-white border-gray-800'}`}>
          <View className="flex-row justify-around py-1">
            <Animated.Image
              source={{uri: pokemonList.find((p) => p.id === caughtPokemon.id).image_default}}
              className="self-center items-center"
              style={{width: 30, height: 30}}
              entering={enterZoomIn(200, 400)}
            />
            <Animated.View className={`self-center items-center`} entering={enterZoomIn(200, 600)}>
              <Text className={`${theme === 'dark' ? 'text-white' : 'text-black'}`}>{dateFormatted(caughtPokemon.date)}</Text>
            </Animated.View>
            <Animated.View className={`self-center items-center`} entering={enterZoomIn(200, 800)}>
              <Feather name="map-pin" size={24} color={theme === 'dark' ? 'white' : 'black'}/>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default CaughtCard;
