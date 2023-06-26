import Animated, { ZoomIn, ZoomInRotate } from 'react-native-reanimated';
import { memo, useContext, useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { AppContext } from '../../utils/context';
import { Shadow } from 'react-native-shadow-2';
import { Feather, MaterialIcons } from '@expo/vector-icons';

/**
 * @param {Object} pokemon
 * @param {boolean} favorite
 * @param {function} mapClickHandler
 * @param {function} shinyDetailHandler
 * @param {function} favoriteHandler
 * @param {number} listIndex
 * @returns {JSX.Element}
 * @constructor
 */
const PokemonCard = ({pokemon, favorite, mapClickHandler, shinyDetailHandler, favoriteHandler, listIndex}) => {
  //Set state variables
  const {theme, language, favorites, isOnline} = useContext(AppContext);
  const [isFavorite, setIsFavorite] = useState(favorite);

  //Update favorite state on card if it changes
  useEffect(() => {
    setIsFavorite(favorites.includes(pokemon.id));
  }, [favorites]);

  //Handle the clicks on buttons
  const mapClick = () => mapClickHandler(pokemon.id);
  const shinyClick = () => shinyDetailHandler(pokemon);
  const favoriteClick = () => {
    favoriteHandler(isFavorite, pokemon.id);
    setIsFavorite(!isFavorite);
  };

  const enterZoomInRotate = (duration, delay) => listIndex < 11 ? ZoomInRotate.duration(duration).delay(delay + (listIndex * 150)) : null;
  const enterZoomIn = (duration, delay) => listIndex < 11 ? ZoomIn.duration(duration).delay(delay + (listIndex * 150)) : null;

  return (
    <Animated.View className="w-1/2 p-1.5" entering={enterZoomInRotate(500, 200)}>
      <Shadow className="rounded-2xl self-stretch"
              distance={2}
              startColor={theme === 'dark' ? '#FFF' : '#000'} offset={[1, 1]}>
        <View className={`rounded-2xl text-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <Text className={`text-xl font-bold text-center mt-3.5 ${isFavorite ? 'text-orange-700' : theme === 'dark' ? 'text-white' : ''}`}>
            {pokemon.names[language] ?? pokemon.names['en']} (#{pokemon.id})
          </Text>
          <Animated.Image
            source={{uri: pokemon.images.default}}
            className="mb-1.5 self-center"
            style={{width: 150, height: 150}}
            entering={enterZoomInRotate(500, 500)}
          />
          <View className="flex-row justify-center my-1.5">
            <Animated.View className={`flex-1 mx-1.5 p-3 ${!isOnline ? 'bg-gray-300' : 'bg-yellow-400'} rounded-2xl items-center`} entering={enterZoomIn(250, 700)}>
              <Pressable onPress={mapClick} disabled={!isOnline}>
                <Feather name="map-pin" size={24} color="black"/>
              </Pressable>
            </Animated.View>
            <Animated.View className="flex-1 p-3 bg-blue-400 rounded-2xl items-center" entering={enterZoomIn(250, 900)}>
              <Pressable onPress={shinyClick}>
                <Feather name="zap" size={24} color="black"/>
              </Pressable>
            </Animated.View>
            <Animated.View className={`flex-1 mx-1.5 p-3 bg-green-700 rounded-2xl items-center ${isFavorite ? 'bg-orange-700' : ''}`} entering={enterZoomIn(250, 1100)}>
              <Pressable onPress={favoriteClick}>
                <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={24} color="white"/>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </Shadow>
    </Animated.View>
  );
};

function areEqual(prevProps, {favorite}) {
  return prevProps.favorite === favorite;
}

//React.memo offers me a way to compare old and new state.
//Component will only re-render if something changed. This is helpful
//because PokemonCard is part of a FlatList which re-renders when state in
//parent component changes. By comparing the only relevant prop (favorite)
//I prevent 250 useless re-renders.
export default memo(PokemonCard, areEqual);
