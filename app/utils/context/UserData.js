import { createContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const UserDataContextProvider = ({children}) => {
  const firstUpdate = useRef({favorites: true, catches: true, notes: true, userMapPhotos: true});
  const [favorites, setFavorites] = useState([]);
  const [catches, setCatches] = useState([]);
  const [notes, setNotes] = useState({});
  const [userMapPhotos, setUserMapPhotos] = useState([]);

  //Load all the information from async storage
  useEffect(() => {
    (async () => {
      const lsFavPokemon = await AsyncStorage.getItem('favoritePokemon');
      if (lsFavPokemon !== null) {
        setFavorites(JSON.parse(lsFavPokemon));
      }

      const lsCaughtPokemon = await AsyncStorage.getItem('caughtPokemon');
      if (lsCaughtPokemon !== null) {
        setCatches(JSON.parse(lsCaughtPokemon));
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
  }, []);

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

  //Store catches on change, except the first time!!
  useEffect(() => {
    if (firstUpdate.current.catches) {
      firstUpdate.current.catches = false;
      return;
    }

    (async () => {
      AsyncStorage.setItem('caughtPokemon', JSON.stringify(catches));
    })();
  }, [catches]);

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

  return (
    <UserDataContext.Provider value={{
      favorites, setFavorites,
      catches, setCatches,
      notes, setNotes,
      userMapPhotos, setUserMapPhotos,
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export {
  UserDataContext,
  UserDataContextProvider
};
