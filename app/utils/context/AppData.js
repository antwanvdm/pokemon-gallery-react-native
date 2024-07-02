import { createContext, useEffect, useState } from 'react';
import { loadPokemon, loadTypes } from '../pokemonData';
import { addPokemon, addType, checkTableExists, createTables, getPokemon, getTypes } from '../database';

const AppDataContext = createContext();

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const AppDataContextProvider = ({children}) => {
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);

  //Load all the information from async storage
  useEffect(() => {
    (async () => {
      //TODO move this???
      if ((await checkTableExists('pokemon')) === false && (await checkTableExists('types')) === false) {
        await createTables();

        let loadedTypes = await loadTypes();
        for (const type of loadedTypes) {
          await addType(type);
        }

        let loadedPokemon = await loadPokemon();
        for (const pokemon of loadedPokemon) {
          await addPokemon(pokemon);
        }
      }

      let typesList = await getTypes();
      setPokemonTypes(typesList);

      let pokemonList = await getPokemon();
      setPokemonList(pokemonList);
    })();
  }, []);

  return (
    <AppDataContext.Provider value={{
      pokemonTypes, setPokemonTypes,
      pokemonList, setPokemonList
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export {
  AppDataContext,
  AppDataContextProvider
};
