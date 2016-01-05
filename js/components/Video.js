import React from 'react';
import ReactDOM from 'react-dom';

export default ({selectedSong}) => {
  let video = <noscript></noscript>;
  if (selectedSong) {
    let getVideoUrl = (song) => 'https://www.youtube.com/embed/' + song.video + '?autoplay=1'
    video = (
      <iframe width="420" height="315" frameBorder="0" allowFullScreen src={getVideoUrl(selectedSong)}></iframe>
    )
  }
  return video;
}
