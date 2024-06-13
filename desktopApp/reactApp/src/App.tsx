import React from 'react';
import logo from './logo.svg';
import './App.css';
import MutationTest from './components/MutationTest';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <MutationTest></MutationTest>
      </header>
    </div>
  );
}

export default App;
