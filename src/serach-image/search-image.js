import axios from 'axios';
const API_KEY = '30007287-c01b0e4a3e2dffba00e51bbf9';

export function searchImage(name, page) {
  return axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
}
