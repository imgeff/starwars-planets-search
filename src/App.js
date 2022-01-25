import React, { useEffect, useState } from 'react';
import fetchStarwars from './services/fetchData';
import contextStarwars from './context/contextStarwars';
import Table from './components/Table';
import './App.css';

function App() {
  const [copyDataPlanets, setCopyDataPlanets] = useState([]);
  const [dataPlanets, setDataPlanets] = useState([]);
  const [filterName, setFilterName] = useState({ filterByName: { name: '' } });

  useEffect(() => {
    fetchStarwars()
      .then(({ results }) => {
        setCopyDataPlanets(results);
        setDataPlanets(results);
      });
  }, []);

  const filterPlanets = (name) => {
    const filterPlanetName = copyDataPlanets
      .filter((planet) => planet.name.includes(name));
    if (filterName !== ' ') {
      setDataPlanets(filterPlanetName);
    } else {
      setDataPlanets(copyDataPlanets);
    }
  };

  const handleChange = ({ target }) => {
    setFilterName({ filterByName: { name: target.value } });
    filterPlanets(target.value);
  };
  return (
    <contextStarwars.Provider value={ dataPlanets }>
      <input
        data-testid="name-filter"
        placeholder="name planet"
        type="text"
        name="filterName"
        onChange={ handleChange }
        value={ filterName.filterByName.name }
      />
      <Table />
    </contextStarwars.Provider>
  );
}

export default App;
