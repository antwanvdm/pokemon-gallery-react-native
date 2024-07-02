import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapScreen from './screens/MapScreen';
import { useContext } from 'react';
import { t } from './utils/translator';
import Tasks from './Tasks';
import { Alert } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SettingsContext } from './utils/context/Settings';
import { OnlineContext } from './utils/context/Online';

const Tab = createBottomTabNavigator();

/**
 * Use bottom tabs referring to the 2 main Screens
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Navigation = () => {
  const {theme, language} = useContext(SettingsContext);
  const {isOnline} = useContext(OnlineContext);
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <>
      <NavigationContainer theme={navigationTheme}>
        <Tasks/>
        <Tab.Navigator backBehavior="history">
          <Tab.Screen name="gallery" component={HomeScreen} options={{
            title: t('gallery.title', language),
            headerTitleAlign: 'center',
            tabBarItemStyle: {paddingBottom: 5},
            tabBarLabel: t('gallery.tabTitle', language),
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="view-list" color={color} size={size}/>
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
                          navigation.setParams({pokemonIds: null});
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
