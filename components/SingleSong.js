import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import { Image, Button, Icon, Slider } from 'react-native-elements';
import { useGlobalValue } from '../context/Context';

// import { ScrollView } from 'react-native-gesture-handler';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { SafeAreaView } from 'react-native-safe-area-context';
const deviceWidth = Dimensions.get('window').width;
const CARD_WIDTH = Dimensions.get('window').width;
const CARD_HEIGHT = Dimensions.get('window').height * 0.85;
const SPACING_FOR_CARD_INSET = Dimensions.get('window').width * 0.1 - 10;

const SingleSong = ({ navigation }) => {
  const [{ songs, playerStatus, currentSong }, dispatch] = useGlobalValue();

  // const { songDetails, index, allSongs } = route.params;
  const [songPlayerState, setSongPlayerState] = useState(false);
  const prevScrollPos = useRef(0);
  const [songData, setSongData] = useState(null);
  const progress = useProgress();
  const { duration, position } = progress;
  const BASE_URI = 'https://source.unsplash.com/random';

  const togglePlayback = async () => {
    const playerState = await TrackPlayer.getState();

    const currentTrack = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(currentTrack);
    setSongData(trackObject);
    // console.log(trackObject);
    if (trackObject === null) {
      console.log('no tracks');
    } else {
      if (
        Platform.OS === 'ios' ? playerState === 'paused' : playerState === 2
      ) {
        await TrackPlayer.play();
        setSongPlayerState(true);
      } else {
        await TrackPlayer.pause();
        setSongPlayerState(false);
      }
    }
  };
  const onScroll = useCallback(async event => {
    const horizontalOffset = event.nativeEvent.contentOffset.x;
    if (prevScrollPos.current < horizontalOffset) {
      // alert('right');
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.play();
    } else {
      // alert('left');
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
    }

    prevScrollPos.current = horizontalOffset;
  }, []);
  const onScrollEnd = () => {
    // alert('scroll ended');
  };
  return (
    <SafeAreaView style={styles.list}>
      {/* <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        scrollEventThrottle={0}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        automaticallyAdjustContentInsets
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 10}
        snapToAlignment="center"
        centerContent
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScroll}> */}
      {/* {songs.map((song, idx) => ( */}
      <View style={styles.cardStyle}>
        <Image
          onPress={togglePlayback}
          style={styles.image}
          source={{ uri: `data:image/jpeg;base64,${currentSong.artwork}` }}
          containerStyle={styles.item}
          // PlaceholderContent={<ActivityIndicator />}
        />
        <View style={styles.bottom}>
          <View style={styles.data}>
            <Text style={styles.dataText}>{currentSong.title}</Text>
            <Text style={styles.dataText}>{currentSong.artist}</Text>
            <Text style={styles.dataText}>{currentSong.album}</Text>
          </View>
          {/* <Text>{songDetails.title}</Text> */}
          <Slider
            style={styles.progressContainer}
            value={position}
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
            minimumValue={0}
            allowTouchTrack={false}
            maximumValue={Math.round(duration)}
            thumbTintColor="#FFD479"
            thumbStyle={{ height: 20, width: 20, backgroundColor: 'blue' }}
            trackStyle={{
              width: 100 + '%',
              marginLeft: 'auto',
              marginRight: 'auto',
              height: 15,
              borderRadius: 50,
              backgroundColor: '#d3d3d3',
            }}
          />
          <View style={styles.progressLabelContainer}>
            <Text style={styles.progressLabelText}>
              {new Date(position * 1000).toISOString().substr(14, 5)}
              {/* {new Date(position * 1000).getTime()} */}
            </Text>
            <Text style={styles.progressLabelText}>
              {new Date((duration - position) * 1000)
                .toISOString()
                .substr(14, 5)}
            </Text>
          </View>
        </View>
      </View>
      {/* // ))} */}
      {/* // </ScrollView> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  list: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // width: '90%',
  },
  data: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  dataText: {
    marginBottom: 5,
  },

  image: {
    // flex: 1,
    margin: 20,

    borderRadius: 20,
    // width: deviceWidth,
  },
  item: {
    marginBottom: 200,
    aspectRatio: 1,
    width: '100%',
    display: 'flex',
    alignContent: 'center',
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
  bottom: {
    bottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardStyle: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    margin: 5,
    borderRadius: 15,
  },
});
export default SingleSong;
