import {NavigationProp, useNavigation} from '@react-navigation/native';
type params1 = {
  screen: string;
  params?: params2;
};
type params2 = {
  screen: string;
  params?: params1;
};

export enum RootStackName {
  HomeScreen = 'HomeScreen',
  ProfileScreen = 'ProfileScreen',
}

const navigationHook = () => {
  const navigation = useNavigation<NavigationProp<RootStackName>>();
  return navigation;
};

export default navigationHook;
