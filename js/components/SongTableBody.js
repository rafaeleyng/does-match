import React from 'react';
import ReactDOM from 'react-dom';
import SongRow from './SongRow';
import SongEmptyRow from './SongEmptyRow';

export default ({songs, query, handleSongSelection}) => {
  let tbody;

  if (songs.length) {
    tbody = (
      <tbody>
        {songs.map((song, i) => {
          return <SongRow key={i} song={song} query={query} handleSongSelection={handleSongSelection} />
        })}
      </tbody>
    )
  } else {
    tbody = (
      <tbody>
        <SongEmptyRow />
      </tbody>
    )
  }

  return tbody;
}
