import React, { Component } from 'react';
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import Countdown from '../containers/Countdown';
import DrawResults from '../containers/DrawResults';
import { Button } from 'react-bootstrap';
import LoadingOverlay from 'react-loading-overlay';
import { Redirect } from 'react-router'

let abortController;
export { abortController };

class LoaderText extends Component {
  render() {
    if(this.props.waittime) {
      return (
        <div>
        <Countdown waittime={this.props.waittime} continueAction={this.props.continueAction} />
        <br />
        <Button
          type="button"
          onClick={this.props.cancelAction}
          variant="secondary">
          Cancel
        </Button>
        </div>
      );
    }
    else if(this.props.fetchresults) {
      return (
        <div>
        Fetching results ...
        <br />
        <Button
          type="button"
          onClick={this.props.abfetch}
          variant="secondary">
          Cancel
        </Button>
        </div>
      );
    }
    else {
      return (
        <div>
        Measurement started.
        <br />
        Fetching first run href ...
        <br />
        <Button
          type="button"
          onClick={this.props.abfetch}
          variant="secondary">
          Cancel
        </Button>
        </div>
      );
    }
  }
}

class GetResults extends Component {

  constructor(props) {
    super(props);

    this._isMounted = false;

    const { urlparam } = this.props.match.params;

    this.state = {
      firstRunHref: decodeURIComponent(urlparam),
      waitingOverlay: false,
      actionCanceled: false,
      waitSeconds: 0,
      taskhref: '',
      resulthref: '',
      finishedstate: false,
      failedstate: false,
      failedreason: '',
      fetchresults: false,
      results: '',
    };

    this.cancelAction = this.cancelAction.bind(this);
    this.continueAction = this.continueAction.bind(this);
    this.doFetchFirstRun = this.doFetchFirstRun.bind(this);
  }

  abortFetching = async () => {
    console.log('Aborting...');
    abortController.abort();
    await this.setState({
      fetchLoading: false,
      fetchresults: false,
    });
  }

  continueAction = async () => {
    await this.setState({
      waitingOverlay: false,
      fetchresults: true,
    });

    let apiurl = TestDefaultValues.apiurl_resultshref;
    if (process.env.NODE_ENV !== 'production') {
      apiurl = TestDefaultValues.devapiurl_resultshref;
    }
    this.doFetchFirstRun(apiurl, 10)
      .catch(error => console.log(error));
  }

  doFetchFirstRun = (url, limit) =>
    fetch(
      url, {
        method: 'POST',
        signal: abortController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.firstRunHref)
      }
    )
    .then(res => res.json())
    .then(r => {
      if(r["state"] !== 'finished' && --limit) {
        let fr = r["state-display"]
        if(r["state-display"] == 'Pending' || r["state-display"] == 'Pending' || r["state-display"] == 'Pending' || r["state-display"] == 'Pending') {
          fr = fr + ' - ' + 'Please try to refresh this page in couple of seconds'
        }
        this.setState({
          fetchresults: false,
          failedstate: true,
          failedreason: fr,
          results: r["result"],
        });
      }
      else {
        this.setState({
          fetchresults: false,
          finishedstate: true,
          results: r["result"],
        });
      }
      return r;
    });

  cancelAction = async () => {
    await this.setState({
      waitingOverlay: false,
      actionCanceled: true,
    });
  }

  componentDidMount() {
    this._isMounted = true;

    abortController = new AbortController();
    let apiurl = TestDefaultValues.apiurl_firstrunhref;
    if (process.env.NODE_ENV !== 'production') {
      apiurl = TestDefaultValues.devapiurl_firstrunhref;
    }
    this.setState({fetchLoading: true});
    fetch(
      apiurl, {
        method: 'POST',
        signal: abortController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.firstRunHref)
      }
    )
    .then(res => res.json())
    .then(r => {
        this.setState({
          fetchLoading: false,
          resulthref: r["result-href"]
        });
        let curtime = new Date().getTime();
        let endtime = new Date(r["end-time"]).getTime();
        let timediff = 15 + (endtime - curtime) / 1000;
        if(timediff > 0) {
          this._isMounted && this.setState({
            fetchLoading: false,
            waitingOverlay: true,
            waitSeconds: timediff,
          });
        }
        else {
          this.continueAction();
          this._isMounted && this.setState({
            fetchLoading: false,
          });
        }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {

    if (this.state.fetchLoading) {
      return (
        <div>
          <LoadingOverlay
            spinner
            active={this.state.fetchLoading}
            text = <LoaderText cancelAction={this.cancelAction} continueAction={this.continueAction} abfetch={this.abortFetching} />
          >
            <div className="overlay">
            </div>
          </LoadingOverlay>
        </div>
      );
    }
    else if (this.state.waitingOverlay) {
      return (
        <div>
          <LoadingOverlay
            spinner
            active={this.state.waitingOverlay}
            text = <LoaderText cancelAction={this.cancelAction} continueAction={this.continueAction} waittime={this.state.waitSeconds} />
          >
            <div className="overlay">
            </div>
          </LoadingOverlay>
        </div>
      );
    }
    else if (this.state.fetchresults) {
      return (
        <div>
          <LoadingOverlay
            spinner
            active={this.state.fetchresults}
            text = <LoaderText cancelAction={this.cancelAction} continueAction={this.continueAction} abfetch={this.abortFetching} />
          >
            <div className="overlay">
            </div>
          </LoadingOverlay>;
        </div>
      );
    }
    else if (this.state.actionCanceled) {
      return <Redirect push to={{
        pathname:'/runmeasurement'
      }}
      />
    }
    else if (this.state.failedstate) {
      return (
        <div>Measurement status: {this.state.failedreason}</div>
      );
    }
    else if (this.state.finishedstate) {
      return (
        <DrawResults results={this.state.results}/>
      );
    }
    else {
      return (
        <div>
        </div>
      );
    }
  }
}
export default GetResults;
