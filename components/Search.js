import * as React from 'react';
import { useState, useContext, useEffect, useRef } from 'react';
import { SearchBar } from 'react-native-elements';
import { useGlobalValue } from '../context/Context';
const Search = () =>
  // { data, updateSearch }
  {
    // console.log(data);
    const [{ filteredSongs }, dispatch] = useGlobalValue();
    // const [context, setContext] = useContext(AppContext);
    // const [songData, setSongData] = useState(data);
    // const [toggleSearchBar, setToggleSearchBar] = useState(false);
    const [search, setsearch] = useState('');
    // const searchBarAnim = useRef(-45).current;
    // useEffect(() => {
    //   if (toggleSearchBar) {
    //     Animated.timing(searchBarAnim, {
    //       toValue: 0,
    //       duration: 300,
    //     }).start();
    //   } else {
    //     Animated.timing(searchBarAnim, {
    //       toValue: -45,
    //       duration: 300,
    //     }).start();
    //   }
    // }, [searchBarAnim, toggleSearchBar]);
    const dynamicSearch = () => {
      return songData.title.filter(name => console.log(name.title));
      //   name.title.toLowercase().includes(search.toLowercase()),
    };
    const updateSearch = text => {
      setsearch(text.toLowerCase());
      if (text === '') {
        // setState(filterState);
        // dispatch({
        //   type: 'set_songs',
        //   songs: filterData,
        // });
        return;
      } else {
        let filterData = filteredSongs.filter(song => {
          console.log(song.title);
          console.log(search);
          return song.title.toLowerCase().includes(search);
        });

        // setState(filterData);
        dispatch({
          type: 'set_songs',
          songs: filterData,
        });
      }
    };
    // const updateSearch = text => {
    //   setsearch(text);

    //   // console.log(search);
    // };

    return (
      // <Animated.View style={{transform: [{translateY: searchBarAnim}]}}>
      <SearchBar
        placeholder="Type Here..."
        platform="ios"
        onChangeText={text => {
          updateSearch(text);
          // setsearch(text);
        }}
        value={search}
      />
      // </Animated.View>
    );
  };
export default Search;
