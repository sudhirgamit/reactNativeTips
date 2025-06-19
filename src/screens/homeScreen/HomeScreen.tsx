import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';
import navigationHook, {RootStackName} from '../../hooks/use-navigation';
import Context from '../../context';
import {useDispatch} from 'react-redux';
import {EntityDataAction} from '../../redux/actions';

const HomeScreen = () => {
  const [value, setValue] = useState('');
  const {setUserName} = useContext(Context);
  const dispatch = useDispatch();
  const navigation = navigationHook();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TextInput
        style={{borderWidth: 1, padding: 10, width: '80%'}}
        onChangeText={setValue}
        value={value}
        placeholder="type here ...."
      />
      <TouchableOpacity
        onPress={() => {
          if (value !== '') {
            navigation.navigate(RootStackName.ProfileScreen);
            dispatch(EntityDataAction(value));
            setUserName(value);
            setValue('');
          } else {
            Alert.alert('Add user Name');
          }
        }}
        style={{
          marginTop: 20,
          borderWidth: 1,
          width: 100,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Press</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
