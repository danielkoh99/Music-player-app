import * as React from 'react';
import { ContextMenuView } from 'react-native-ios-context-menu';
import onShare from './Share';
const RNFS = require('react-native-fs');
import getSongs from '../functions/getTracks';
import { useGlobalValue } from '../context/Context';
import TrackPlayer from 'react-native-track-player';
export const Popup = props => {
  const [
    { songs, playerStatus, currentSong, filteredSongs, loading },
    dispatch,
  ] = useGlobalValue();
  return (
    <ContextMenuView
      onPressMenuItem={({ nativeEvent }) => {
        if (nativeEvent.actionKey === '1') {
          onShare(props.item);
        }
        if (nativeEvent.actionKey === '2') {
          RNFS.unlink(props.item.url).then(
            getSongs().then(res => {
              if (res.ok) {
                dispatch({
                  type: 'set_songs',
                  songs: res.songs,
                });
                dispatch({
                  type: 'set_filtered_songs',
                  filteredSongs: res.songs,
                });
              }
            }),
          );
          if (songs.length === 0) {
            dispatch({
              type: 'set_current_song',
              current: {},
            });
            TrackPlayer.destroy();
          }
          TrackPlayer.remove([props.index]);
        }
      }}
      menuConfig={{
        menuTitle: 'Actions',
        menuItems: [
          {
            actionKey: '1',
            actionTitle: 'Share song',
            icon: {
              iconType: 'SYSTEM',
              iconValue: 'square.and.arrow.up',
            },
          },
          {
            actionKey: '2',
            actionTitle: 'Delete song',
            menuAttributes: ['destructive'],
            icon: {
              type: 'IMAGE_SYSTEM',
              imageValue: {
                systemName: 'trash',
              },
            },
          },
          //   {
          //     actionKey: '2',
          //     actionTitle: 'Action #2',
          //     icon: {
          //       iconType: 'SYSTEM',
          //       iconValue: 'dial.fill',
          //     },
          //   },
          //   {
          //     actionKey: '3',
          //     actionTitle: 'Action #3',
          //     icon: {
          //       iconType: 'SYSTEM',
          //       iconValue: 'archivebox.fill',
          //     },
          //   },
        ],
      }}>
      {props.children}
    </ContextMenuView>
  );
};
