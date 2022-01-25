import React, { useEffect, useState } from 'react';
import fetchStarwars from './services/fetchData';
import contextStarwars from './context/contextStarwars';
import Table from './components/Table';
import './App.css';

function App() {
  const [copyDataPlanets, setCopyDataPlanets] = useState([]);
  const [dataPlanets, setDataPlanets] = useState([]);
  const [filterName, setFilterName] = useState({ filterByName: { name: '' } });
  const [filterNumber, setFilterNumber] = useState(
    {
      filterByNumericValues: [{
        column: 'population', comparison: 'maior que', value: 0,
      }],
    },
  );

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

  const handleChangeNumeric = ({ target: { name, value } }) => {
    setFilterNumber({
      filterByNumericValues: [{
        ...filterNumber.filterByNumericValues[0], [name]: value,
      }],
    });
  };

  const handleFilter = () => {
    const columnFilter = filterNumber.filterByNumericValues[0].column;
    const comparisonFilter = filterNumber.filterByNumericValues[0].comparison;
    const valueFilter = filterNumber.filterByNumericValues[0].value;
    if (comparisonFilter === 'maior que') {
      const filter = copyDataPlanets
        .filter((planet) => Number(planet[columnFilter]) > Number(valueFilter));
      setDataPlanets(filter);
    }
    if (comparisonFilter === 'menor que') {
      const filter = copyDataPlanets
        .filter((planet) => Number(planet[columnFilter]) < Number(valueFilter));
      setDataPlanets(filter);
    }
    if (comparisonFilter === 'igual a') {
      const filter = copyDataPlanets
        .filter((planet) => Number(planet[columnFilter]) === Number(valueFilter));
      setDataPlanets(filter);
    }
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
      <select
        data-testid="column-filter"
        onChange={ handleChangeNumeric }
        name="column"
        value={ filterNumber.filterByNumericValues[0].column }
      >
        <option>population</option>
        <option>orbital_period</option>
        <option>diameter</option>
        <option>rotation_period</option>
        <option>surface_water</option>
      </select>
      <select
        data-testid="comparison-filter"
        onChange={ handleChangeNumeric }
        name="comparison"
        value={ filterNumber.filterByNumericValues[0].comparison }
      >
        <option>maior que</option>
        <option>menor que</option>
        <option>igual a</option>
      </select>
      <input
        data-testid="value-filter"
        type="number"
        onChange={ handleChangeNumeric }
        name="value"
        value={ filterNumber.filterByNumericValues[0].value }
        min="0"
      />
      <button data-testid="button-filter" type="button" onClick={ handleFilter }>
        Filtrar
      </button>
      <Table />
    </contextStarwars.Provider>
  );
}

export default App;
