import React, { Component } from 'react';
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import TestParams from '../containers/TestParams';
import Selects from '../containers/Selects';
import { Button } from 'react-bootstrap';
import LoadingOverlay from 'react-loading-overlay';

let abortController;
export { abortController };

const ResultDiv = (props) => {
  return (
    <div className='result'>
      <a href={props.item}>{props.item}</a>
    </div>
  );
}

class LoaderText extends Component {
  render() {
    return (
      <Button
        type="button"
        onClick={this.props.abfetch}
        variant="secondary">
        Cancel
      </Button>
    );
  }
}

class RunMeasurement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      formError: null,
      formErr: [],
      firstRunHref: '',
      fetchLoading: false
    };

    this.handleFormDataChange = this.handleFormDataChange.bind(this);
    this.addFormError = this.addFormError.bind(this);
    this.removeFormError = this.removeFormError.bind(this);
    this.validateFormError = this.validateFormError.bind(this);
    this.formValidate = this.formValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFormDataChange = (name, value) => {
    var newFormData = this.state.formData;
    Object.assign(newFormData, {[name]: value});
    Object.keys(newFormData).forEach(key => ( newFormData[key] === undefined || newFormData[key] === null) && delete newFormData[key])
    this.setState({ formData : newFormData });
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

  handleSubmit = event => {
    this.setState({fetchLoading: true});
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
              console.log(responseJson);
              if (responseJson.status === 400) {
                await this.setState({
                  fetchLoading: false,
                  firstRunHref: responseJson.message
                });
              } else if (responseJson.status === 40001) {
                await this.setState({
                  fetchLoading: false,
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
                firstRunHref: item
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
    return (
    <LoadingOverlay
      active={this.state.fetchLoading}
      spinner
      text = <LoaderText abfetch={this.abortFetching} />
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
export default RunMeasurement;
