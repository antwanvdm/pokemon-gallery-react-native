import { View } from 'react-native';
import Filters from '../components/list/filters/Filters';
import PokemonGallery from '../components/list/PokemonGallery';
import { useState } from 'react';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const GalleryScreen = () => {
  //Set state variables
  const [filters, setFilters] = useState({});

  //Used to re-render the Gallery based on filters
  const filtersChanged = (filters) => {
    setFilters(filters);
  };

  return (
    <View className="flex-1">
      <Filters onChange={filtersChanged}/>
      <PokemonGallery filters={filters}/>
    </View>
  );
};

export default GalleryScreen;
