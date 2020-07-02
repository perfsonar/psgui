import React, { Component } from 'react';
import RunMeasurement from './containers/RunMeasurement';
import GetResults from './containers/GetResults';
import Links from './Links.js';
import Page404 from './Page404.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

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
  return <h3>pScheduler GUI</h3>;
}

export default App;
