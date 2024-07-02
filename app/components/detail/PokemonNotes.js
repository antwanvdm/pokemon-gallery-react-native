import { KeyboardAvoidingView, Pressable, Share, Text, TextInput, View } from 'react-native';
import { useContext, useEffect, useRef, useState } from 'react';
import { t } from '../../utils/translator';
import * as LocalAuthentication from 'expo-local-authentication';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserDataContext } from '../../utils/context/UserData';
import { SettingsContext } from '../../utils/context/Settings';

/**
 * @param {boolean} isOpen
 * @param {number} pokemonId
 * @returns {JSX.Element}
 * @constructor
 */
const PokemonNotes = ({isOpen, pokemonId}) => {
  const {notes, setNotes} = useContext(UserDataContext);
  const {language} = useContext(SettingsContext);
  const inputRef = useRef(null);
  const [inputText, setInputText] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  //Make sure to update the content when the popup opens
  useEffect(() => {
    setIsUnlocked(false);
    setInputText(notes[pokemonId] || '');
  }, [isOpen]);

  /**
   * Actual authentication method that show the available method.
   *
   * @param {function} callback
   * @returns {Promise<void>}
   */
  const authenticate = async (callback) => {
    if (authLoading) {
      return;
    }

    setAuthLoading(true);

    try {
      const results = await LocalAuthentication.authenticateAsync();

      if (results.success) {
        callback();
      } else if (results.error === 'unknown') {
        //user disabled auth biometric methods
      } else if (
        results.error === 'user_cancel' ||
        results.error === 'system_cancel' ||
        results.error === 'app_cancel'
      ) {
        //User cancelled
      }
    } catch (error) {
      //Random error
      console.log(error);
    }

    setAuthLoading(false);
  };

  //I originally wanted to be able to just press the text input instead of an extra field. But that doesn't work
  //Android doesn't like editable and/or readonly combined with press events. :(
  //@link https://github.com/facebook/react-native/issues/33649
  const onNotedUnlockPressed = () => {
    if (isUnlocked === true) {
      return;
    }
    authenticate(() => {
      setInputText(notes[pokemonId] || '');
      setIsUnlocked(true);
      //WTF Android requires this ugly hack with a timeout, else keyboard won't show
      //@link https://github.com/software-mansion/react-native-screens/issues/89
      setTimeout(() => inputRef.current.focus(), 150);
    });
  };

  //Update the local stored notes on change
  const onChangeText = (value) => {
    setInputText(value);
    if (value === '') {
      return;
    }
    setNotes({...notes, [pokemonId]: value});
  };

  /**
   * Share to external tools like WhatsApp
   */
  const shareNotes = () => {
    Share.share({
      message: inputText
    });
  };

  /**
   * Remove current contents
   */
  const clearNotes = () => {
    setInputText('');
  };

  //Unfortunately NativeWind class doesn't get respected on TextInput, have to hardcode the width & textAlignVertical
  return (
    <>
      <Pressable disabled={isUnlocked} className={`w-full mt-1 p-3 ${isUnlocked ? 'bg-gray-300' : 'bg-yellow-400'} rounded-2xl`} onPress={() => onNotedUnlockPressed()}>
        <Text className="text-black text-center font-bold">{t('detailModal.unlockNotesButton', language)}</Text>
      </Pressable>
      <KeyboardAvoidingView>
        <TextInput className="bg-white w-11/12 rounded-2xl h-20 mt-1.5 p-3 border-2"
                   editable={isUnlocked}
                   readOnly={!isUnlocked}
                   ref={ref => inputRef.current = ref}
                   value={isUnlocked ? inputText : ''}
                   placeholder={isUnlocked ? inputText : t('detailModal.unlockNotesPlaceholder', language)}
                   onChangeText={onChangeText}
                   multiline={true}
                   style={{width: 180, textAlignVertical: 'top'}}/>
      </KeyboardAvoidingView>
      {isUnlocked ? (
        <View className="flex-row justify-center my-1">
          <Pressable onPress={shareNotes} className="flex-1 p-3 bg-yellow-400 rounded-2xl items-center mx-0.5">
            <Feather name="share-2" size={20} color="black"/>
          </Pressable>
          <Pressable onPress={clearNotes} className="flex-1 p-3 bg-red-600 rounded-2xl items-center mx-0.5">
            <MaterialCommunityIcons name="text-box-remove-outline" size={20} color="black"/>
          </Pressable>
        </View>
      ) : <></>}
    </>
  );
};

export default PokemonNotes;
