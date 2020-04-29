import React from 'react';
import './App.css';
import {
  Link
} from "react-router-dom";

function Links() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/runmeasurement">Run measurement</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Links;