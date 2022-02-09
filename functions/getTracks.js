// import React, { useEffect } from 'react';
// import { useGlobalValue } from '../context/Context';
let RNFS = require('react-native-fs');
import getMeta from './getMetadata';
const getSongs = async () => {
  //   const { songs, setSongs } = React.useContext(AppContext);
  //   const [songs, setSongs] = React.useState();
  //   const [{ songs }, dispatch] = useGlobalValue();
  const resObject = {
    songs: [],
    ok: false,
    error: '',
  };
  await RNFS.readDir(RNFS.DocumentDirectoryPath).then(result => {
    if (!result) {
      resObject.error = 'Error reading the file system';
      resObject.ok = false;
    }

    result.map((item, index) => {
      if (item.isFile()) {
        if (
          item.name.includes('mp3') ||
          item.name.includes('m4a') ||
          item.name.includes('flac') ||
          item.name.includes('wav')
        ) {
          let dataObj = {
            id: index.toString(),
            url: 'file://' + item.path,
            title: item.name,
            duration: 300,
            album: '',
            artist: '',
            artwork: '',
          };
          getMeta(item.path).then(data => {
            dataObj.album = data.albumName;
            dataObj.artist = data.artist;
            dataObj.artwork = data.artwork;
          });

          resObject.songs.push(dataObj);
          console.log(dataObj);
          resObject.ok = true;
        } else {
          resObject.ok = false;
          resObject.error = 'There are no music files in your app';
        }
      }
      if (item.isDirectory()) {
      }
    });
  });
  return resObject;
};

export default getSongs;
