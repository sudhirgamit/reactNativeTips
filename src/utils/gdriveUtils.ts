import {
  GDrive,
  ListQueryBuilder,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import axios from 'axios';
import RNFS from 'react-native-fs';
import {base64ToByteArray, binaryToBase64} from './encryption';
import {saveBase64ImageToCache} from './RNSF';
import _ from './ArrayUtils';

interface StorageQuotaType {
  limit: string;
  usage: string;
  usageInDrive: string;
  usageInDriveTrash: string;
  sizeType: string;
}
interface ResponseType {
  files: File[];
}
interface File {
  id: string;
  mimeType: MimeTypes;
  name: string;
}
interface ReturnType {
  tagName: string;
  data: TagData[];
}
interface TagData {
  name: string;
  type: MimeTypes;
  base64: string;
  createdBy: 'Recorded' | 'Imported';
}

export const ROOT_FOLDER_NAME = 'root';
export const GDRIVE_BACKUP_FOLDER_NAME = 'Mantras Repeater Backup';
export const RECORDER_FOLDER_NAME = 'Recorded';
export const IMPORTED_FOLDER_NAME = 'Imported';

// Make a request to the Google Drive API to get quota info
export const getGDriveStorageQuota = (
  accessToken: string,
): Promise<StorageQuotaType> =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/drive/v3/about?fields=storageQuota',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const quota: StorageQuotaType = response.data.storageQuota;
      quota.sizeType = 'b';
      resolve(quota);
    } catch (error: any) {
      console.log('error in getGDriveStorageQuota :', error.message);
      reject(error);
    }
  });

// creating a new folder if not exist In drive
export const createFolderIfNotExistsToGDrive = (
  accessToken: string,
): Promise<{
  parentFolderID: string;
  importFolderID: string;
  recordFolderID: string;
}> =>
  new Promise(async (resolve, reject) => {
    try {
      const gdrive = new GDrive();
      gdrive.accessToken = accessToken;
      gdrive.fetchTimeout = 1000 * 10;
      const details: any = await gdrive.files.createIfNotExists(
        {
          q: new ListQueryBuilder()
            .e('name', GDRIVE_BACKUP_FOLDER_NAME)
            .and()
            .e('mimeType', MimeTypes.FOLDER)
            .and()
            .in(ROOT_FOLDER_NAME, 'parents'),
        },
        gdrive.files.newMetadataOnlyUploader().setRequestBody({
          name: GDRIVE_BACKUP_FOLDER_NAME,
          mimeType: MimeTypes.FOLDER,
          parents: [ROOT_FOLDER_NAME], // Specify the parent ID if needed
        }),
      );
      const parentFolderID = details?.result?.id;
      const importFolderID: any = await gdrive.files.createIfNotExists(
        {
          q: new ListQueryBuilder()
            .e('name', IMPORTED_FOLDER_NAME)
            .and()
            .e('mimeType', MimeTypes.FOLDER)
            .and()
            .in(parentFolderID, 'parents'),
        },
        gdrive.files.newMetadataOnlyUploader().setRequestBody({
          name: IMPORTED_FOLDER_NAME,
          mimeType: MimeTypes.FOLDER,
          parents: [parentFolderID], // Specify the parent ID if needed
        }),
      );
      const recordFolderID: any = await gdrive.files.createIfNotExists(
        {
          q: new ListQueryBuilder()
            .e('name', RECORDER_FOLDER_NAME)
            .and()
            .e('mimeType', MimeTypes.FOLDER)
            .and()
            .in(parentFolderID, 'parents'),
        },
        gdrive.files.newMetadataOnlyUploader().setRequestBody({
          name: RECORDER_FOLDER_NAME,
          mimeType: MimeTypes.FOLDER,
          parents: [parentFolderID], // Specify the parent ID if needed
        }),
      );
      resolve({
        parentFolderID,
        importFolderID: importFolderID?.result?.id,
        recordFolderID: recordFolderID?.result?.id,
      });
    } catch (error: any) {
      console.log('error in createFolderIfNotExistsToGDrive :', error.message);
      reject(error);
    }
  });

// creating a Tag new folder if not exist In drive
export const createTagFolderIfNotExistsToGDrive = (
  accessToken: string,
  parentFolderID: string,
  tagFolderName: string,
): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      const gdrive = new GDrive();
      gdrive.accessToken = accessToken;
      gdrive.fetchTimeout = 1000 * 5;
      const tagFolder: any = await gdrive.files.createIfNotExists(
        {
          q: new ListQueryBuilder()
            .e('name', tagFolderName)
            .and()
            .e('mimeType', MimeTypes.FOLDER)
            .and()
            .in(parentFolderID, 'parents'),
        },
        gdrive.files.newMetadataOnlyUploader().setRequestBody({
          name: tagFolderName,
          mimeType: MimeTypes.FOLDER,
          parents: [parentFolderID], // Specify the parent ID if needed
        }),
      );
      resolve(tagFolder?.result?.id);
    } catch (error: any) {
      console.log(
        'error in createTagFolderIfNotExistsToGDrive :',
        error.message,
      );
      reject(error);
    }
  });

// for getting data from drive
export const getDataFromGDrive = (
  accessToken: string,
  parentFolderID: string,
  onEachRestoring?: (mantra: {
    totalMantra: number;
    restoringCount: number;
    remaining: number;
  }) => void,
): Promise<boolean> =>
  new Promise(async (resolve, reject) => {
    const gdrive = new GDrive();
    gdrive.accessToken = accessToken;
    gdrive.fetchTimeout = 10000;
    try {
      const mainFolder: ResponseType = await gdrive.files.list({
        q: new ListQueryBuilder().in(parentFolderID, 'parents'),
        fields: 'files(id, name, mimeType)',
      });
      const arr: any[] = [];
      for (let i = 0; i < mainFolder.files.length; i++) {
        const childFolder = mainFolder.files[i];
        const childFolderRes =
          (
            await gdrive.files.list({
              q: new ListQueryBuilder().in(childFolder.id, 'parents'),
              fields: 'files(id, name, mimeType)',
            })
          ).files ?? [];
        for (let j = 0; j < childFolderRes.length; j++) {
          const element = childFolderRes[j];
          if (childFolder.name === RECORDER_FOLDER_NAME) {
            const files =
              (
                await gdrive.files.list({
                  q: new ListQueryBuilder().in(element.id, 'parents'),
                  fields: 'files(id, name, mimeType)',
                })
              ).files ?? [];
            for (let k = 0; k < files.length; k++) {
              const file = files[k];
              arr.push({file, tagName: element.name});
            }
          } else {
            arr.push({file: element, tagName: IMPORTED_FOLDER_NAME});
          }
        }
      }
      if (arr.length <= 0) {
        resolve(false);
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (onEachRestoring) {
            onEachRestoring({
              totalMantra: arr.length,
              restoringCount: i + 1,
              remaining: arr.length - (i + 1),
            });
          }
          const element = arr[i];
          const getBinary: string = await gdrive.files.getBinary(
            element.file.id,
          );
          const base64 = binaryToBase64(getBinary);
          await saveBase64ImageToCache(
            base64,
            element.tagName,
            element.file.name,
          );
        }
        resolve(true);
      }
    } catch (error: any) {
      console.log('error in getDataFromGDrive :', error.message);
      reject(error);
    }
  });

function bytesToKB(bytes: number) {
  return Number((bytes / 1024).toFixed(2));
}

// for uploading data from drive
export const uploadFileToGDrive = (
  accessToken: string,
  filepath: string,
  fileName: string,
  size: number,
  parentFolderID: string,
): Promise<File | null> =>
  new Promise(async resolve => {
    const gdrive = new GDrive();
    gdrive.accessToken = accessToken;
    const fetchTimeout = (bytesToKB(size) * 60) / 10;
    gdrive.fetchTimeout = fetchTimeout > 3000 ? fetchTimeout : 3000;
    RNFS.readFile(filepath, 'base64').then(async base64String => {
      const byteArray = base64ToByteArray(base64String);
      try {
        const listfiles = await gdrive.files.list({
          q: new ListQueryBuilder()
            .e('name', fileName)
            .and()
            .in(parentFolderID, 'parents'),
        });
        // const response = (await gdrive.files.createIfNotExists(
        //   {
        //     q: new ListQueryBuilder()
        //       .e('name', fileName)
        //       .and()
        //       .in(parentFolderID, 'parents'),
        //   },
        //   gdrive.files
        //     .newMultipartUploader()
        //     .setData(byteArray, MimeTypes.BINARY) // Set the image URI and its MIME type
        //     .setRequestBody({
        //       name: fileName,
        //       parents: [parentFolderID], // Specify the folder ID if needed
        //       mimeType: MimeTypes.BINARY,
        //     }),
        // )) as any;
        // resolve(response.result);
        const response = await gdrive.files
          .newMultipartUploader()
          .setData(byteArray, MimeTypes.BINARY) // Set the image URI and its MIME type
          .setRequestBody({
            name: fileName,
            parents: [parentFolderID], // Specify the folder ID if needed
            mimeType: MimeTypes.BINARY,
          })
          .execute();
        if (!_.isEmpty(listfiles?.files)) {
          for (let i = 0; i < listfiles?.files.length; i++) {
            const element = listfiles?.files[i];
            await gdrive.files.delete(element.id);
          }
        }
        resolve(response);
      } catch (error: any) {
        resolve(null);
        console.log('error in uploadFileToGDrive :', error.message);
      }
    });
  });

// for getting each data Id from Recorded and Imported folder
export const getAllDataIds = (accessToken: string): Promise<string[]> =>
  new Promise(async (resolve, reject) => {
    const gdrive = new GDrive();
    gdrive.accessToken = accessToken;
    gdrive.fetchTimeout = 10000;
    const response = await gdrive.files.list({
      q: new ListQueryBuilder()
        .e('name', GDRIVE_BACKUP_FOLDER_NAME)
        .and()
        .in('root', 'parents'),
      fields: 'files(id)',
    });
    try {
      const mainFolder: ResponseType = await gdrive.files.list({
        q: new ListQueryBuilder().in(response.files[0].id, 'parents'),
        fields: 'files(id, name, mimeType)',
      });
      const IDs: any[] = [];
      for (let i = 0; i < mainFolder.files.length; i++) {
        const childFolder = mainFolder.files[i];
        const childFolderRes =
          (
            await gdrive.files.list({
              q: new ListQueryBuilder().in(childFolder.id, 'parents'),
              fields: 'files(id, name, mimeType)',
            })
          ).files ?? [];
        for (let j = 0; j < childFolderRes.length; j++) {
          const element = childFolderRes[j];
          if (childFolder.name === RECORDER_FOLDER_NAME) {
            const files =
              (
                await gdrive.files.list({
                  q: new ListQueryBuilder().in(element.id, 'parents'),
                  fields: 'files(id, name, mimeType)',
                })
              ).files ?? [];
            for (let k = 0; k < files.length; k++) {
              const file = files[k];
              IDs.push(file.id);
            }
          } else {
            IDs.push(element.id);
          }
        }
      }
      resolve(IDs);
    } catch (error: any) {
      console.log('error in getDataFromGDrive :', error.message);
      resolve([]);
    }
  });
