import axios from 'axios';

var songService = {
  getSongs: function() {
    return axios.get('./data/songs.json');
  }
};

module.exports = songService;
