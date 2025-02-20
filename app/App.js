import './global.css';
import ContextWrapper from './utils/context';
import Navigation from './Navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/**
 * App is just the starting point. It directly loads the actual main file (Navigation)
 * Everything is wrapped in context to make sure this data information is available in every child component
 *
 * @returns {JSX.Element}
 * @constructor
 */
const App = () => {
  return (
    <ContextWrapper>
      <GestureHandlerRootView style={{flex: 1}}>
        <Navigation/>
      </GestureHandlerRootView>
    </ContextWrapper>
  );
};

export default App;
