import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { t } from '../translator';
import * as Location from 'expo-location';
import { SettingsContext } from './Settings';

const LocationContext = createContext();

const LocationContextProvider = ({children}) => {
  const {language} = useContext(SettingsContext)
  const [location, setLocation] = useState(null);

  const getUserLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('locations.noAccess', language));
      return;
    }

    try {
      //Before this moment I used getCurrentPositionAsync, which had timeout issues. This seems to be stable AND updates my actual location :)
      await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        distanceInterval: 10
      }, (location) => setLocation(location));
    } catch (e) {
      console.log(e);
    }
  };

  //Set the current user location
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <LocationContext.Provider value={{location}}>
      {children}
    </LocationContext.Provider>
  );
}

export {
  LocationContext,
  LocationContextProvider
};
