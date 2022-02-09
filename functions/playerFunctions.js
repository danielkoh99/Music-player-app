const setVolumeVal = val => {
    // let vol = await TrackPlayer.getVolume();
    setVolume(val);
    console.log(volume);
};
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

const setUpTrackPlayer = async () => {
    TrackPlayer.updateOptions({
        stopWithApp: false,
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
export default { setUpTrackPlayer, togglePlayback, setVolumeVal }