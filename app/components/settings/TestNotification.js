import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { t } from '../../utils/translator';
import { useContext, useState } from 'react';
import * as Notifications from 'expo-notifications';
import haversine from 'haversine-distance';
import * as Location from 'expo-location';
import { SettingsContext } from '../../utils/context/Settings';
import { WebSocketContext } from '../../utils/context/WebSocket';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const TestNotification = () => {
  const {spawnPokemon} = useContext(WebSocketContext);
  const {theme, language} = useContext(SettingsContext);
  const [isLoading, setIsLoading] = useState(false);

  //Faking how the background service should work. Can test both the connection to close by Pokémon, as well the actual notification
  const sendNotification = async () => {
    setIsLoading(true);
    let location = await Location.getCurrentPositionAsync({});

    const closeByPokemon = spawnPokemon.filter((pokemon) => haversine(location.coords, pokemon.coordinate) < 100);
    const pokemonString = closeByPokemon.map(pokemon => pokemon.names[language] ?? pokemon.names['en']).join(', ');
    console.log('pokemonString, ready to send notifications', pokemonString);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test your Pokémon Gallery!',
          body: `If any Pokémon are close, they will be appended to this string. ${pokemonString}`,
          data: {pokemonIds: closeByPokemon.map(pokemon => pokemon.id)},
        },
        trigger: {seconds: 1},
      });
    } catch (e) {
      console.log('notification failed', e);
    }
    console.log('Notification should have been send');
    setIsLoading(false);
  };

  return (
    <View className="w-9/12 flex-row items-center mt-4 justify-evenly">
      <Pressable className={`w-full flex-row justify-center mt-1 p-3 ${isLoading ? 'bg-gray-300' : 'bg-yellow-400'} rounded-2xl`} onPress={sendNotification} disabled={isLoading}>
        <Text className="text-black text-center font-bold">{t('settings.testNotification', language)}</Text>
        {isLoading ?
          <ActivityIndicator className="ml-2" size="small" color={theme === 'dark' ? '#FFF' : '#000'}/>
          : ''}
      </Pressable>
    </View>
  );
};

export default TestNotification;
