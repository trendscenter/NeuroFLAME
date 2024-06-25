import * as React from 'react';
import { useLocation } from 'react-router-dom';

export function UrlBar() {
  let location = useLocation();

  React.useEffect(() => {
    // Google Analytics
  }, [location]);

  return (
    <div>{location.pathname}</div>
  );
}