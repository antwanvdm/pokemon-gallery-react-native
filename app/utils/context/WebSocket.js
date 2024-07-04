import { createContext, useContext, useEffect, useRef, useState } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { LocationContext } from './Location';
import { AppDataContext } from './AppData';

const WebSocketContext = createContext();

const WebSocketContextProvider = ({children}) => {
  const {pokemonList, dataIsLoaded} = useContext(AppDataContext);
  const {location} = useContext(LocationContext);
  const [spawnPokemon, setSpawnPokemon] = useState([]);
  const ws = useRef();
  const socketId = useRef(uuidv4());
  const reconnectInterval = useRef(null);

  //Make sure latest information of pokemonList is available here
  const pokemonListRef = useRef(pokemonList);
  useEffect(() => {
    pokemonListRef.current = pokemonList;
  }, [pokemonList]);

  const connect = () => {
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    ws.current = new WebSocket('wss://adventure-go.antwan.eu');

    ws.current.onopen = () => {
      console.log('WebSocket opened');
      if (location) {
        ws.current.send(JSON.stringify({
          id: socketId.current,
          type: 'POSITION',
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }));
      }
    };

    ws.current.onerror = (error) => {
      console.log('WebSocket error', error);
    };

    ws.current.onclose = (error) => {
      console.log('Websocket is closed, reconnecting');
      reconnect();
    };

    ws.current.onmessage = (event) => {
      console.log('new event');
      let data = JSON.parse(event.data);

      if (typeof data.type === 'undefined' || typeof data.content === 'undefined') {
        console.log('Message from server is broken and missing type and/or data', event.data);
        return;
      }

      if (data.type === 'spawns' && pokemonListRef.current.length > 0) {
        const newList = data.content.map((s) => {
          //Clone found result to prevent editing original
          const pokemon = JSON.parse(JSON.stringify(pokemonListRef.current.find((p) => p.id === s.number)));

          //Set spawn coordinate & server ID
          pokemon.coordinate = {latitude: s.loc.coordinates[1], longitude: s.loc.coordinates[0]};
          pokemon.spawnId = s._id;
          return pokemon;
        });
        setSpawnPokemon(newList);
      }
    };
  };

  const reconnect = () => {
    if (reconnectInterval.current) {
      clearInterval(reconnectInterval.current);
    }

    reconnectInterval.current = setInterval(() => {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        connect();
      }
    }, 2000);
  };


  useEffect(() => {
    //Prevent start of websocket if data is unavailable
    if (dataIsLoaded === false) {
      return;
    }

    connect();

    //Make sure websocket & interval are cleared on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
    };
  }, [dataIsLoaded]);

  useEffect(() => {
    if (dataIsLoaded === true && location !== null && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        id: socketId.current,
        type: 'POSITION',
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }));
    }
  }, [location, dataIsLoaded]);

  return (
    <WebSocketContext.Provider value={{spawnPokemon}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export {
  WebSocketContext,
  WebSocketContextProvider
};
