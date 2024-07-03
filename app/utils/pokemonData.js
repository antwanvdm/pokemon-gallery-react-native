import { addPokemon, addType, createTables } from './database';

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
 * First app load, create DB & load server data into the DB
 *
 * @returns {Promise<void>}
 */
const firstAppLoad = async () => {
  await createTables();

  let loadedTypes = await loadTypes();
  for (const type of loadedTypes) {
    await addType(type);
  }

  let loadedPokemon = await loadPokemon();
  for (const pokemon of loadedPokemon) {
    await addPokemon(pokemon, loadedTypes);
  }
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
  firstAppLoad,
  applyPokemonFilters,
};
