/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
/// <reference path="./env.d.ts" />
import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2980b9" />
      <AppNavigator />
    </>
  );
};

export default App;
