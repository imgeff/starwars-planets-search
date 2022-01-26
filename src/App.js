import React, { useEffect, useState } from 'react';
import fetchStarwars from './services/fetchData';
import contextStarwars from './context/contextStarwars';
import Table from './components/Table';
import './App.css';

function App() {
  const [copyDataPlanets, setCopyDataPlanets] = useState([]);
  const [dataPlanets, setDataPlanets] = useState([]);
  const [filterName, setFilterName] = useState({ filterByName: { name: '' } });
  const [numericFilter, setNumericFilter] = useState(
    { column: 'population', comparison: 'maior que', value: 0 },
  );
  const [numericFilters, setNumericFilters] = useState(
    {
      filterByNumericValues: [],
    },
  );
  const [options, setOptions] = useState(
    {
      population: true,
      orbital_period: true,
      diameter: true,
      rotation_period: true,
      surface_water: true,
    },
  );

  useEffect(() => {
    const freeOptions = Object.entries(options);
    const newColumn = freeOptions.find((column) => column[1] === true);
    setNumericFilter({ ...numericFilter, column: newColumn[0] });
  }, [options]);

  useEffect(() => {
    fetchStarwars()
      .then(({ results }) => {
        setCopyDataPlanets(results);
        setDataPlanets(results);
      });
  }, []);

  useEffect(() => {
    numericFilters.filterByNumericValues.forEach((filter) => {
      const { column, comparison, value } = filter;
      if (comparison === 'maior que') {
        const filter1 = dataPlanets
          .filter((planet) => Number(planet[column]) > Number(value));
        setDataPlanets(filter1);
        setOptions({ ...options, [column]: false });
      }
      if (comparison === 'menor que') {
        const filter2 = dataPlanets
          .filter((planet) => Number(planet[column]) < Number(value));
        setDataPlanets(filter2);
        setOptions({ ...options, [column]: false });
      }
      if (comparison === 'igual a') {
        const filter3 = dataPlanets
          .filter((planet) => Number(planet[column]) === Number(value));
        setDataPlanets(filter3);
        setOptions({ ...options, [column]: false });
      }
    });
  }, [numericFilters]);

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
    setNumericFilter({ ...numericFilter, [name]: value });
  };

  const handleFilter = () => {
    setNumericFilters({
      filterByNumericValues: [
        ...numericFilters.filterByNumericValues, { ...numericFilter },
      ],
    });
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
        value={ numericFilter.column }
      >
        { options.population && <option>population</option>}
        { options.orbital_period && <option>orbital_period</option>}
        { options.diameter && <option>diameter</option>}
        { options.rotation_period && <option>rotation_period</option>}
        { options.surface_water && <option>surface_water</option>}
      </select>
      <select
        data-testid="comparison-filter"
        onChange={ handleChangeNumeric }
        name="comparison"
        value={ numericFilter.comparison }
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
        value={ numericFilter.value }
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
