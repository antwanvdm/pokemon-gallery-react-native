import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useContext, useState } from 'react';
import { loadPokemon, loadTypes } from '../../utils/pokemonData';
import { t } from '../../utils/translator';
import { SettingsContext } from '../../utils/context/Settings';
import { AppDataContext } from '../../utils/context/AppData';
import { OnlineContext } from '../../utils/context/Online';
import { addPokemon, addType, createTables, deletePokemon, deleteTypes, dropTables, getPokemon, getTypes } from '../../utils/database';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const ForceDownload = () => {
  const {setPokemonList, setPokemonTypes} = useContext(AppDataContext);
  const {isOnline} = useContext(OnlineContext);
  const {theme, language} = useContext(SettingsContext);
  const [isLoading, setIsLoading] = useState(false);

  //TODO SOMETHING GOES WRONG HERE!!!!!
  const downloadPokemon = async () => {
    setIsLoading(true);
    await dropTables();
    await createTables();

    let loadedTypes = await loadTypes();
    for (const type of loadedTypes) {
      await addType(type);
    }

    let loadedPokemon = await loadPokemon();
    for (const pokemon of loadedPokemon) {
      await addPokemon(pokemon);
    }

    let typesList = await getTypes();
    let pokemonList = await getPokemon();

    setIsLoading(false);
    setPokemonTypes(typesList);
    setPokemonList(pokemonList);
  };

  return (
    <View className="flex-row items-center mt-4 justify-evenly">
      <Pressable className={`flex-row items-center mt-1 p-3 ${isLoading || !isOnline ? 'bg-gray-300' : 'bg-red-700'} rounded-2xl`}
                 onPress={downloadPokemon}
                 disabled={isLoading || !isOnline}>
        <Text className="text-white text-center font-bold">{t('settings.download', language)}</Text>
        {isLoading ?
          <ActivityIndicator className="ml-2" size="small" color={theme === 'dark' ? '#FFF' : '#000'}/>
          : ''}
      </Pressable>
    </View>
  );
};

export default ForceDownload;
