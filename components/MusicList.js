/* eslint-disable react-native/no-inline-styles */
import React, { createRef } from 'react';

import {
  FlatList,
  Dimensions,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  View,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useContext,
} from 'react';
import { ListItem, Button, Slider, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
let RNFS = require('react-native-fs');
import Search from './Search';
import Animate from './Animation';
import BottomSheet from '@gorhom/bottom-sheet';
import SkeletonLoader from './SkeletonLoader';
import TrackPlayer, {
  TrackPlayerEvents,
  useTrackPlayerProgress,
  useTrackPlayerEvents,
  RepeatMode,
  RatingType,
  useProgress,
} from 'react-native-track-player';
import Animated from 'react-native-reanimated';
import { Popup } from './ContextMenu';
import { actionSheet } from '../functions/actionSheet';
const AnimatedView = Animated.View;
const deviceHeight = Dimensions.get('window').height;
import getSongs from '../functions/getTracks';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { useGlobalValue } from '../context/Context';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const MusicList = ({ navigation }) => {
  const [
    { songs, playerStatus, currentSong, filteredSongs, loading },
    dispatch,
  ] = useGlobalValue();
  const bottomSheetRef = useRef(null);
  const doubleTapRef = useRef(null);
  // const [loading, setloading] = useState(true);
  // const [songData, setSongData] = useState(null);
  // const [songPlayerState, setSongPlayerState] = useState(false);
  // const [isSeeking, setIsSeeking] = useState(false);
  // const [seek, setSeek] = useState(0);
  // const [sheetChangeIndex, setSheetChangeIndex] = useState(0);
  const isFocused = useIsFocused();
  // const { duration, position } = progress;
  // const progress = useProgress();
  // const [screenChange, setScreenChange] = useState(false);

  const [volume, setVolume] = useState(0.22);

  // variables
  const snapPoints = useMemo(() => ['15%'], []);
  const [state, setState] = useState([]);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    updateTracks();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  // const setUpTrackPlayer = async () => {
  //   TrackPlayer.updateOptions({
  //     stopWithApp: false,
  //     forwardJumpInterval: 15,
  //     backwardJumpInterval: 15,

  //     capabilities: [
  //       TrackPlayer.CAPABILITY_PLAY,
  //       TrackPlayer.CAPABILITY_PAUSE,
  //       TrackPlayer.CAPABILITY_SEEK_TO,
  //     ],
  //     compactCapabilities: [
  //       TrackPlayer.CAPABILITY_PLAY,
  //       TrackPlayer.CAPABILITY_PAUSE,
  //     ],
  //   });

  //   await TrackPlayer.setupPlayer();

  //   await TrackPlayer.pause();
  // };

  // useEffect(() => {
  //   updateTracks();
  // }, [updateTracks]);
  const updateTracks = () => {
    dispatch({
      type: 'set_songs',
      songs: [],
    });
    dispatch({
      type: 'set_loading',
      loading: true,
    });
    // wait(2000);
    getSongs().then(res => {
      if (res.ok) {
        // console.log(res.songs);
        // setFilterState(res.songs);
        // setState(res.songs);
        TrackPlayer.getQueue().then(track => {
          if (!track[0]) {
            TrackPlayer.add(res.songs);
          }
        });
        // dispatch({
        //   type: 'set_current_song',
        //   current: res.songs[0],
        // });

        console.log(currentSong);
        dispatch({
          type: 'set_loading',
          loading: false,
        });
        dispatch({
          type: 'set_songs',
          songs: res.songs,
        });
        dispatch({
          type: 'set_filtered_songs',
          filteredSongs: res.songs,
        });
      }
      // wait(2000)
      // dispatch({
      //   type: 'set_songs',
      //   songs: res.songs,
      // });
    });
  };
  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, []),
  );

  const setVolumeVal = val => {
    // let vol = await TrackPlayer.getVolume();
    setVolume(val);
    console.log(volume);
  };
  const togglePlayback = async () => {
    const playerState = await TrackPlayer.getState();

    const currentTrack = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(currentTrack);
    // setSongData(trackObject);
    dispatch({
      type: 'set_current_song',
      current: trackObject,
    });
    // console.log(trackObject);
    if (trackObject === null) {
      console.log('no tracks');
    } else {
      if (
        Platform.OS === 'ios' ? playerState === 'paused' : playerState === 2
      ) {
        await TrackPlayer.play();
        // setSongPlayerState(true);
        dispatch({
          type: 'set_player_status',
          playerStatus: true,
        });
      } else {
        await TrackPlayer.pause();
        // setSongPlayerState(false);
        dispatch({
          type: 'set_player_status',
          playerStatus: false,
        });
      }
    }
  };
  TrackPlayer.addEventListener('playback-queue-ended', async () => {
    await TrackPlayer.skip(0);
    wait(1000);
    await TrackPlayer.play();
  });
  TrackPlayer.addEventListener('playback-track-changed', async () => {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    dispatch({
      type: 'set_current_song',
      current: trackObject,
    });
  });
  //   await TrackPlayer.pause();
  // });
  // const handleSheetChanges = useCallback(
  //   index => {
  //     console.log('sheetChangeIndex', index);
  //     const showSongTitle = i => {
  //       setSheetChangeIndex(i);
  //     };
  //     showSongTitle(index);
  //   },
  //   [sheetChangeIndex],
  // );
  const openPlayer = async (song, index) => {
    console.log(song);

    // setSongData(song);
    dispatch({
      type: 'set_current_song',
      current: song,
    });
    // setSongPlayerState(true);

    dispatch({
      type: 'set_player_status',
      playerStatus: true,
    });
    navigation.navigate(
      'Single',
      // {
      //   songDetails: song,
      //   index: index,
      //   allSongs: songs,
      // }
    );
    await TrackPlayer.skip(index);
    await TrackPlayer.play();

    // array of songs, add id of
    //  song as first one and feed to player
    // bottomSheetRef.current.snapToIndex(1);
    // TrackPlayer.pause();
    // wait(1000);
  };
  const destroyPlayer = async () => {
    await TrackPlayer.destroy();
  };
  const onDoubleTapEvent = async event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // alert('doubled');
      TrackPlayer.skipToNext();
      const currentTrack = await TrackPlayer.getCurrentTrack();
      let trackObject = await TrackPlayer.getTrack(currentTrack);
      // setSongData(trackObject);
      dispatch({
        type: 'set_current_song',
        current: trackObject,
      });
    }
  };
  const onSingleTapEvent = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      togglePlayback();
    }
  };

  const updateSearch = text => {
    setSearch(text.toLowerCase());
    // let filterData = [];
    if (text === '') {
      dispatch({
        type: 'set_songs',
        songs: songs,
      });
      return;
    } else {
      // console.log(filteredSongs);
      let filterData = filteredSongs.filter(song => {
        // console.log(song.title);
        // console.log(search);
        return song.title.toLowerCase().includes(search);
      });

      // setState(filterData);
      dispatch({
        type: 'set_songs',
        songs: filterData,
      });
    }
  };

  const renderItem = ({ item, index }) => (
    <Popup item={item} index={index}>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <ListItem
          onPress={async () => {
            await item;
            console.log(index);
            openPlayer(item, index);
          }}
          // rightContent={
          //   <Button
          //     title="Delete"
          //     icon={{ name: 'delete', color: 'white' }}
          //     buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
          //     onPress={() => {
          //       actionSheet(item.url);
          //       onRefresh();
          //     }}
          //   />
          // }
          containerStyle={{ backgroundColor: '#303F7F' }}
          bottomDivider>
          <ListItem.Content
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <Image
              style={{ width: 30, height: 30 }}
              source={{ uri: `data:image/jpeg;base64,${item.artwork}` }}
              containerStyle={styles.item}
              PlaceholderContent={<ActivityIndicator />}
            />
            <ListItem.Title style={{ color: 'black', fontWeight: '500' }}>
              {currentSong.title === item.title ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : null}
              {item.title}
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: 'black', fontWeight: '300' }}>
              {item.artist}
            </ListItem.Subtitle>
            <ListItem.Subtitle style={{ color: 'black', fontWeight: '300' }}>
              {item.album}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      )}
    </Popup>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListEmptyComponent={
          <ListItem>
            <ListItem.Title style={{ color: 'black', fontWeight: '500' }}>
              You have no songs,please add songs to the app's local folder
            </ListItem.Title>
          </ListItem>
        }
        extraData={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item, index) => item.url}
        data={songs}
        stickyHeaderHiddenOnScroll={true}
        initialNumToRender={15}
        stickyHeaderIndices={[0]}
        renderItem={renderItem}
        ListHeaderComponent={
          <Search data={state} updateSearch={updateSearch} />
        }
      />
      {currentSong === {} ? null : (
        <BottomSheet
          animateOnMount={true}
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          bottomInset={50}
          // onClose={closePlayer}
          enablePanDownToClose={false}
          // onChange={handleSheetChanges}
          detached={true}
          backgroundStyle={{ opacity: 0.7 }}
          style={styles.sheetContainer}>
          <View style={styles.contentContainer}>
            <TouchableOpacity>
              <TapGestureHandler
                onHandlerStateChange={onSingleTapEvent}
                waitFor={doubleTapRef}>
                <TapGestureHandler
                  ref={doubleTapRef}
                  numberOfTaps={2}
                  onHandlerStateChange={onDoubleTapEvent}>
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    {TrackPlayer.getState() === 'playing' ? (
                      <ActivityIndicator size="large" color="#0000ff" />
                    ) : null}
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          marginLeft: 10,
                          fontSize: 20,
                        }}>
                        {currentSong !== {} && currentSong.title !== ''
                          ? currentSong.title
                          : songs !== [] &&
                            songs !== undefined &&
                            songs[0] &&
                            songs[0].title
                          ? songs[0].title
                          : ''}
                      </Text>
                      <Text
                        style={{
                          textAlign: 'center',
                          marginBottom: 10,
                          fontSize: 14,
                        }}>
                        {currentSong !== {}
                          ? currentSong.artist
                          : songs !== null && songs !== undefined && songs[0]
                          ? songs[0].artist
                          : ''}
                      </Text>
                    </View>
                  </View>
                </TapGestureHandler>
              </TapGestureHandler>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

// const renderItem = ({ item, index }) => {
//   const [{ songs, playerStatus, currentSong, filteredSongs }, dispatch] =
//     useGlobalValue();

//   return (
//     <Popup item={item}>
//       <ListItem.Swipeable
//         onPress={async () => {
//           await item;
//           console.log(index);
//           // openPlayer(item, index);
//           dispatch({
//             type: 'set_current_song',
//             current: item,
//           });
//           // setSongPlayerState(true);

//           dispatch({
//             type: 'set_player_status',
//             playerStatus: true,
//           });
//           navigation.navigate(
//             'Single',
//             // {
//             //   songDetails: song,
//             //   index: index,
//             //   allSongs: songs,
//             // }
//           );
//           await TrackPlayer.skip(index);
//           await TrackPlayer.play();
//         }}
//         rightContent={
//           <Button
//             title="Delete"
//             icon={{ name: 'delete', color: 'white' }}
//             buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
//             onPress={() => {
//               // if (actionSheet(item.url) === 'deleted') {
//               //   getData();
//               // }
//             }}
//           />
//         }
//         containerStyle={{ backgroundColor: '#303F7F' }}
//         bottomDivider>
//         <ListItem.Content>
//           <ListItem.Title style={{ color: 'black', fontWeight: '500' }}>
//             {/* {currentSong.title === item.title ? (
//             <ActivityIndicator size="small" color="#0000ff" />
//           ) : null} */}
//             {item.title}
//           </ListItem.Title>
//           <ListItem.Subtitle style={{ color: 'black', fontWeight: '300' }}>
//             {item.artist}
//           </ListItem.Subtitle>
//         </ListItem.Content>
//       </ListItem.Swipeable>
//     </Popup>
//   );
// };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: -40,
  },

  sheetContainer: {
    marginHorizontal: 15,
  },
  fullScreenSheetContainer: {
    marginHorizontal: 0,
  },
  fullScreenContainer: {
    flex: 1,
    padding: 0,
    backgroundColor: 'grey',
  },
  contentContainer: {
    display: 'flex',
  },

  bottomSheet: {
    bottom: 60,
  },
  bottom: {
    bottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  progressContainer: {
    justifyContent: 'center',
    // height: 40,
    alignSelf: 'center',
    width: 85 + '%',
    // marginTop: 25,
    // flexDirection: 'row',
  },
  progressLabelContainer: {
    width: 350,
    marginLeft: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 14.5,
  },
  progressLabelText: {
    color: 'black',
    fontVariant: ['tabular-nums'],
  },
  imageContainer: {
    flex: 1,
    marginTop: deviceHeight - 800,
  },
  image: {
    width: 300,
    height: 300,
  },
  player: {
    flex: 1,
    alignItems: 'center',
  },
});
export default MusicList;
