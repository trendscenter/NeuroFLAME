import React from 'react';
import MutationTest from './components/MutationTest';
import PageLogin from './components/PageLogin';
import ConsortiumList from './components/ConsortiumList';

const App: React.FC = () => {
  return (
    <div className="App">

        <PageLogin></PageLogin>
        <ConsortiumList></ConsortiumList>
        <MutationTest></MutationTest>

    </div>
  );
}

export default App;
