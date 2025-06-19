import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
const getHeightInPercentage = (value?: number) => {
  if (value) {
    const h = (height * value) / 100;
    return h;
  }
  return height;
};
const getWidthInPercentage = (value?: number) => {
  if (value) {
    const w = (width * value) / 100;
    return w;
  }
  return width;
};
export {getHeightInPercentage, getWidthInPercentage};
