import { View } from 'react-native';
import CaughtList from '../components/caught/CaughtList';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const CaughtScreen = () => {
  return (
    <View className="flex-1">
      <CaughtList/>
    </View>
  );
};

export default CaughtScreen;
