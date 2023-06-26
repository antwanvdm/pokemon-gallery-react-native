import { Text, View, Image, Pressable } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { AppContext } from '../../utils/context';
import { useContext, useEffect, useState } from 'react';
import { Shadow } from 'react-native-shadow-2';
import { t } from '../../utils/translator';
import PokemonNotes from './PokemonNotes';

/**
 * @param {Object} pokemon
 * @param {function} closeCallback
 * @returns {JSX.Element}
 * @constructor
 */
const DetailModal = ({pokemon, closeCallback}) => {
  const {theme, language, favorites, setFavorites} = useContext(AppContext);
  const [isFavorite, setIsFavorite] = useState(favorites.includes(pokemon?.id));
  const [isOpen, setIsOpen] = useState(false);

  //If we get notified with a Pokémon change, we need a re-render
  useEffect(() => {
    setIsFavorite(favorites.includes(pokemon?.id));
    setIsOpen(pokemon !== null);
  }, [pokemon]);

  //Let's update our local favorites when one is clicked
  const favoritePressed = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== pokemon.id));
      setIsFavorite(false);
    } else {
      setFavorites((currentFavorites) => [...currentFavorites, pokemon.id]);
      setIsFavorite(true);
    }
  };

  const onClose = () => {
    setIsOpen(false);
    closeCallback();
  };

  return (
    <ReactNativeModal
      animationType="slide"
      backdropOpacity={0.85}
      backdropColor={theme === 'dark' ? '#000' : '#FFF'}
      isVisible={pokemon !== null}
      onBackdropPress={onClose}
      onRequestClose={onClose}
    >
      {pokemon ? (
        <View className="flex-1 justify-center items-center">
          <Shadow className="rounded-2xl self-stretch"
                  distance={2}
                  startColor={theme === 'dark' ? '#FFF' : '#000'} offset={[1, 1]}>
            <View className={`rounded-2xl bg-white p-8 items-center shadow-black ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <Text className={`text-xl font-bold text-center ${isFavorite ? 'text-orange-700' : theme === 'dark' ? 'text-white' : ''}`}>
                {pokemon.names[language] ?? pokemon.names['en']} (#{pokemon.id})
              </Text>
              <Image
                source={{uri: pokemon.images.shiny}}
                style={{width: 180, height: 180}}
              />
              <Pressable className={`w-full mt-4 p-3 bg-green-700 rounded-2xl ${isFavorite ? 'bg-orange-700' : ''}`} onPress={favoritePressed}>
                <Text className="text-white text-center font-bold">{isFavorite ? t('detailModal.removeFavorite', language) : t('detailModal.addFavorite', language)}</Text>
              </Pressable>
              <PokemonNotes isOpen={isOpen} pokemonId={pokemon.id}/>
              <Pressable className="w-full mt-1.5 p-3 bg-blue-400 rounded-2xl" onPress={closeCallback}>
                <Text className="text-white text-center font-bold">{t('detailModal.close', language)}</Text>
              </Pressable>
            </View>
          </Shadow>
        </View>
      ) : (
        <Text>''</Text>
      )}
    </ReactNativeModal>
  );
};

export default DetailModal;
