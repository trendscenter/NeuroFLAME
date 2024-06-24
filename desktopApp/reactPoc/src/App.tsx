import React from 'react';
import MutationTest from './components/MutationTest';
import PageLogin from './components/PageLogin';
import ConsortiumList from './components/ConsortiumList';
import ComputationList from './components/ComputationList';

const App: React.FC = () => {
  return (
    <div className="App">
        <PageLogin></PageLogin>
        <ConsortiumList></ConsortiumList>
        <ComputationList></ComputationList>
        <MutationTest></MutationTest>

    </div>
  );
}

export default App;
