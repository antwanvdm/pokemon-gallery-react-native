import { createContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDataContext = createContext();

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const UserDataContextProvider = ({children}) => {
  const firstUpdate = useRef({favorites: true, notes: true, userMapPhotos: true});
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState({});
  const [userMapPhotos, setUserMapPhotos] = useState([]);

  //Load all the information from async storage
  useEffect(() => {
    (async () => {
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
