/**
 * Retrieve all Pokémon from the webservice
 *
 * @returns {Promise<*[]>}
 */
const loadPokemon = async () => {
  const result = await fetch('https://adventure-go.antwan.eu/api/pokemon-list/get');
  return await result.json();
};

/**
 * Retrieve all types from the webservice
 *
 * @returns {Promise<*>}
 */
const loadTypes = async () => {
  const result = await fetch('https://adventure-go.antwan.eu/api/pokemon-types/get');
  return await result.json();
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
      return pokemon.types.includes(filters.type);
    } else if (filters.favorites && filters.type !== 'all') {
      return (
        favorites.includes(pokemon.id) &&
        pokemon.types.includes(filters.type)
      );
    }
    return true;
  });
};

export {
  loadPokemon,
  loadTypes,
  applyPokemonFilters,
};
