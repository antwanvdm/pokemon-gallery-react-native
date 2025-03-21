import Animated, { LightSpeedInRight } from 'react-native-reanimated';
import { useContext, useEffect, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import FavoriteFilter from './FavoriteFilter';
import TypeFilter from './TypeFilter';
import { t } from '../../../utils/translator';
import { SettingsContext } from '../../../utils/context/Settings';

/**
 * @param {function} onChange
 * @returns {JSX.Element}
 * @constructor
 */
const Filters = ({onChange}) => {
  const {theme, language} = useContext(SettingsContext);
  const [filters, setFilters] = useState({
    favorites: false,
    type: 'all',
  });
  const [open, setOpen] = useState(false);

  //If anything changes, we will update the state & automatically call the update as side effect
  const handleFiltersChanged = (filter, value) => {
    setFilters({...filters, [filter]: value});
  };
  useEffect(() => {
    onChange(filters);
  }, [onChange, filters]);

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <View className="m-2">
      <Animated.View className="mt-1 p-3 bg-green-700 rounded-2xl" entering={LightSpeedInRight.duration(500).delay(300)}>
        <Pressable onPress={toggleModal}>
          <Text className="text-white text-center font-bold">{t('gallery.filters.title', language)}</Text>
        </Pressable>
      </Animated.View>
      <ReactNativeModal
        animationType="slide"
        isVisible={open}
        onBackdropPress={toggleModal}
        onRequestClose={toggleModal}
      >
        <View className="flex-1 justify-center items-center">
            <View className={`w-9/12 rounded-2xl border p-10 items-center shadow-black ${theme === 'dark' ? 'bg-gray-800 text-white border-white' : 'bg-white text-black border-gray-800'}`}>
              <FavoriteFilter
                onChange={handleFiltersChanged}
                status={filters.favorites}
              />
              <TypeFilter onChange={handleFiltersChanged} type={filters.type}/>
              <Pressable
                className="w-full mt-2 p-3 pr-4 pl-4 bg-green-700 rounded-2xl"
                onPress={toggleModal}
                filters={filters}
              >
                <Text className="text-white text-center font-bold">{t('gallery.filters.backToOverview', language)}</Text>
              </Pressable>
            </View>
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default Filters;
