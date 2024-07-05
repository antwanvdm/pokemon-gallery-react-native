import { createContext, useEffect, useState } from 'react';
import { firstAppLoad } from '../pokemonData';
import { checkTableExists, getPokemon, getTypes } from '../database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const AppDataContext = createContext();

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const AppDataContextProvider = ({children}) => {
  const [appId, setAppId] = useState(null);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);

  //Load all the information from async storage
  useEffect(() => {
    (async () => {
      //This is a one way storage of an appId. It will never be removed until uninstall (or clear data) of the app.
      let appId = await AsyncStorage.getItem('appId');
      if (appId === null) {
        appId = uuidv4();
        await AsyncStorage.setItem('appId', appId);
      }
      setAppId(appId);

      //Next up we load the data. Either initial load of webservice or directly from database
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
      appId, dataIsLoaded,
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
