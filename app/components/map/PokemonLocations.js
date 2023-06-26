import { Alert, Dimensions, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../../utils/context';
import DetailModal from '../detail/DetailModal';
import haversine from 'haversine-distance';
import { t } from '../../utils/translator';
import mapStyleDark from './mapStyleDark.json';
import mapStyleLight from './mapStyleLight.json';
import MapNavigation from './MapNavigation';

/**
 * @param {Array<number>} pokemonIds
 * @returns {JSX.Element}
 * @constructor
 */
const PokemonLocations = ({pokemonIds}) => {
  const map = useRef(null);
  const markers = useRef({});
  const {theme, language, pokemonList} = useContext(AppContext);
  const [region, setRegion] = useState({
    latitude: 51.91736823911433,
    longitude: 4.484781721396927,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  //Save the map in a ref, because it's a one time object which shouldn't affect re-rendering
  const [location, setLocation] = useState(null);
  const [activePokemon, setActivePokemon] = useState(null);
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

  //Change mapStyle based on theme change
  useEffect(() => {
    setMapStyle(theme === 'dark' ? mapStyleDark : mapStyleLight);
  }, [theme]);

  //Update the current item for the detail modal, only if the Pokémon is in reach (100 meters)
  const markerPressed = (pokemon) => {
    if (location === null) {
      Alert.alert(t('locations.locationLoadingTitle', language), t('locations.locationLoadingMessage', language));
      return;
    }

    if (haversine(pokemon.coordinate, location.coords) > 100) {
      Alert.alert(t('locations.outOfReachTitle', language), t('locations.outOfReachMessage', language));
      return;
    }
    setActivePokemon(pokemon);
  };
  const handleModalClosed = () => {
    setActivePokemon(null);
  };

  const focusToOverview = () => {
    map.current.fitToCoordinates(pokemonList.map((pokemon) => pokemon.coordinate), {edgePadding: {top: 20, right: 20, bottom: 100, left: 20}});
  };

  const focusToLocation = () => {
    map.current.animateToRegion({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.003, longitudeDelta: 0.003});
  };

  //This is a horrible hack to prevent performance loss @link https://github.com/react-native-maps/react-native-maps/issues/3339
  const redrawMarker = (pokemonId) => {
    markers.current[pokemonId].redraw();
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
        showsUserLocation={true}
        ref={ref => map.current = ref}
        provider={PROVIDER_GOOGLE}
        moveOnMarkerPress={false}>
        <>
          {pokemonList.map((pokemon) => <Marker
            identifier={`p-${pokemon.id}`}
            key={pokemon.id}
            coordinate={pokemon.coordinate}
            ref={(ref) => markers.current[pokemon.id] = ref}
            onPress={(e) => markerPressed(pokemon, e)}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}>
            <Image fadeDuration={0} source={{uri: pokemon.images.thumb}} style={{height: 35, width: 35}} onLoadEnd={() => redrawMarker(pokemon.id)}/>
          </Marker>)}
        </>
      </MapView>
      <MapNavigation location={location} focusToLocation={focusToLocation} focusToOverview={focusToOverview}/>
      <DetailModal pokemon={activePokemon} closeCallback={handleModalClosed}/>
    </>
  );
};

export default PokemonLocations;
