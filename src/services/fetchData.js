const URL = 'https://swapi-trybe.herokuapp.com/api/planets/';

function fetchStarwars() {
  return fetch(URL)
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.error(err));
}

export default fetchStarwars;
