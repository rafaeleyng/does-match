import React from 'react';
import ReactDOM from 'react-dom';
import { getSongs } from '../services/SongService';
import SongSearch from './SongSearch';
import SongTable from './SongTable';
import Video from './Video';
import doesMatch from 'does-match';

export default class SongBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: 'all the',
      songs: [],
      filteredSongs: [],
      selectedSong: undefined
    };
  }
  componentDidMount() {
    getSongs()
      .then(({data}) => {
        this.setState({
          songs: data
        });
        this.filterSongs();
      })
    ;
  }
  handleQueryChange(e) {
    let query = e.target.value;
    this.setState({
      query: query
    }, this.filterSongs);
  }
  handleSongSelection(song) {
    console.log('handleSongSelection', song);
    this.setState({
      selectedSong: song
    });
  }
  filterSongs() {
    let query = this.state.query;
    let songs = this.state.songs;
    let filteredSongs;

    if (query) {
      songs.forEach(song => {
        let matchResult = doesMatch(song.title, query, {
          highlightMatches: true,
          highlightStart: '<strong><u>',
          highlightEnd: '</u></strong>',
        });
        song.matchedTitle = matchResult.match;
        song.relevance = matchResult.relevance;
      });
      filteredSongs = songs
        .filter(song => song.relevance > 0)
        .sort((s1, s2) => s1.relevance < s2.relevance)
      ;
    } else {
      songs.forEach(song => {
        delete song.matchedTitle;
        delete song.relevance;
      });
      filteredSongs = songs;
    }

    this.setState({
      filteredSongs: filteredSongs
    });
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="offset-by-three six columns video">
            <Video selectedSong={this.state.selectedSong} />
          </div>
        </div>

        <div className="row">
          <div className="offset-by-three six columns">
            <SongSearch
              query={this.state.query}
              handleQueryChange={(e) => this.handleQueryChange(e)}
            />
          </div>
        </div>

        <div className="row">
          <div className="offset-by-three six columns">
            <SongTable
              query={this.state.query}
              songs={this.state.filteredSongs}
              handleSongSelection={(e) => this.handleSongSelection(e)}
            />
          </div>
        </div>
      </div>
    )
  }
}
