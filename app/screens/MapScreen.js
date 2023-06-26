import PokemonLocations from '../components/map/PokemonLocations';

/**
 * @param {Object} route
 * @returns {JSX.Element}
 * @constructor
 */
const MapScreen = ({route}) => {
  const pokemonIds = route.params?.pokemonIds;
  return (
    <>
      <PokemonLocations pokemonIds={pokemonIds}/>
    </>
  );
};

export default MapScreen;
