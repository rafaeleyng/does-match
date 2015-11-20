var songsService = {
  getSongs: function() {
    return [
      {title: 'Somebody To Love'},
      {title: 'To Love Somebody'},
      {title: 'One Way Road'}
    ];
  }
};

var AppViewModel = function() {

  this.filterSongs = function() {
    var search = this.search();
    var result;
    if (search) {
      ko.utils.arrayForEach(this.songsData, function(song) {
        song.relevance = doesMatch(song.title, search);
      });
      result = ko.utils.arrayFilter(this.songsData, function(song) {
        return song.relevance > 0;
      });
    } else {
      ko.utils.arrayForEach(this.songsData, function(song) {
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
