import MediaMeta from 'react-native-media-meta';
const getMeta = async path => {
  let metaObj = {};
  await MediaMeta.get(path).then(meta => {
    metaObj['albumName'] = meta.albumName;
    metaObj['artist'] = meta.artist;
    metaObj['artwork'] = meta.thumb;
  });
  return metaObj;
};
export default getMeta;
