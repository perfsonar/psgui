import React, { Component } from "react";
import '../App.css';
import Select from 'react-select';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import Latency from '../containers/Latency';
import Throughput from '../containers/Throughput';
import Rtt from '../containers/Rtt';
import Trace from '../containers/Trace';
import {RadioGroup, Radio} from 'react-radio-group'

class TestParams extends Component {

  constructor(props) {
    super(props);

    let search = window.location.search;
    let params = new URLSearchParams(search);
    let test = params.get('test');

    this.state = {
      //~ testoptions: this.props.options,
      testoptions: this.props.defoptions,
      testOption: this.props.options.filter(option => option.value === test)[0],
      ipVersion: TestDefaultValues.defaultparams.general.default_ipversion
    };

    this.handleTestChange = this.handleTestChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.options !== prevProps.options) {
      this.setState({
        testoptions: this.props.defoptions.filter(f => this.props.options.includes(f.value)),
      });
    }
    if (this.props.options.length > 0) {
      this.props.removeformerror('tests-declared')
    }
    else {
      this.props.addformerror('tests-declared')
    }
  }

  componentDidMount() {

    if(!this.state.testOption || this.state.testOption==='') {
      this.setState({
        testOption: this.props.options.filter(option => option.value === TestDefaultValues.defaultparams.general.default_test)[0]
      });
      this.props.handleformdatachange('select-test', TestDefaultValues.defaultparams.general.default_test);
    }
    else {
      this.props.handleformdatachange('select-test', this.state.testOption.value);
    }
  }

  handleTestChange = async testOption => {
    await this.setState({
      testOption
    });
    this.props.handleformdatachange('select-test', testOption.value);
  };

  handleIPVersionChange = async value => {
    await this.setState({
      ipVersion: value
    });
    this.props.handleformdatachange('select-ipversion', value);
  };

  renderSelectedTest(param) {
    if (typeof param !== 'undefined') {
      switch(param.value) {
        case null:
        case 'throughput':
          return <Throughput
            addformerror = { this.props.addformerror }
            removeformerror = { this.props.removeformerror }
            handleformdatachange = { this.props.handleformdatachange }
          />;
        case 'latency':
          return <Latency
            addformerror = { this.props.addformerror }
            removeformerror = { this.props.removeformerror }
            handleformdatachange = { this.props.handleformdatachange }
          />;
        case 'rtt':
          return <Rtt
            addformerror = { this.props.addformerror }
            removeformerror = { this.props.removeformerror }
            handleformdatachange = { this.props.handleformdatachange }
          />;
        case 'trace':
          return <Trace
            addformerror = { this.props.addformerror }
            removeformerror = { this.props.removeformerror }
            handleformdatachange = { this.props.handleformdatachange }
          />;
        default:
          return '';
      }
    }
  }

  render() {
      return (
        <fieldset>
          <legend>Test parameters</legend>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  Test:
                  <Select
                    placeholder="Select test"
                    name={"select-test"}
                    options= {  this.state.testoptions }
                    onChange={this.handleTestChange}
                    value={  this.state.testOption } />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <RadioGroup name="ipversion" selectedValue={this.state.ipVersion} onChange={this.handleIPVersionChange}>
                      <Radio value="4" className="inlinerow" /> IPv4
                      <Radio value="6" className="inlinerow" /> IPv6
                  </RadioGroup>
                </div>
              </div>
              {this.renderSelectedTest(this.state.testOption)}
            </div>
        </fieldset>
      );
  }
}

export default TestParams;
