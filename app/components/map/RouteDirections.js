import { useCallback, useContext, useMemo, useRef } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import RenderHtml from '@builder.io/react-native-render-html';
import { t } from '../../utils/translator';
import { formatMinutes } from '../../utils/numbers';
import { SettingsContext } from '../../utils/context/Settings';

const RouteDirections = ({activeRoute, pokemon, onClose}) => {
  const {language, theme} = useContext(SettingsContext);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['20%', '50%', '100%'], []);
  const iconColor = theme === 'dark' ? 'white' : 'black';
  const {width} = useWindowDimensions();

  const maneuverIcons = {
    'ferry': <MaterialIcons name="directions-ferry" size={32} color={iconColor}/>,
  };

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      onClose();
    }
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <View className="flex-row px-4 py-2">
        {item.maneuver ? maneuverIcons[item.maneuver] ?? <MaterialIcons name={item.maneuver} size={32} color={iconColor}/> : <MaterialCommunityIcons name="routes" size={32} color={iconColor}/>}
        <RenderHtml
          contentWidth={width * 0.8}
          source={{html: `<style></style></head><body style="word-wrap: break-word; overflow-wrap: break-word; color: ${theme === 'dark' ? 'white' : 'black'}; padding: 0 10px;">${item.html_instructions}`}}
        />
      </View>
    ),
    []
  );

  return (
    <View className="flex-1 w-full absolute bottom-0">
      <View className="flex-1 p-40">
        <BottomSheet
          backgroundStyle={{backgroundColor: theme === 'dark' ? 'rgb(75, 85, 99)' : 'rgb(249, 250, 251)'}}
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
        >
          <BottomSheetView>
            <View className="flex-row justify-between px-6 pb-1.5 items-center">
              <Text className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('locations.ourOfReachRoute', language, {name: pokemon.names[language] ?? pokemon.names['en']})}</Text>
              <Pressable className="self-center rounded-2xl items-center" onPress={onClose}>
                <MaterialIcons name="close" size={32} color={theme === 'dark' ? 'white' : 'black'}/>
              </Pressable>
            </View>
          </BottomSheetView>
          <BottomSheetView>
            <View className="flex-row pl-6 pb-3 items-center">
              <MaterialIcons name="directions-walk" size={18} color={iconColor}/>
              <Text className={`ml-5 font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('locations.ourOfReachTravelTime', language, {time: formatMinutes(activeRoute.minutes)})}</Text>
            </View>
          </BottomSheetView>
          <BottomSheetFlatList
            data={activeRoute.steps}
            keyExtractor={(item, index) => index}
            renderItem={renderItem}/>
        </BottomSheet>
      </View>
    </View>
  );
};

export default RouteDirections;
