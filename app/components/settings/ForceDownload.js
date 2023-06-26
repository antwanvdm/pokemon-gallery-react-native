import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useContext, useState } from 'react';
import { AppContext } from '../../utils/context';
import { getPokemon, getTypes } from '../../utils/pokemonData';
import { t } from '../../utils/translator';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const ForceDownload = () => {
  const {theme, setPokemonList, setPokemonTypes, language, isOnline} = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const downloadPokemon = async () => {
    setIsLoading(true);
    let pokemonList = await getPokemon();
    let pokemonTypes = await getTypes();
    setIsLoading(false);
    setPokemonList(pokemonList);
    setPokemonTypes(pokemonTypes);
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
