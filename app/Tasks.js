import * as TaskManager from 'expo-task-manager';
import config from './config.json';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useState, useRef, useContext, useEffect } from 'react';
import { AppContext } from './utils/context';
import haversine from 'haversine-distance';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { t } from './utils/translator';
import { Alert, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * @returns {JSX.Element}
 * @constructor
 */
const Tasks = () => {
  const {pokemonList, notifications, language, isOnline} = useContext(AppContext);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationResponseListener = useRef();
  const navigation = useNavigation();

  //Handle push notification listeners, only when clicked on the notification
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
    });

    notificationResponseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      setNotification(response.notification);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationResponseListener.current);
    };
  }, []);

  //Navigate to maps screen and reset the notification
  useEffect(() => {
    if (notification) {
      if (isOnline) {
        navigation.navigate('locations', {
          ...notification.request.content.data
        });
      } else {
        Alert.alert(t('offline.title', language), t('offline.mapNotification', language));
      }
      setNotification(false);
    }
  }, [notification]);

  /**
   * Request permissions. This will result in a screen where you need to approve location on the background
   * @returns {Promise<void>}
   */
  const requestPermissions = async () => {
    const {status: foregroundStatus} = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const {status: backgroundStatus} = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        await Location.startLocationUpdatesAsync(config.tasks.backgroundLocation, {
          accuracy: Location.Accuracy.Balanced,
        });
      }
    }
  };

  //Request permissions once setting has been enabled
  useEffect(() => {
    (async () => {
      if (notifications?.allClosePokemon) {
        requestPermissions();
      } else {
        if (await Location.hasStartedLocationUpdatesAsync(config.tasks.backgroundLocation)) {
          Location.stopLocationUpdatesAsync(config.tasks.backgroundLocation);
        }
      }
    })();
  }, [notifications]);

  registerTasks(async (locations) => {
    const closeByPokemon = pokemonList.filter((pokemon) => haversine(locations[0].coords, pokemon.coordinate) < 150);
    if (closeByPokemon.length > 0) {
      if (Device.isDevice) {
        await schedulePushNotification(closeByPokemon, language);
      } else {
        console.log(closeByPokemon);
      }
    }
  });

  return (<></>);
};

async function registerTasks(callback) {
  TaskManager.defineTask(config.tasks.backgroundLocation, ({data, error}) => {
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      const {locations} = data;
      console.log('background task locations', locations);
      callback(locations);
    }
  });
}

/**
 * @param {Array} closeByPokemon
 * @param {string} language
 * @returns {Promise<void>}
 */
async function schedulePushNotification(closeByPokemon, language) {
  const pokemonString = closeByPokemon.map(pokemon => pokemon.names[language] ?? pokemon.names['en']).join(', ');
  await Notifications.scheduleNotificationAsync({
    content: {
      title: t('notifications.closeByPokemon.title', language),
      body: `${t('notifications.closeByPokemon.description', language)}: ${pokemonString}`,
      data: {pokemonIds: closeByPokemon.map(pokemon => pokemon.id)},
    },
    trigger: {seconds: 1},
  });
}

/**
 * @returns {Promise<string>}
 */
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export default Tasks;
