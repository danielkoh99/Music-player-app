// import { getSongsData } from '../functions/getSongs';
export const initialState = {
  songs: [],
  filteredSongs: [],
  playerStatus: false,
  currentSong: {},
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set_songs':
      return {
        ...state,
        songs: action.songs,
      };
    case 'set_filtered_songs':
      return {
        ...state,
        filteredSongs: action.filteredSongs,
      };
    case 'set_player_status':
      return {
        ...state,
        playerStatus: action.playerStatus,
      };
    case 'set_current_song':
      return {
        ...state,
        currentSong: action.current,
      };
    case 'set_loading':
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
};
export default reducer;
