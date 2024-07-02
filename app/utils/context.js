import { UserDataContextProvider } from './context/UserData';
import { AppDataContextProvider } from './context/AppData';
import { SettingsContextProvider } from './context/Settings';
import { OnlineContextProvider } from './context/Online';
import { LocationContextProvider } from './context/Location';
import { WebSocketContextProvider } from './context/WebSocket';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const ContextWrapper = ({children}) => {
  return (
    <AppDataContextProvider>
      <UserDataContextProvider>
        <SettingsContextProvider>
          <OnlineContextProvider>
            <LocationContextProvider>
              <WebSocketContextProvider>
                {children}
              </WebSocketContextProvider>
            </LocationContextProvider>
          </OnlineContextProvider>
        </SettingsContextProvider>
      </UserDataContextProvider>
    </AppDataContextProvider>
  );
};

export default ContextWrapper;
