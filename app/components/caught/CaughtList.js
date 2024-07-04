import { useCallback, useContext, useRef } from 'react';
import { FlatList } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { UserDataContext } from '../../utils/context/UserData';
import CaughtCard from './CaughtCard';

/**
 * @returns {JSX.Element}
 * @constructor
 */
const CaughtList = () => {
  const navigation = useNavigation();
  const listRef = useRef();
  const {catches} = useContext(UserDataContext);

  //Auto scroll to top
  useScrollToTop(listRef);

  //Navigate to map view with clicked ID
  const mapClicked = (caughtPokemon) => {
    navigation.navigate('locations', {
      caughtPokemon: caughtPokemon,
    });
  };

  const renderCatchCard = useCallback(({item, index}) => {
    return (
      <CaughtCard
        listIndex={index}
        caughtPokemon={item}
        mapClickHandler={mapClicked}
      />
    );
  }, []);

  //Render the view based on the state of the available data
    return (
      <>
        <FlatList
          className="mt-1"
          ref={listRef}
          data={catches}
          renderItem={renderCatchCard}
          numColumns={2}
          keyExtractor={(item) => item.id}
        />
      </>
    );
};

export default CaughtList;
