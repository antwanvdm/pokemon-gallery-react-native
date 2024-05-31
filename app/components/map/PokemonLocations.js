import { Alert, Dimensions, Image, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../../utils/context';
import DetailModal from '../detail/DetailModal';
import haversine from 'haversine-distance';
import { t } from '../../utils/translator';
import mapStyleDark from './mapStyleDark.json';
import mapStyleLight from './mapStyleLight.json';
import MapActions from './MapActions';
import RouteDirections from './RouteDirections';
import { MaterialIcons } from '@expo/vector-icons';
import UserPhotoModal from './UserPhotoModal';

/**
 * @param {Array<number>} pokemonIds
 * @returns {JSX.Element}
 * @constructor
 */
const PokemonLocations = ({pokemonIds}) => {
  const map = useRef(null);
  const markers = useRef({pokemon: {}, photos: {}});
  const {theme, language, pokemonList, userMapPhotos} = useContext(AppContext);
  const [region, setRegion] = useState({
    latitude: 51.91736823911433,
    longitude: 4.484781721396927,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  //Save the map in a ref, because it's a one time object which shouldn't affect re-rendering
  const [location, setLocation] = useState(null);
  const [destinationPokemon, setDestinationPokemon] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [activePokemon, setActivePokemon] = useState(null);
  const [activeUserMapPhoto, setActiveUserMapPhoto] = useState(null);
  const [mapStyle, setMapStyle] = useState(theme === 'dark' ? mapStyleDark : mapStyleLight);

  const getUserLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('locations.noAccess', language));
      return;
    }

    try {
      //Before this moment I used getCurrentPositionAsync, which had timeout issues. This seems to be stable AND updates my actual location :)
      await Location.watchPositionAsync({}, (location) => setLocation(location));
    } catch (e) {
      console.log(e);
    }
  };

  //Set the current user location
  useEffect(() => {
    getUserLocation();
  }, []);

  //If a new Pokémon was clicked from the list view, snap to this location
  useEffect(() => {
    if (pokemonIds) {
      const pokemonMarkerIds = pokemonList.filter(pokemon => pokemonIds.includes(pokemon.id)).map(pokemon => `p-${pokemon.id}`);
      //I need a timeout, else the first time the map will be zoomed out a lot.
      setTimeout(() => map.current.fitToSuppliedMarkers(pokemonMarkerIds, {edgePadding: {top: 20, right: 150, bottom: 100, left: 150}}), 80);
    } else {
      focusToOverview();
    }
  }, [pokemonIds]);

  //Change mapStyle & photo markers based on theme change
  useEffect(() => {
    setMapStyle(theme === 'dark' ? mapStyleDark : mapStyleLight);
    if (Platform.OS === 'android') {
      Object.values(markers.current.photos).forEach((marker) => marker.redraw());
    }
  }, [theme]);

  //When language or theme changes, the route should be removed because text/style doesn't update
  useEffect(() => {
    focusToOverview(true);
  }, [language, theme]);

  //Update the current item for the detail modal, only if the Pokémon is in reach (100 meters)
  const markerPressed = (pokemon) => {
    if (location === null) {
      Alert.alert(t('locations.locationLoadingTitle', language), t('locations.locationLoadingMessage', language));
      return;
    }

    if (haversine(pokemon.coordinate, location.coords) > 100) {
      Alert.alert(t('locations.outOfReachTitle', language), t('locations.outOfReachMessage', language), [
        {
          text: t('locations.ourOfReachRoute', language, {name: pokemon.names[language] ?? pokemon.names['en']}),
          onPress: () => setDestinationPokemon(pokemon),
        },
        {
          text: t('locations.ourOfReachCancel', language),
          style: 'cancel',
        }
      ]);
      return;
    }
    setActivePokemon(pokemon);
  };

  const handleModalClosed = () => {
    setActivePokemon(null);
  };

  const focusToOverview = (removeRoute) => {
    map.current.fitToCoordinates(pokemonList.map((pokemon) => pokemon.coordinate), {edgePadding: {top: 20, right: 20, bottom: 100, left: 20}});
    if (removeRoute === true) {
      setDestinationPokemon(null);
      setActiveRoute(null);
    }
  };

  const focusToLocation = () => {
    map.current.animateToRegion({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.003, longitudeDelta: 0.003});
  };

  const focusToRoute = (result) => {
    console.log(Math.round(result.duration)); //TODO: Show total expected minutes to walk
    map.current.fitToCoordinates(result.coordinates, {edgePadding: {top: 40, right: 50, bottom: 220, left: 50}});
    setActiveRoute(result.legs[0].steps);
  };

  //This is a horrible hack to prevent performance loss @link https://github.com/react-native-maps/react-native-maps/issues/3339
  const redrawMarker = (pokemonId) => {
    if (Platform.OS === 'android') {
      markers.current.pokemon[pokemonId].redraw();
    }
  };

  const userPhotoModalClosed = () => {
    setActiveUserMapPhoto(null);
  };

  return (
    <>
      <MapView
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
        }}
        region={region}
        customMapStyle={mapStyle}
        userInterfaceStyle={theme}
        showsUserLocation={true}
        showsMyLocationButton={false}
        ref={ref => map.current = ref}
        moveOnMarkerPress={false}>
        <>
          {pokemonList.map((pokemon) => <Marker
            identifier={`p-${pokemon.id}`}
            key={pokemon.id}
            coordinate={pokemon.coordinate}
            ref={(ref) => markers.current.pokemon[pokemon.id] = ref}
            onPress={(e) => markerPressed(pokemon, e)}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}>
            <Image fadeDuration={0} source={{uri: pokemon.images.thumb}} style={{height: 35, width: 35}} onLoadEnd={() => redrawMarker(pokemon.id)}/>
          </Marker>)}
        </>
        <>
          {userMapPhotos.map((userMapPhoto) => <Marker
            identifier={`p-${userMapPhoto.id}`}
            key={userMapPhoto.id}
            coordinate={userMapPhoto.location}
            ref={(ref) => markers.current.photos[userMapPhoto.id] = ref}
            onPress={() => setActiveUserMapPhoto(userMapPhoto)}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}>
            <MaterialIcons name="linked-camera" size={24} color={theme === 'dark' ? 'yellow' : 'blue'}/>
          </Marker>)}
        </>
        {location && destinationPokemon ? (
          <>
            <MapViewDirections
              origin={location.coords}
              destination={destinationPokemon.coordinate}
              mode="WALKING"
              strokeWidth={3}
              language={language}
              strokeColor={theme === 'dark' ? 'white' : 'black'}
              apikey={Constants.expoConfig.extra.googleMapsDirection.apiKey}
              onReady={(result) => focusToRoute(result)}
            />
          </>
        ) : <></>}
      </MapView>
      <MapActions location={location} focusToLocation={focusToLocation} focusToOverview={focusToOverview}/>
      {activeRoute && destinationPokemon ? (<RouteDirections routeSteps={activeRoute} pokemon={destinationPokemon} onClose={() => focusToOverview(true)}/>) : <></>}
      <DetailModal pokemon={activePokemon} closeCallback={handleModalClosed}/>
      <UserPhotoModal userPhoto={activeUserMapPhoto} closeCallback={userPhotoModalClosed}/>
    </>
  );
};

export default PokemonLocations;
