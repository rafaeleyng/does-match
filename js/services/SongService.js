import axios from 'axios';

export function getSongs() {
  return axios.get('./data/songs.json');
}
