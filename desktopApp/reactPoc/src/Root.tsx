import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Root: React.FC = () => {
  return <div>
    <ul>
      <li>
        <Link to={`/consortia`}>consortia</Link>
      </li>
      <li>
        <Link to={`/computations`}>computations</Link>
      </li>
    </ul>
    <div id="detail">
      <Outlet></Outlet>
    </div>
  </div>;
}

export default Root;
