import { Alert, Dimensions, Image, Platform, View, Text } from 'react-native';
import Constants from 'expo-constants';
import MapView, { Callout, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useState, useEffect, useContext, useRef } from 'react';
import DetailModal from '../detail/DetailModal';
import haversine from 'haversine-distance';
import { t } from '../../utils/translator';
import mapStyleDark from './mapStyleDark.json';
import mapStyleLight from './mapStyleLight.json';
import MapActions from './MapActions';
import RouteDirections from './RouteDirections';
import { MaterialIcons } from '@expo/vector-icons';
import UserPhotoModal from './UserPhotoModal';
import { WebSocketContext } from '../../utils/context/WebSocket';
import { LocationContext } from '../../utils/context/Location';
import { AppDataContext } from '../../utils/context/AppData';
import { UserDataContext } from '../../utils/context/UserData';
import { SettingsContext } from '../../utils/context/Settings';
import { dateFormatted } from '../../utils/strings';
import { useNavigation, useRoute } from '@react-navigation/native';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const PokemonLocations = () => {
  const {params} = useRoute();
  const {setParams} = useNavigation();
  const map = useRef(null);
  const markers = useRef({pokemon: {}, photos: {}, activeCaughtPokemon: null});
  const {pokemonList} = useContext(AppDataContext);
  const {userMapPhotos, catches, setCatches} = useContext(UserDataContext);
  const {location} = useContext(LocationContext);
  const {spawnPokemon} = useContext(WebSocketContext);
  const {theme, language} = useContext(SettingsContext);
  const [region, setRegion] = useState({
    latitude: 51.91736823911433,
    longitude: 4.484781721396927,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  //Save the map in a ref, because it's a one time object which shouldn't affect re-rendering
  const [destinationPokemon, setDestinationPokemon] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [activePokemon, setActivePokemon] = useState(null);
  const [activeUserMapPhoto, setActiveUserMapPhoto] = useState(null);
  const [activeCaughtPokemon, setActiveCaughtPokemon] = useState(null);
  const [mapStyle, setMapStyle] = useState(theme === 'dark' ? mapStyleDark : mapStyleLight);
  const [showPokemon, setShowPokemon] = useState(true);
  const [showPhotos, setShowPhotos] = useState(true);

  //If a new Pokémon was clicked from the list view, snap to this location
  useEffect(() => {
    //I need a timeout, else the first time the map will be zoomed out to the default region..
    if (params?.caughtPokemon) {
      setActiveCaughtPokemon(params.caughtPokemon);
      setTimeout(() => map.current.animateToRegion({latitude: params.caughtPokemon.location.latitude, longitude: params.caughtPokemon.location.longitude, latitudeDelta: 0.001, longitudeDelta: 0.001}), 80);
    } else {
      setActiveCaughtPokemon(null);
      setTimeout(() => focusToLocation(), 80);
    }
  }, [params]);

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

    if (haversine(pokemon.coordinate, location.coords) > 50) {
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

    Alert.alert(t('locations.pokemonClickTitle', language, {name: pokemon.names[language] ?? pokemon.names['en']}), t('locations.pokemonClickMessage', language), [
      {
        text: t('locations.pokemonClickDetail', language, {name: pokemon.names[language] ?? pokemon.names['en']}),
        onPress: () => setActivePokemon(pokemon),
      },
      {
        text: t('locations.pokemonClickCatch', language, {name: pokemon.names[language] ?? pokemon.names['en']}),
        onPress: () => setCatches((currentCatches) => [{id: pokemon.id, date: Date.now(), location: pokemon.coordinate, spawnId: pokemon.spawnId}, ...currentCatches]),
      },
      {
        text: t('locations.ourOfReachCancel', language),
        style: 'cancel',
      }
    ]);
  };

  const handleModalClosed = () => {
    setActivePokemon(null);
  };

  const focusToOverview = (removeRoute) => {
    map.current.fitToCoordinates(spawnPokemon.map((pokemon) => pokemon.coordinate), {edgePadding: {top: 20, right: 20, bottom: 100, left: 20}});
    if (removeRoute === true) {
      setDestinationPokemon(null);
      setActiveRoute(null);
    }
  };

  const focusToLocation = () => {
    map.current.animateToRegion({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.003, longitudeDelta: 0.003});
  };

  const focusToRoute = (result) => {
    map.current.fitToCoordinates(result.coordinates, {edgePadding: {top: 40, right: 50, bottom: 220, left: 50}});
    setActiveRoute({steps: result.legs[0].steps, minutes: Math.round(result.duration)});
  };

  //This is a horrible hack to prevent performance loss @link https://github.com/react-native-maps/react-native-maps/issues/3339
  const redrawMarker = (pokemonId) => {
    if (Platform.OS === 'android') {
      markers.current.pokemon[pokemonId].redraw();
    }
  };

  const activeCaughtPokemonLoaded = () => {
    markers.current.activeCaughtPokemon.showCallout();
    if (Platform.OS === 'android') {
      markers.current.activeCaughtPokemon.redraw();
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
        initialRegion={region}
        region={region}
        customMapStyle={mapStyle}
        userInterfaceStyle={theme}
        showsUserLocation={true}
        showsMyLocationButton={false}
        ref={ref => map.current = ref}
        moveOnMarkerPress={false}>
        <>
          {showPokemon && spawnPokemon.filter((p) => !catches.find((c) => c.spawnId === p.spawnId && c.id === p.id)).map((pokemon) => <Marker
            identifier={`p-${pokemon.spawnId}`}
            key={pokemon.spawnId}
            coordinate={pokemon.coordinate}
            ref={(ref) => markers.current.pokemon[pokemon.spawnId] = ref}
            onPress={(e) => markerPressed(pokemon, e)}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}>
            <Image fadeDuration={0} source={{uri: pokemon.image_thumb}} style={{height: 45, width: 45}} onLoadEnd={() => redrawMarker(pokemon.spawnId)}/>
          </Marker>)}
        </>
        <>
          {showPhotos && userMapPhotos.map((userMapPhoto) => <Marker
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
              tappable={false}
              resetOnChange={false}
              strokeColor={theme === 'dark' ? 'white' : 'black'}
              apikey={Constants.expoConfig.extra.googleMapsDirection.apiKey}
              onReady={(result) => focusToRoute(result)}
            />
          </>
        ) : <></>}
        {activeCaughtPokemon && (<Marker
          identifier={`caught-pokemon`}
          key={'caught-pokemon'}
          coordinate={activeCaughtPokemon.location}
          ref={(ref) => markers.current.activeCaughtPokemon = ref}
          onPress={() => setParams({caughtPokemon: null})}
          tracksInfoWindowChanges={false}
          tracksViewChanges={false}>
          <Image fadeDuration={0} source={{uri: pokemonList.find((p) => p.id === activeCaughtPokemon.id).image_thumb}} style={{height: 45, width: 45}} onLoadEnd={() => activeCaughtPokemonLoaded()}/>
          <Callout onPress={() => setParams({caughtPokemon: null})}>
            <View className="w-24 h-20 flex justify-center items-center self-center">
              <Text className="text-center font-bold">{t('locations.activeCaughtPokemonMarker', language, {date: dateFormatted(activeCaughtPokemon.date)})}</Text>
            </View>
          </Callout>
        </Marker>)}
      </MapView>
      <MapActions
        location={location}
        focusToLocation={focusToLocation}
        focusToOverview={focusToOverview}
        showPokemon={showPokemon}
        showPhotos={showPhotos}
        togglePokemon={() => setShowPokemon(!showPokemon)}
        togglePhotos={() => setShowPhotos(!showPhotos)}/>
      {activeRoute && destinationPokemon ? (<RouteDirections activeRoute={activeRoute} pokemon={destinationPokemon} onClose={() => focusToOverview(true)}/>) : <></>}
      <DetailModal pokemon={activePokemon} closeCallback={handleModalClosed}/>
      <UserPhotoModal userPhoto={activeUserMapPhoto} onDelete={(id) => delete markers.current.photos[id]} closeCallback={userPhotoModalClosed}/>
    </>
  );
};

export default PokemonLocations;
