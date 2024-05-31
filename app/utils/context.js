import { createContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPokemon, getTypes } from './pokemonData';
import { getLocales } from 'expo-localization';
import NetInfo from '@react-native-community/netinfo';
import { Appearance } from 'react-native';

const AppContext = createContext();

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const AppContextProvider = ({children}) => {
  const firstUpdate = useRef({theme: true, notifications: true, language: true, favorites: true, notes: true, userMapPhotos: true});
  const [isOnline, setIsOnline] = useState(true);
  const [theme, setTheme] = useState(Appearance.getColorScheme() ?? 'light');
  const [notifications, setNotifications] = useState({});
  let locale = getLocales()[0];
  const [language, setLanguage] = useState(locale.languageTag);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonListStoreDate, setPokemonListStoreDate] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState({});
  const [userMapPhotos, setUserMapPhotos] = useState([]);

  //Load all the information from async storage
  useEffect(() => {
    (async () => {
      const currentTheme = await AsyncStorage.getItem('theme');
      if (currentTheme !== null) {
        setTheme(currentTheme);
      }

      const currentNotifications = await AsyncStorage.getItem('notificationSubscriptions');
      if (currentNotifications !== null) {
        setNotifications(JSON.parse(currentNotifications));
      }

      const currentLanguage = await AsyncStorage.getItem('preferredLanguage');
      if (currentLanguage !== null) {
        setLanguage(currentLanguage);
      }

      let lsPokemonStoreDate = await AsyncStorage.getItem('pokemonListStoreDate');
      if (lsPokemonStoreDate !== null) {
        lsPokemonStoreDate = parseInt(lsPokemonStoreDate);
        setPokemonListStoreDate(lsPokemonStoreDate);
      }

      const lsPokemon = await AsyncStorage.getItem('pokemonList');
      if (lsPokemon !== null) {
        setPokemonList(JSON.parse(lsPokemon));
      }

      const lsTypes = await AsyncStorage.getItem('pokemonTypes');
      if (lsTypes === null) {
        const types = await getTypes();
        setPokemonTypes(types);
      } else {
        setPokemonTypes(JSON.parse(lsTypes));
      }

      //Reload all data from API once a week has passed
      if (lsPokemonStoreDate === null || Date.now() > (lsPokemonStoreDate + (1000 * 60 * 60 * 24))) {
        console.log('a week has passed, reload all data please');
        let pokemonList = await getPokemon();
        setPokemonList(pokemonList);
      }

      const lsFavPokemon = await AsyncStorage.getItem('favoritePokemon');
      if (lsFavPokemon !== null) {
        setFavorites(JSON.parse(lsFavPokemon));
      }

      const lsNotesPokemon = await AsyncStorage.getItem('notesPokemon');
      if (lsNotesPokemon !== null) {
        setNotes(JSON.parse(lsNotesPokemon));
      }

      const lsUserMapPhotos = await AsyncStorage.getItem('userMapPhotos');
      if (lsUserMapPhotos !== null) {
        setUserMapPhotos(JSON.parse(lsUserMapPhotos));
      }
    })();

    const unsubscribeNetInfo = NetInfo.addEventListener(state => setIsOnline(state.isConnected));
    return () => unsubscribeNetInfo();
  }, []);

  //Store theme on change, except the first time!!
  useEffect(() => {
    if (firstUpdate.current.theme) {
      firstUpdate.current.theme = false;
      return;
    }

    (async () => {
      AsyncStorage.setItem('theme', theme);
    })();
  }, [theme]);

  //Store notifications on change, except the first time!!
  useEffect(() => {
    if (firstUpdate.current.notifications) {
      firstUpdate.current.notifications = false;
      return;
    }

    (async () => {
      AsyncStorage.setItem('notificationSubscriptions', JSON.stringify(notifications));
    })();
  }, [notifications]);

  //Store language on change, except the first time!!
  useEffect(() => {
    if (firstUpdate.current.language) {
      firstUpdate.current.language = false;
      return;
    }

    (async () => {
      AsyncStorage.setItem('preferredLanguage', language);
    })();
  }, [language]);

  //Store favorites on change, except the first time!!
  useEffect(() => {
    if (firstUpdate.current.favorites) {
      firstUpdate.current.favorites = false;
      return;
    }

    (async () => {
      AsyncStorage.setItem('favoritePokemon', JSON.stringify(favorites));
    })();
  }, [favorites]);

  //Store notes on change, except the first time!!
  useEffect(() => {
    if (firstUpdate.current.notes) {
      firstUpdate.current.notes = false;
      return;
    }

    (async () => {
      AsyncStorage.setItem('notesPokemon', JSON.stringify(notes));
    })();
  }, [notes]);

  //Store userMapPhotos on change, except the first time!!
  useEffect(() => {
    if (firstUpdate.current.userMapPhotos) {
      firstUpdate.current.userMapPhotos = false;
      return;
    }

    (async () => {
      AsyncStorage.setItem('userMapPhotos', JSON.stringify(userMapPhotos));
    })();
  }, [userMapPhotos]);

  //Store pokemonTypes on change
  useEffect(() => {
    (async () => {
      if (pokemonTypes.length > 0) {
        AsyncStorage.setItem('pokemonTypes', JSON.stringify(pokemonTypes));
      }
    })();
  }, [pokemonTypes]);

  //Store pokemonList on change
  useEffect(() => {
    (async () => {
      if (pokemonList.length > 0) {
        console.log('SAVE!!');
        if (Date.now() > (pokemonListStoreDate + (1000 * 60 * 60 * 24))) {
          console.log('SAVE DATE!!');
          AsyncStorage.setItem('pokemonListStoreDate', (Date.now()).toString());
        }
        AsyncStorage.setItem('pokemonList', JSON.stringify(pokemonList));
      }
    })();
  }, [pokemonList]);

  return (
    <AppContext.Provider value={{
      isOnline,
      theme, setTheme,
      notifications, setNotifications,
      language, setLanguage,
      favorites, setFavorites,
      notes, setNotes,
      userMapPhotos, setUserMapPhotos,
      pokemonTypes, setPokemonTypes,
      pokemonList, setPokemonList,
      pokemonListStoreDate, setPokemonListStoreDate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export {
  AppContext,
  AppContextProvider
};
