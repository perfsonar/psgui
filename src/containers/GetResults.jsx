import React, { Component } from 'react';
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import Countdown from '../containers/Countdown';
import DrawResults from '../containers/DrawResults';
import { Button } from 'react-bootstrap';
import { Navigate, useParams, useNavigate } from "react-router-dom";
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

  _isMounted = false;

  abortController = new AbortController();

  constructor(props) {
    super(props);

    this._isMounted = false;

    const { urlparam } = this.props.match.params;

    let decodedUrl = null;

    try {
      decodedUrl = decodeURIComponent(urlparam);
    } catch {
      decodedUrl = null;
    }

    this.state = {
      firstRunHref: this.sanitizeHref(decodedUrl),
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

  safeSetState = (update) => {
    if (this._isMounted) this.setState(update);
  };

  abortFetching = () => {
    this.abortController?.abort();
    this.props.navigate?.("/runmeasurement", { replace: true });
  };

  isAbortError = (err) =>
    err?.name === "AbortError" ||
    err?.code === 20 ||
    String(err).toLowerCase().includes("aborted");


  continueAction = () => {
    this.abortController = new AbortController();

    this.safeSetState({
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
        this.safeSetState({
          fetchError: err?.message || "Failed to fetch results. Please try again.",
        });
      })
      .finally(() => {
        this.safeSetState({ fetchresults: false });
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
          this.safeSetState({
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

        this.safeSetState({
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
      this.safeSetState({
        fetchresults: false,
        failedstate: true,
        finishedstate: false,
        failedreason: err?.message || "Failed to fetch results.",
      });

      throw err; // optional: rethrow if caller wants it
    }
  };


  cancelAction = () => {
    this.safeSetState({
      waitingOverlay: false,
      actionCanceled: true,
    });
  };

  componentDidMount() {
    this._isMounted = true;

    if (!this.state.firstRunHref) {
      this.safeSetState({
        failedstate: true,
        failedreason: "Invalid measurement URL.",
      });
      return;
    }

    this.abortController = new AbortController();

    let apiurl = TestDefaultValues.apiurl_firstrunhref;
    if (process.env.NODE_ENV !== 'production') {
      apiurl = TestDefaultValues.devapiurl_firstrunhref;
    }
    this.safeSetState({fetchLoading: true});
    fetch(
      apiurl, {
        method: 'POST',
        signal: this.abortController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.firstRunHref)
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        return res.json();
      })
      .then(r => {
        this.safeSetState({
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
          this.safeSetState({
            fetchLoading: false,
            waitingOverlay: true,
            waitSeconds: timediff,
          });
        }
        else {
          this.continueAction();
          this.safeSetState({
            fetchLoading: false,
          });
        }
    })
    .catch(err => {
      if (this.isAbortError(err)) return; // ignore aborts
      console.error(err);
      this.safeSetState({ fetchLoading: false, failedstate: true, failedreason: String(err) });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.abortController) this.abortController.abort();
  }

  sanitizeHref = (raw) => {
    if (!raw) return null;
    const s = String(raw).trim();

    // Allow only http/https links (or also allow relative "/")
    if (s.startsWith("/") && !s.startsWith("//")) return s;
    if (/^https?:\/\/[^\s]+$/i.test(s)) return s;

    return null;
  };

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
      const safeHref = this.sanitizeHref(this.state.firstRunHref);

      return (
        <div>Measurement status: {this.state.failedreason} {safeHref ? <a href={safeHref}>{safeHref}</a> : <span>(invalid link)</span>}</div>
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
          Something interrupted the request.
          <br />
          <Button variant="secondary" onClick={() => this.props.navigate?.("/runmeasurement")}>
            Go back
          </Button>
        </div>
      );
    }
  }
}

function GetResultsWrapper(props) {
  // get route params from React Router v6
  const { urlparam } = useParams();
  const navigate = useNavigate();

  // emulate the old `match` object React Router v5 used to inject
  const match = {
    params: {
      urlparam,
    },
  };

  return <GetResults {...props} match={match} navigate={navigate} />;
}

export default GetResultsWrapper;
