import AsyncStorage from '@react-native-async-storage/async-storage';
import {legacy_createStore as createStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import reducer from './reducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [''],
};

// for storeing data in Async storege
// const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(reducer);

export const persistor = persistStore(store);
