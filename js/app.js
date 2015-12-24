var ko = require('knockout');
var songService = require('./service/songService');
var PlayerViewModel = require('./viewModel/playerViewModel');

window.onload = () => {
  ko.applyBindings(new PlayerViewModel(songService));
};
