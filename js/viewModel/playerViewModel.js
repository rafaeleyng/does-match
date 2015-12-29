var ko = require('knockout');
var doesMatch = require('does-match');

class PlayerViewModel {
  constructor(songService) {
    this.selectedSong = ko.observable();
    // search
    this.search = ko.observable('love some');
    this.search.subscribe(this.filterSongs.bind(this));
    // songs
    this.songsData = songService.getSongs();
    this.songs = ko.observableArray();
    this.filterSongs();

    this.showSongs = ko.observable(true);

    this.selectSong = (song) => {
      this.selectedSong(song);
    }
  }
  filterSongs() {
    var search = this.search();
    var result, showSearch;

    if (search) {
      this.songsData.forEach(function(song) {
        var matchResult = doesMatch(song.title, search, {
          highlightMatches: true,
          highlightStart: '<strong><u>',
          highlightEnd: '</u></strong>',
        });
        song.matchedText = matchResult.match;
        song.relevance = matchResult.relevance;
      });
      result = this.songsData.filter(function(song) {
        return song.relevance > 0;
      })

      result = result.sort(function(s1, s2) {
        return s1.relevance < s2.relevance;
      });
    } else {
      this.songsData.forEach(function(song) {
        song.relevance = undefined;
      });
      result = this.songsData;
    }

    this.songs.removeAll();
    ko.utils.arrayPushAll(this.songs, result);
  }
};

module.exports = PlayerViewModel;