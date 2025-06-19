import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
export const MY_AUDIO_FOLDER_NAME = 'MyAudioFiles';
export const MEDITATION_FOLDER_NAME = 'MantraMeditation';

const checkAudioFileOrNot = (string: string) => {
  const extensions = ['.mp3', '.wav']; // Add other extensions as needed
  for (let ext of extensions) {
    if (string.toLowerCase().endsWith(ext)) {
      return true;
    }
  }
  return false;
};

export const checkIsExist = (path: string) => RNFS.exists(path);

export const saveBase64ImageToCache = (
  base64String: string,
  tagFolderName: string,
  fileName: string,
) =>
  new Promise(async (resolve, reject) => {
    const cacheDir = RNFS.CachesDirectoryPath;
    const tagFolderPath = `${cacheDir}/${tagFolderName}`;
    const newLength = fileName.length - 4;
    const replacementString = Platform.OS == 'ios' ? '.WAV' : '.mp3';
    const isAudioFile = checkAudioFileOrNot(fileName);
    const modifiedFileName = isAudioFile
      ? fileName.slice(0, newLength) + replacementString
      : fileName;
    try {
      const isFolderExist = await checkIsExist(tagFolderPath);
      if (!isFolderExist) {
        await RNFS.mkdir(tagFolderPath);
      }
      const filePath = `${tagFolderPath}/${modifiedFileName}`;
      const isFileExists = await checkIsExist(filePath);
      if (isFileExists) {
        console.log('file already exist : ', filePath);
        resolve(null);
      }
      await RNFS.writeFile(filePath, base64String, 'base64');
      console.log('file saved successfully at:', filePath);
      resolve(filePath);
    } catch (error: any) {
      console.log(`Error In saving ${modifiedFileName} file: ${error.message}`);
      reject(error);
    }
  });
