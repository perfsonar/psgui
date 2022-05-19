import React, { Component } from 'react';
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import TestParams from '../containers/TestParams';
import Selects from '../containers/Selects';
import { Button } from 'react-bootstrap';
import LoadingOverlay from 'react-loading-overlay';
import { Redirect } from 'react-router'

let abortController;
export { abortController };

const ResultDiv = (props) => {
  return (
    <div className='result'>
      {props.item}
    </div>
  );
}

class LoaderText extends Component {
  render() {
    return (
      <div>
        {this.props.loadertext}
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

let defoptions = TestDefaultValues.tests.map(item => ({ label: item,  value: item}));

class RunMeasurement extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      formData: {},
      formError: null,
      formErr: [],
      firstRunHref: '',
      options: defoptions,
      loadertext: '',
      fetchLoading: false,
      fetchTests: false,
      resultFetched: false
    };

    this.handleFormDataChange = this.handleFormDataChange.bind(this);
    this.addFormError = this.addFormError.bind(this);
    this.removeFormError = this.removeFormError.bind(this);
    this.validateFormError = this.validateFormError.bind(this);
    this.formValidate = this.formValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.doFetchAvailableTests = this.doFetchAvailableTests.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleFormDataChange = async (name, value) => {
    var newFormData = this.state.formData;
    Object.assign(newFormData, {[name]: value});
    Object.keys(newFormData).forEach(key => ( newFormData[key] === undefined || newFormData[key] === null) && delete newFormData[key])
    await this.setState({ formData : newFormData });
    //after both source and dest are chosen filter default options and choose right tests to populate select test field
    if(this.state.formData['select-source'] && this.state.formData['select-dest']) {
      //~ console.log(this.state.formData)
      let apiurl = TestDefaultValues.apiurl_testshref;
      if (process.env.NODE_ENV !== 'production') {
        apiurl = TestDefaultValues.devapiurl_testshref;
      }
      const tests = await this.doFetchAvailableTests(apiurl);
      const filteredArray = this.state.options.filter(value => this.state.options.includes(value));
    }
  }

  addFormError = (field) => {
    const index = this.state.formErr.indexOf(field);
    if (index === -1) {
      this.setState({ formErr : this.state.formErr.concat(field) }, () => {
        this.validateFormError();
      });
    }
  }

  removeFormError = (field) => {
    const index = this.state.formErr.indexOf(field);
    if (index > -1) {
      const newFormErr = this.state.formErr.filter((item, j) => index !== j);
      this.setState({ formErr : newFormErr }, () => {
        this.validateFormError()
      });
    }
  }

  validateFormError = () => {
    if(this.state.formErr.length) {
      this.setState({ formError : true })
    }
    else {
      this.setState({ formError : false })
    }
  }

  formValidate(e) {
    let sourceval = document.forms["runmeasurement"]["select-source"].value;
    let destval = document.forms["runmeasurement"]["select-dest"].value;
    if(!sourceval) {
      let ss = document.getElementsByClassName('select-source-container');
      e.preventDefault();
      ss[0].style.boxShadow = "3px 3px 2px red";
    }
    if(!destval) {
      let sd = document.getElementsByClassName('select-dest-container');
      e.preventDefault();
      sd[0].style.boxShadow = "3px 3px 2px red";
    }
  }

  abortFetching = async () => {
    console.log('Aborting...');
    abortController.abort();
    await this.setState({
      fetchLoading: false,
    });
  }

  doSetStateOptions = async (r) => {
    await this.setState({
      options: r,
    });
//~ console.log(defoptions);
//~ console.log(this.state.options);

  }

  doFetchAvailableTests = async (url) => {
    abortController = new AbortController();
    await this.setState({
      fetchTests: true,
      loadertext: 'Wait ...'
    });
    this.setState({fetchTests: true});
    const res = await fetch(
      url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.formData)
      }
    );

    if (res.status === 400) {
      await this.setState({
        fetchTests: false,
        loadertext: ''
      });
    }
    else {
      const r = await res.json();
      await this.doSetStateOptions(r);
      await this.setState({
        fetchTests: false,
        loadertext: ''
      });
    }
  }

  handleSubmit = event => {
    this.setState({
      fetchLoading: true,
      loadertext: 'Starting measurement ...'
    });
    abortController = new AbortController();
    let apiurl = TestDefaultValues.apiurl_run;
    if (process.env.NODE_ENV !== 'production') {
      apiurl = TestDefaultValues.devapiurl_run;
    }
    fetch(apiurl, {
        method: 'POST',
        signal: abortController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.formData)
      })
      .then(res => {
          if (res.status === 400) {
            res.json().then(async responseJson => {
              if (responseJson.status === 400) {
                await this.setState({
                  fetchLoading: false,
                  loadertext: '',
                  firstRunHref: responseJson.message
                });
              } else if (responseJson.status === 40001) {
                await this.setState({
                  fetchLoading: false,
                  loadertext: '',
                  firstRunHref: responseJson.message
                });
              }
            })
          }
          else {
            res.json().then(
              async item => {
              await this.setState({
                fetchLoading: false,
                loadertext: '',
                firstRunHref: item,
                resultFetched: true
              });
            })
          }
        }
      )
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        }
        else {
          console.log(error);
        }
    });

    event.preventDefault();
  }

  render() {
    if (this.state.resultFetched) {
        //~ state: {state: this.state},
      return <Redirect push to={{
        pathname:'/GetResults/' + encodeURIComponent(this.state.firstRunHref)
      }}
      />
    }
    else {
      return (
      <LoadingOverlay
        active={this.state.fetchLoading || this.state.fetchTests}
        spinner
        text = <LoaderText loadertext={this.state.loadertext} abfetch={this.abortFetching} />
      >
          <div className="result">
            { this.state.fetchLoading ? null : <ResultDiv item={this.state.firstRunHref} /> }
          </div>
          <div className="RunMeasurement">
            <form id="runmeasurement" onSubmit={this.handleSubmit}>
            <div className="Selects">
              <Selects
                addformerror = { this.addFormError }
                removeformerror = { this.removeFormError }
                handleformdatachange = { this.handleFormDataChange }
              />
            </div>
            <div className="TestParams">
              <TestParams
                defoptions = { defoptions }
                options = { this.state.options }
                addformerror = { this.addFormError }
                removeformerror = { this.removeFormError }
                handleformdatachange = { this.handleFormDataChange }
              />
            </div>
            <div className="sb">
              <Button
                type="submit"
                disabled={this.state.formError}
                variant="primary">
                Submit
              </Button>
            </div>
            </form>
          </div>
        </LoadingOverlay>
      );
    }
  }
}
export default RunMeasurement;
