import React from 'react';
import ReactDOM from 'react-dom';
import SongTableHeader from './SongTableHeader';
import SongTableBody from './SongTableBody';

export default ({query, songs, handleSongSelection}) => {
  return (
    <table className="u-full-width">
      <SongTableHeader query={query} />
      <SongTableBody query={query} songs={songs} handleSongSelection={handleSongSelection} />
    </table>
  )
}
