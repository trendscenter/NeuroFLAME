import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

function Router({ children }) {
  if (typeof window === 'undefined') {
    return <StaticRouter location="/login">{children}</StaticRouter>;
  }
  
  return (
    <MemoryRouter initialEntries={['/login']} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
}

Router.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Router;
