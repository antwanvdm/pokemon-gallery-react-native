/**
 * Retrieve all Pokémon from the API
 *
 * @returns {Promise<*[]>}
 */
const getPokemon = async () => {
  const result = await fetch('https://pokeapi.co/api/v2/pokemon?limit=251');
  const data = await result.json();

  let pokemonList = [];
  for (let pokemonData of data.results) {
    const detailResult = await fetch(pokemonData.url);
    const pokemon = await detailResult.json();
    const speciesDetailResult = await fetch(pokemon.species.url);
    const pokemonSpecies = await speciesDetailResult.json();
    pokemonList.push({
      id: pokemon.id,
      name: pokemon.name,
      images: {
        default: pokemon.sprites.other.home.front_default,
        shiny: pokemon.sprites.other.home.front_shiny,
        thumb: pokemon.sprites.front_default
      },
      types: pokemon.types,
      coordinate: getCoordinateForPokemon(),
      names: {
        'en': pokemonSpecies.names.find((specieName) => specieName.language.name === 'en').name,
        'ja-JP': pokemonSpecies.names.find((specieName) => specieName.language.name === 'ja').name,
        'fr-FR': pokemonSpecies.names.find((specieName) => specieName.language.name === 'fr').name,
        'es-ES': pokemonSpecies.names.find((specieName) => specieName.language.name === 'es').name,
        'de-DE': pokemonSpecies.names.find((specieName) => specieName.language.name === 'de').name,
        'it-IT': pokemonSpecies.names.find((specieName) => specieName.language.name === 'it').name,
        'zh-CN': pokemonSpecies.names.find((specieName) => specieName.language.name === 'zh-Hans').name
      }
    });
  }
  return pokemonList;
};

/**
 * Generate random coordinates within Rotterdam area
 *
 * @returns {{latitude: number, longitude: number}}
 */
const getCoordinateForPokemon = () => {
  const latMin = 51.91057747964108,
    latRange = 51.93075387486564 - latMin,
    lngMin = 4.461598512753685,
    lngRange = 4.509471127967214 - lngMin;

  return {
    latitude: latMin + (Math.random() * latRange),
    longitude: lngMin + (Math.random() * lngRange)
  };
};

/**
 * Get types from the Pokémon API
 *
 * @returns {Promise<*>}
 */
const getTypes = async () => {
  const result = await fetch('https://pokeapi.co/api/v2/type?limit=18');
  const data = await result.json();

  let types = [];
  for (let type of data.results) {
    const typeResult = await fetch(type.url);
    const typeData = await typeResult.json();

    types.push({
      name: type.name,
      names: {
        'en': typeData.names.find((typeName) => typeName.language.name === 'en').name,
        'ja-JP': typeData.names.find((typeName) => typeName.language.name === 'ja').name,
        'fr-FR': typeData.names.find((typeName) => typeName.language.name === 'fr').name,
        'es-ES': typeData.names.find((typeName) => typeName.language.name === 'es').name,
        'de-DE': typeData.names.find((typeName) => typeName.language.name === 'de').name,
        'it-IT': typeData.names.find((typeName) => typeName.language.name === 'it').name,
        'zh-CN': typeData.names.find((typeName) => typeName.language.name === 'zh-Hans').name
      }
    });
  }

  return types.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Combines all filters with Pokémon information to show relevant data
 *
 * @param pokemonList
 * @param filters
 * @param favorites
 * @returns {*}
 */
const applyPokemonFilters = (pokemonList, filters, favorites) => {
  return pokemonList.filter((pokemon) => {
    if (filters.favorites && filters.type === 'all') {
      return favorites.includes(pokemon.id);
    } else if (!filters.favorites && filters.type !== 'all') {
      return pokemon.types
        .map((type) => type.type.name)
        .includes(filters.type);
    } else if (filters.favorites && filters.type !== 'all') {
      return (
        favorites.includes(pokemon.id) &&
        pokemon.types.map((type) => type.type.name).includes(filters.type)
      );
    }
    return true;
  });
};

export {
  getPokemon,
  getTypes,
  applyPokemonFilters,
};
