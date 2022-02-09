import getSongs from '../functions/getTracks';
import React from 'react';
import { Popup } from './ContextMenu';
import { ActivityIndicator } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { useGlobalValue } from '../context/Context';
const renderItem = ({ item, index, navigation }) => {
  // const [{ songs, playerStatus, currentSong, filteredSongs }, dispatch] =
  //   useGlobalValue();

  return (
    <Popup item={item}>
      <ListItem.Swipeable
        onPress={async () => {
          await item;
          console.log(index);
          navigation.navigate('Single');
          // openPlayer(item, index);
        }}
        rightContent={
          <Button
            title="Delete"
            icon={{ name: 'delete', color: 'white' }}
            buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
            onPress={() => {
              if (actionSheet(item.url) === 'deleted') {
                getSongs();
              }
            }}
          />
        }
        containerStyle={{ backgroundColor: '#303F7F' }}
        bottomDivider>
        <ListItem.Content>
          <ListItem.Title style={{ color: 'black', fontWeight: '500' }}>
            {/* {currentSong.title === item.title ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : null} */}
            {item.title}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: 'black', fontWeight: '300' }}>
            {item.artist}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem.Swipeable>
    </Popup>
  );
};

export default renderItem;
