import { createContext, useEffect, useRef, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';

const SettingsContext = createContext();

const SettingsContextProvider = ({children}) => {
  const firstUpdate = useRef({theme: true, notifications: true, language: true});
  const [theme, setTheme] = useState(Appearance.getColorScheme() ?? 'light');
  const [notifications, setNotifications] = useState({});
  let locale = getLocales()[0];
  const [language, setLanguage] = useState(locale.languageTag);

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
    })();
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

  return (
    <SettingsContext.Provider value={{
      theme, setTheme,
      notifications, setNotifications,
      language, setLanguage,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export {
  SettingsContext,
  SettingsContextProvider
};
