import 'react-native-gesture-handler';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import { useEffect, useState } from 'react';
import { AppContext, Context } from './context/Context';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Platform, StatusBar, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { navigation } from '@react-navigation/native';
import SingleSong from './components/SingleSong';
import MusicList from './components/MusicList';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { Icon } from 'react-native-elements';
import reducer, { initialState } from './context/reducer';
import TrackPlayer from 'react-native-track-player';
import SkeletonLoader from './components/SkeletonLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { setupTrackPlayer } from './functions/playerFunctions';
let RNFS = require('react-native-fs');
const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createMaterialTopTabNavigator();
  const setUpTrackPlayer = async () => {
    TrackPlayer.updateOptions({
      stopWithApp: false,
      forwardJumpInterval: 15,
      backwardJumpInterval: 15,

      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
      ],
    });

    await TrackPlayer.setupPlayer();

    await TrackPlayer.pause();
  };
  useEffect(() => {
    setUpTrackPlayer();
  }, []);
  return (
    <Context reducer={reducer} initialState={initialState}>
      {/* <SafeAreaView> */}
      <NavigationContainer>
        <Tab.Navigator tabBar={() => null}>
          <Tab.Screen
            name="Player"
            component={MusicList}
            // options={{s
            //   headerShown: false,
            //   headerBackVisible: false,
            // }}
          ></Tab.Screen>
          <Tab.Screen name="Single" component={SingleSong}></Tab.Screen>
        </Tab.Navigator>
        {/* <Stack.Navigator>
          <Stack.Screen
            name="Player"
            component={MusicList}
            options={{
              headerShown: false,
              headerBackVisible: false,
            }}></Stack.Screen>
          <Stack.Screen name="Single" component={SingleSong}></Stack.Screen>
        </Stack.Navigator>*/}
      </NavigationContainer>
      {/* </SafeAreaView> */}
    </Context>
  );
};

export default App;
