import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import Context from '../../context';
import navigationHook from '../../hooks/use-navigation';
import {useSelector} from 'react-redux';

const ProfileScreen = () => {
  const {userName} = useContext(Context);
  const navigation = navigationHook();

  const EntityData = useSelector((state: any) => state.entityData);
  console.log('EntityData EntityData : ', EntityData);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>{userName}</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          marginTop: 20,
          borderWidth: 1,
          width: 100,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
