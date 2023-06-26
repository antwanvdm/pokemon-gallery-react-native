import { useContext, useEffect, useRef, useState } from 'react';
import { Text, ActivityIndicator, View, FlatList } from 'react-native';
import PokemonCard from './PokemonCard';
import { AppContext } from '../../utils/context';
import DetailModal from '../detail/DetailModal';
import { applyPokemonFilters } from '../../utils/pokemonData';
import { t } from '../../utils/translator';
import { useScrollToTop } from '@react-navigation/native';

/**
 * @param {Object} filters
 * @param {Object} navigation
 * @returns {JSX.Element}
 * @constructor
 */
const PokemonGallery = ({filters, navigation}) => {
  const listRef = useRef();
  const {theme, language, favorites, setFavorites, pokemonList} = useContext(AppContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pokemonFilteredList, setPokemonFilteredList] = useState([]);
  const [activePokemon, setActivePokemon] = useState(null);

  //Auto scroll to top
  useScrollToTop(listRef);

  //Change load state once Pokémon are available
  useEffect(() => {
    if (pokemonList.length > 0) {
      setIsLoaded(true);
    }
  }, [pokemonList]);

  //If the filters, favorites or Pokémon are changed, we need to update the visible list
  useEffect(() => {
    setPokemonFilteredList(applyPokemonFilters(pokemonList, filters, favorites));
  }, [filters, favorites, pokemonList]);

  //Update the current item for the detail modal
  const shinyClicked = (pokemon) => {
    setActivePokemon(pokemon);
  };
  const handleModalClosed = () => {
    setActivePokemon(null);
  };

  //Navigate to map view with clicked ID
  const mapClicked = (pokemonId) => {
    navigation.navigate('locations', {
      pokemonIds: [pokemonId],
    });
  };

  //Let's update our local favorites when one is clicked
  const favoriteClicked = (isCurrentFavorite, pokemonId) => {
    if (isCurrentFavorite) {
      setFavorites(favorites.filter((id) => id !== pokemonId));
    } else {
      setFavorites((currentFavorites) => [...currentFavorites, pokemonId]);
    }
  };

  const renderPokemonCard = ({item, index}) => {
    return (
      <PokemonCard
        listIndex={index}
        pokemon={item}
        favorite={favorites.includes(item.id)}
        mapClickHandler={mapClicked}
        shinyDetailHandler={shinyClicked}
        favoriteHandler={favoriteClicked}
      />
    );
  };

  //Render the view based on the state of the available data
  if (!isLoaded) {
    return (
      <View className="flex-1 content-center justify-center">
        <ActivityIndicator size="large" color={theme === 'dark' ? '#FFF' : '#000'}/>
        <Text className={`text-center mt-2 ${theme === 'dark' ? 'text-white' : ''}`}>{t('gallery.loading', language)}</Text>
      </View>
    );
  } else {
    return (
      <>
        <FlatList
          ref={listRef}
          data={pokemonFilteredList}
          renderItem={renderPokemonCard}
          numColumns={2}
          keyExtractor={(item) => item.id}
        />
        <DetailModal pokemon={activePokemon} closeCallback={handleModalClosed}/>
      </>
    );
  }
};

export default PokemonGallery;
