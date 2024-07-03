import { createContext, useEffect, useState } from 'react';
import { firstAppLoad } from '../pokemonData';
import { checkTableExists, getPokemon, getTypes } from '../database';

const AppDataContext = createContext();

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const AppDataContextProvider = ({children}) => {
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);

  //Load all the information from async storage
  useEffect(() => {
    (async () => {
      if ((await checkTableExists('pokemon')) === false && (await checkTableExists('types')) === false) {
        await firstAppLoad();
      }

      let typesList = await getTypes();
      setPokemonTypes(typesList);

      let pokemonList = await getPokemon();
      setPokemonList(pokemonList);
      setDataIsLoaded(true);
    })();
  }, []);

  return (
    <AppDataContext.Provider value={{
      dataIsLoaded,
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
