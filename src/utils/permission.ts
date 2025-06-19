import {PermissionsAndroid, Platform} from 'react-native';

export const requestAudioPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Audio Recording Permission',
        message: 'This app needs access to your microphone to record audio.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

export const requestNotificationPermission = async () => {
  try {
    // Check if we're on Android 13+ (API 33) or higher, as permission is required only from API 33+
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs access to send you notifications',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('Notification permission granted');
        return true;
      } else {
        console.warn('Notification permission denied');
        return false;
      }
    } else {
      console.log(
        'Notification permission not required or granted automatically.',
      );
      return true;
    }
  } catch (error) {
    console.warn('Failed to request notification permission:', error);
    return false;
  }
};

export const requestLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required', // Title of the dialog
          message:
            'This app needs to access your location for better functionality.', // Message shown in the dialog
          buttonNeutral: 'Ask Me Later', // Optional neutral button
          buttonNegative: 'Cancel', // Cancel button text
          buttonPositive: 'OK', // Confirm button text
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  } catch (error) {
    return false;
  }
};
