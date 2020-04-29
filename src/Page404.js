import React from 'react';
import './App.css';
import {
  useLocation
} from "react-router-dom";

function Page404() {

  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

export default Page404;
