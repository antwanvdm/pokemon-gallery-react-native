import { createContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const OnlineContext = createContext();

const OnlineContextProvider = ({children}) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => setIsOnline(state.isConnected));
    return () => unsubscribeNetInfo();
  }, []);

  return (
    <OnlineContext.Provider value={{isOnline}}>
      {children}
    </OnlineContext.Provider>
  );
};

export {
  OnlineContext,
  OnlineContextProvider
};
