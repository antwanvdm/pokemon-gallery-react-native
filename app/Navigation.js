import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GalleryScreen from './screens/GalleryScreen';
import SettingsScreen from './screens/SettingsScreen';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MapScreen from './screens/MapScreen';
import { useContext } from 'react';
import { t } from './utils/translator';
import Tasks from './Tasks';
import { Alert } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SettingsContext } from './utils/context/Settings';
import { OnlineContext } from './utils/context/Online';
import { AppDataContext } from './utils/context/AppData';
import CaughtScreen from './screens/CaughtScreen';
import { LocationContext } from './utils/context/Location';

const Tab = createBottomTabNavigator();

/**
 * Use bottom tabs referring to the 2 main Screens
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Navigation = () => {
  const {dataIsLoaded} = useContext(AppDataContext);
  const {theme, language} = useContext(SettingsContext);
  const {location} = useContext(LocationContext);
  const {isOnline} = useContext(OnlineContext);
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <>
      <NavigationContainer theme={navigationTheme}>
        <Tasks/>
        <Tab.Navigator backBehavior="history">
          <Tab.Screen name="gallery" component={GalleryScreen} options={{
            title: t('gallery.title', language),
            headerTitleAlign: 'center',
            tabBarItemStyle: {paddingBottom: 5},
            tabBarLabel: t('gallery.tabTitle', language),
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="view-list" color={color} size={size}/>
            ),
          }}/>
          <Tab.Screen name="caught" component={CaughtScreen} options={{
            title: t('caught.title', language),
            headerTitleAlign: 'center',
            tabBarItemStyle: {paddingBottom: 5},
            tabBarLabel: t('caught.tabTitle', language),
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="catching-pokemon" color={color} size={size}/>
            ),
          }}/>
          <Tab.Screen name="locations"
                      component={MapScreen}
                      listeners={({navigation}) => ({
                        tabPress: (e) => {
                          if (!isOnline) {
                            Alert.alert(t('offline.title', language), t('offline.map', language));
                            e.preventDefault();
                          }
                          if (!location) {
                            Alert.alert(t('gallery.noLocationTitle', language), t('gallery.noLocationDescription', language));
                            e.preventDefault();
                          }
                          if (!dataIsLoaded) {
                            Alert.alert(t('gallery.notLoadedTitle', language), t('gallery.notLoadedDescription', language));
                            e.preventDefault();
                          }
                          navigation.setParams({caughtPokemon: null});
                        },
                      })}
                      options={{
                        title: t('locations.title', language),
                        headerTitleAlign: 'center',
                        tabBarItemStyle: {paddingBottom: 5},
                        tabBarLabel: t('locations.tabTitle', language),
                        tabBarIcon: ({color, size}) => (
                          <MaterialCommunityIcons name="pokemon-go" color={color} size={size}/>
                        ),
                      }}/>
          <Tab.Screen name="settings" component={SettingsScreen} options={{
            title: t('settings.title', language),
            headerTitleAlign: 'center',
            tabBarItemStyle: {paddingBottom: 5},
            tabBarLabel: t('settings.tabTitle', language),
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="account-cog" color={color} size={size}/>
            ),
          }}/>
        </Tab.Navigator>
      </NavigationContainer>
      <ExpoStatusBar animated={true} style={theme === 'dark' ? 'light': 'dark'} hidden={false}/>
    </>
  );
};

export default Navigation;
