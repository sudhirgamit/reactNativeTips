export const removeCopyItem = <T, K extends keyof T>(
  data: T[],
  element?: K,
) => {
  var filteredArr: T[];
  if (!Array.isArray(data) || !data) {
    console.warn('Use Array instead of object or something');
    return [];
  }
  if (typeof data[0] === 'object') {
    if (!element || typeof element !== 'string') {
      console.warn('Use second perameter as string');
      return [];
    }
    filteredArr = data.filter(
      (item, index) =>
        data.findIndex(res => res[element] === item[element]) === index,
    );
  } else {
    filteredArr = data.filter((item, index) => data.indexOf(item) === index);
    // console.log('filteredArr :', filteredArr);
  }
  return filteredArr;
};
