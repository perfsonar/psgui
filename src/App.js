import React, { Component } from 'react';
import RunMeasurement from './containers/RunMeasurement';
import GetResults from './containers/GetResults';
import Links from './Links.js';
import Page404 from './Page404.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import TestDefaultValues from './includes/TestDefaultValues.js';

class App extends Component {

  render() {
    return (
    <Router>
      <div className="App">
        <Links />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/runmeasurement" component={RunMeasurement} />
          <Route path="/getresults/:urlparam" component={GetResults} />
          <Route path="*">
            <Page404 />
          </Route>
        </Switch>
      </div>
    </Router>
    );
  }
}

function Home() {
  return (
    <div id="page">
      <h3 className="title">pScheduler GUI</h3>
      <div className="bord b1">
        <p>
          Graphical user interface for starting on-demand measurements via pScheduler API and display the results graphically.
        </p>
      </div>
      <div className="bord b2">
        <p>
          This GUI is a part of the <a href="https://github.com/perfsonar/">perfSONAR project</a>.<br />
          <a href="https://www.perfsonar.net/"><img src="perfsonar.png" /></a>
        </p>
      </div>
      <div className="bord b3">
        <p>
          This GUI is hosted by<br /><br />
          <a href="https://www.geant.org/"><img src="logo_gn140.png" /></a><br /><br />
          as a part of the <a href="https://network.geant.org/performance-measurement-platform/">Performance Measurement Platform (PMP)</a>
        </p>
      </div>
      <div className="bord b4">
        <p>
          This GUI instance is connected to the <a href={TestDefaultValues.maddash_url}>{TestDefaultValues.maddash_url}</a>.
        </p>
      </div>
      <div className="bord b5">
        <p>
          Please report any issues at <a href="https://github.com/perfsonar/psgui/issues">psGUI perfSONAR github repository</a>
        </p>
      </div>
    </div>
  );
}

export default App;
