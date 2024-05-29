import { AppContextProvider } from './app/utils/context';
import Navigation from './app/Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/**
 * App is just the starting point. It exposes the ExpoStatusBar & directly loads the actual main file (Navigation)
 * Everything is wrapped in context to make sure this data information is available in every child component
 *
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {
  return (
    <AppContextProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <Navigation/>
      </GestureHandlerRootView>
    </AppContextProvider>
  );
};

export default App;
