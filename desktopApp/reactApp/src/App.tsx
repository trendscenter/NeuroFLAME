import React from 'react';
import Header from './components/Header';
import AppRoutes from './pages/AppRoutes';
<<<<<<< HEAD
=======
import { useUserState } from './contexts/UserStateContext';
import './App.css';

const App: React.FC = () => {

  const { username } = useUserState();
  const isLoggedIn = !!username;
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)

const App: React.FC = () => {
  return (
    <>
<<<<<<< HEAD
      <Header />
=======
      {isLoggedIn && <Header appUsername={username} />}
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
      <AppRoutes />
    </>
  );
};

export default App;
