var songsService = {
  getSongs: function() {
    return [
      {title: 'Somebody To Love'},
      {title: 'To Love Somebody'},
      {title: 'One Way Road'},
      {title: 'All You Need Is Love'}
    ];
  }
};

var AppViewModel = function() {

  this.filterSongs = function() {
    var search = this.search();
    var result;
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
        delete song.relevance;
      });
      result = this.songsData;
    }
    this.songs.removeAll();
    ko.utils.arrayPushAll(this.songs, result);
  };

  this.init = function() {
    // search
    this.search = ko.observable();
    this.search.subscribe(this.filterSongs.bind(this));
    // songs
    this.songsData = songsService.getSongs();
    this.songs = ko.observableArray();
    this.filterSongs();
  };

  this.init();
};
