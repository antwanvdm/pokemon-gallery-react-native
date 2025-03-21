import Animated, { ZoomIn, ZoomInRotate } from 'react-native-reanimated';
import { memo, useContext, useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { UserDataContext } from '../../utils/context/UserData';
import { SettingsContext } from '../../utils/context/Settings';

/**
 * @param {Object} pokemon
 * @param {boolean} favorite
 * @param {function} shinyDetailHandler
 * @param {function} favoriteHandler
 * @param {number} listIndex
 * @returns {JSX.Element}
 * @constructor
 */
const PokemonCard = ({pokemon, favorite, shinyDetailHandler, favoriteHandler, listIndex}) => {
  //Set state variables
  const {favorites} = useContext(UserDataContext);
  const {theme, language} = useContext(SettingsContext);
  const [isFavorite, setIsFavorite] = useState(favorite);

  //Update favorite state on card if it changes
  useEffect(() => {
    setIsFavorite(favorites.includes(pokemon.id));
  }, [favorites]);

  //Handle the clicks on buttons
  const shinyClick = () => shinyDetailHandler(pokemon);
  const favoriteClick = () => {
    favoriteHandler(isFavorite, pokemon.id);
    setIsFavorite(!isFavorite);
  };

  const enterZoomInRotate = (duration, delay) => listIndex < 11 ? ZoomInRotate.duration(duration).delay(delay + (listIndex * 150)) : null;
  const enterZoomIn = (duration, delay) => listIndex < 11 ? ZoomIn.duration(duration).delay(delay + (listIndex * 150)) : null;

  return (
    <Animated.View className="w-1/2 p-1.5" entering={enterZoomInRotate(500, 200)}>
      <View className={`rounded-2xl border p-1 text-center ${theme === 'dark' ? 'bg-gray-800 border-white' : 'bg-white border-black'}`}>
        <Text className={`text-xl font-bold text-center mt-3.5 ${isFavorite ? 'text-orange-700' : theme === 'dark' ? 'text-white' : ''}`}>
          {pokemon.names[language] ?? pokemon.names['en']} (#{pokemon.id})
        </Text>
        <Animated.Image
          source={{uri: pokemon.image_default}}
          className="mb-1.5 self-center"
          style={{width: 150, height: 150}}
          entering={enterZoomInRotate(500, 500)}
        />
        <View className="flex-row justify-center my-1.5">
          <Animated.View className="flex-1 ml-1.5 p-3 bg-blue-400 rounded-2xl items-center" entering={enterZoomIn(250, 700)}>
            <Pressable onPress={shinyClick}>
              <Feather name="zap" size={24} color="black"/>
            </Pressable>
          </Animated.View>
          <Animated.View className={`flex-1 mx-1.5 p-3 bg-green-700 rounded-2xl items-center ${isFavorite ? 'bg-orange-700' : ''}`} entering={enterZoomIn(250, 900)}>
            <Pressable onPress={favoriteClick}>
              <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={24} color="white"/>
            </Pressable>
          </Animated.View>
        </View>
      </View>
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
