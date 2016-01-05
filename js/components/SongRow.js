import React from 'react';
import ReactDOM from 'react-dom';

export default ({song, query, handleSongSelection}) => {
  let row;

  if (query) {
    let getTitleHTML = s => {
      return {__html: s.matchedTitle}
    };

    row = (
      <tr onClick={() => handleSongSelection(song)}>
        <td>
          <span dangerouslySetInnerHTML={getTitleHTML(song)}></span>
          <span className="song-author">{song.author}</span>
        </td>
        <td>{song.relevance}</td>
      </tr>
    )
  } else {
    row = (
      <tr onClick={handleSongSelection}>
        <td>
          <span>{song.title}</span>
          <span className="song-author">{song.author}</span>
        </td>
      </tr>
    )
  }

  return row;
}
