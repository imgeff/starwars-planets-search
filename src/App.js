import React, { useEffect, useState } from 'react';
import fetchStarwars from './services/fetchData';
import contextStarwars from './context/contextStarwars';
import Table from './components/Table';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchStarwars()
      .then(({ results }) => setData(results));
  }, []);
  return (
    <contextStarwars.Provider value={ data }>
      <Table />
    </contextStarwars.Provider>
  );
}

export default App;
