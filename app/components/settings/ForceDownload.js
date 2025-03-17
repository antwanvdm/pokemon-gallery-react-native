import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useContext, useState } from 'react';
import { firstAppLoad } from '../../utils/pokemonData';
import { t } from '../../utils/translator';
import { SettingsContext } from '../../utils/context/Settings';
import { AppDataContext } from '../../utils/context/AppData';
import { OnlineContext } from '../../utils/context/Online';
import { dropTables, getPokemon, getTypes } from '../../utils/database';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const ForceDownload = () => {
  const {setPokemonList, setPokemonTypes} = useContext(AppDataContext);
  const {isOnline} = useContext(OnlineContext);
  const {theme, language} = useContext(SettingsContext);
  const [isLoading, setIsLoading] = useState(false);

  const downloadPokemon = async () => {
    setIsLoading(true);
    await dropTables();
    await firstAppLoad();

    let typesList = await getTypes();
    let pokemonList = await getPokemon();

    setIsLoading(false);
    setPokemonTypes(typesList);
    setPokemonList(pokemonList);
  };

  return (
    <View className="w-9/12 flex-row items-center mt-4 justify-evenly">
      <Pressable className={`w-full flex-row justify-center mt-1 p-3 ${isLoading || !isOnline ? 'bg-gray-300' : 'bg-red-700'} rounded-2xl`}
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
