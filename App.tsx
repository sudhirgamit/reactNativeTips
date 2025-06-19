/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import StackNavigation from './src/navigation/stack/StackNavigation';
import ContextProvider from './src/context/provider';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <ContextProvider>
        <Provider store={store}>
          <StackNavigation />
        </Provider>
      </ContextProvider>
    </NavigationContainer>
  );
}

export default App;
