import { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { t } from '../../../utils/translator';
import { SettingsContext } from '../../../utils/context/Settings';
import { AppDataContext } from '../../../utils/context/AppData';

/**
 * @param {function} onChange
 * @param {string} type
 * @returns {JSX.Element}
 * @constructor
 */
const TypeFilter = ({onChange, type}) => {
  //Set state variables
  const {theme, language} = useContext(SettingsContext);
  const {pokemonTypes} = useContext(AppDataContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeType, setActiveType] = useState(type);
  const [open, setOpen] = useState(false);

  //Change load state once types are available
  useEffect(() => {
    if (pokemonTypes.length > 0) {
      setIsLoaded(true);
    }
  }, [pokemonTypes]);

  //When type changes, let the parent know
  useEffect(() => {
    onChange('type', activeType);
  }, [activeType]);

  let allTypes = [{label: t('gallery.filters.typeAll', language), value: 'all'}];
  for (let pokemonType of pokemonTypes) {
    allTypes.push({label: pokemonType.names[language] ?? pokemonType.names['en'], value: pokemonType.id});
  }

  if (isLoaded) {
    return (
      <View className="w-full mt-2 mb-4 z-10">
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          items={allTypes}
          value={activeType}
          setValue={setActiveType}
          containerStyle={{height: 40}}
          zIndex={1000}
          listMode="MODAL"
          theme={theme.toUpperCase()}
        />
      </View>
    );
  }

  return <Text>''</Text>;
};

export default TypeFilter;
