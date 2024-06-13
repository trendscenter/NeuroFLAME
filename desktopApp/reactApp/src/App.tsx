import React from 'react';
import './App.css';
import MutationTest from './components/MutationTest';
import PageLogin from './components/PageLogin';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <PageLogin></PageLogin>
        <MutationTest></MutationTest>
      </header>
    </div>
  );
}

export default App;
