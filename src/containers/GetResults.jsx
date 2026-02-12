import React, { Component } from 'react';
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import Countdown from '../containers/Countdown';
import DrawResults from '../containers/DrawResults';
import { Button } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom'
import LoadingOverlay from "../components/LoadingOverlay";


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

  abortController = new AbortController();

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
      fetchError: null,
      results: '',
    };

    this.cancelAction = this.cancelAction.bind(this);
    this.continueAction = this.continueAction.bind(this);
    this.doFetchFirstRun = this.doFetchFirstRun.bind(this);
  }

  abortFetching = async () => {
    console.log('Aborting...');
    this.abortController.abort();
    await this.setState({
      fetchLoading: false,
      fetchresults: false,
    });
  }

  isAbortError = (err) => 
    err?.name === "AbortError" ||
    err?.code === 20 ||
    String(err).toLowerCase().includes("aborted");
  

  continueAction = () => {
    this.abortController = new AbortController();

    this.setState({
      waitingOverlay: false,
      fetchresults: true,
      fetchError: null,
    });

    let apiurl = TestDefaultValues.apiurl_resultshref;
    if (process.env.NODE_ENV !== "production") {
      apiurl = TestDefaultValues.devapiurl_resultshref;
    }

    this.doFetchFirstRun(apiurl, 3)
      .catch((err) => {
        if (this.isAbortError(err)) return;

        console.error(err);
        this.setState({
          fetchError: err?.message || "Failed to fetch results. Please try again.",
        });
      })
      .finally(() => {
        // always clear spinner unless request was aborted and you intentionally want it to stay
        this.setState({ fetchresults: false });
      });
  };

  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  doFetchFirstRun = async (url, limit) => {
    try {
      while (limit > 0) {
        const res = await fetch(url, {
          method: "POST",
          signal: this.abortController.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state.firstRunHref),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        const r = await res.json();

        // Finished → success
        if (r["state"] === "finished") {
          this.setState({
            fetchresults: false,
            finishedstate: true,
            failedstate: false,
            failedreason: null,
            results: r["result"],
          });
          return r;
        }

        // Not finished yet → wait and try again
        limit -= 1;
        if (limit > 0) {
          await this.sleep(200);
          continue;
        }

        // Out of retries → treat as failure (but not a crash)
        let fr = r["state-display"] || r["state"] || "Not finished";
        if (
          fr === "Pending" ||
          fr === "Running" ||
          fr === "Cleanup" ||
          fr === "On Deck"
        ) {
          fr = `${fr} - Please refresh this page in a couple of seconds`;
        }

        this.setState({
          fetchresults: false,
          failedstate: true,
          finishedstate: false,
          failedreason: fr,
          results: r["result"],
        });
        return r;
      }
    } catch (err) {
      if (this.isAbortError(err)) return; // ignore aborts

      // Ensure spinner stops and show a real failure state
      this.setState({
        fetchresults: false,
        failedstate: true,
        finishedstate: false,
        failedreason: err?.message || "Failed to fetch results.",
      });

      throw err; // optional: rethrow if caller wants it
    }
  };


  cancelAction = async () => {
    await this.setState({
      waitingOverlay: false,
      actionCanceled: true,
    });
  }

  componentDidMount() {
    this._isMounted = true;
    this.abortController = new AbortController();

    let apiurl = TestDefaultValues.apiurl_firstrunhref;
    if (process.env.NODE_ENV !== 'production') {
      apiurl = TestDefaultValues.devapiurl_firstrunhref;
    }
    this.setState({fetchLoading: true});
    fetch(
      apiurl, {
        method: 'POST',
        signal: this.abortController.signal,
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
        let servendtime = r["end-time"];

        var re = new RegExp(/([+\-]\d\d)$/);
        if(re.test(servendtime)) {
          servendtime = servendtime + ':00';
        }
        let endtime = new Date(servendtime).getTime();
        let timediff = 20 + (endtime - curtime) / 1000;
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
    .catch(err => {
      if (this.isAbortError(err)) return; // ignore aborts
      console.error(err);
      this.setState({ fetchLoading: false, failedstate: true, failedreason: String(err) });
    });    
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.abortController) this.abortController.abort();
  }

  render() {

    if (this.state.fetchLoading) {
      return (
        <div>
          <LoadingOverlay
            spinner
            active={this.state.fetchLoading}
            text = {<LoaderText cancelAction={this.cancelAction} continueAction={this.continueAction} abfetch={this.abortFetching} fetchresults={this.state.fetchresults} />}
          >
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
            text = {<LoaderText cancelAction={this.cancelAction} continueAction={this.continueAction} waittime={this.state.waitSeconds} fetchresults={this.state.fetchresults} />}
          >
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
            text = {<LoaderText cancelAction={this.cancelAction} continueAction={this.continueAction} abfetch={this.abortFetching} fetchresults={this.state.fetchresults} />}
          >
          </LoadingOverlay>
        </div>
      );
    }
    else if (this.state.actionCanceled) {
      return <Navigate to="/runmeasurement" replace />;
    }
    else if (this.state.failedstate) {
      return (
        <div>Measurement status: {this.state.failedreason} <a href={this.state.firstRunHref}>{this.state.firstRunHref}</a></div>
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

function GetResultsWrapper(props) {
  // get route params from React Router v6
  const { urlparam } = useParams();

  // emulate the old `match` object React Router v5 used to inject
  const match = {
    params: {
      urlparam,
    },
  };

  return <GetResults {...props} match={match} />;
}

export default GetResultsWrapper;
