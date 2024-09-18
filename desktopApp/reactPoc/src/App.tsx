import React from 'react';
import Header from './components/Header';
import AppRoutes from './pages/AppRoutes';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <AppRoutes />
    </>
  );
};

export default App;
