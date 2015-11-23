var songsService = {
  getSongs: function() {
    return [
      {title: 'Somebody To Love', author: 'Queen', video: 'kijpcUv-b8M'},
      {title: 'To Love Somebody', author: 'Bee Gees', video: 'ykU8iSKkJR0'},
      {title: 'One Way Road', author: 'John Butler Trio', video: 'n5f3gfFtHY8'},
      {title: 'All You Need Is Love', author: 'The Beatles', video: 'x9_vhYpR9xo'}
    ];
  }
};

var AppViewModel = function() {

  this.filterSongs = function() {
    var search = this.search();
    var result, showSearch;

    if (search) {
      this.songsData.forEach(function(song) {
        song.relevance = doesMatch(song.title, search);
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
  };

  this.selectSong = function(song) {
    this.selectedSong(song);
  }.bind(this);

  this.init = function() {
    this.selectedSong = ko.observable();
    // search
    this.search = ko.observable('love some');
    this.search.subscribe(this.filterSongs.bind(this));
    // songs
    this.songsData = songsService.getSongs();
    this.songs = ko.observableArray();
    this.filterSongs();

    this.showSongs = ko.observable(true);
  };

  this.init();
};
