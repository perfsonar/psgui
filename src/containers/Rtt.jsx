import React, { Component, Fragment} from "react";
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import { Button } from 'react-bootstrap';
import { valNumBetweenError } from '../includes/common.js';

class Rtt extends Component {

  constructor(props) {
    super(props);

    let tbt = 'PT' + TestDefaultValues.defaultparams.rtt.time_between_tests + TestDefaultValues.defaultparams.rtt.time_between_tests_units;

    this.state = {
      valueRttPacketsPerTest: TestDefaultValues.defaultparams.rtt.packets_per_test,
      valueRttTBTSubmit: tbt,
      showAdvanced: false,
      PPTError: false,
    };

    this.handleAdvancedClick = this.handleAdvancedClick.bind(this);
    this.handleRttPacketsPerTestChange = this.handleRttPacketsPerTestChange.bind(this);
  }

  handleRttPacketsPerTestChange = async event => {
    const {name, value} = event.target
    await this.setState({valueRttPacketsPerTest: value});
    this.validatePPT();
    this.props.handleformdatachange(name, value);
  }

  validatePPT = () => {
    const { valueRttPacketsPerTest } = this.state;
    if (valNumBetweenError(valueRttPacketsPerTest, TestDefaultValues.defaultparams.rtt.packets_per_test_min, TestDefaultValues.defaultparams.rtt.packets_per_test_max)) {
      this.setState({
        PPTError: true
      }, () => {
        this.props.addformerror('rtt-packets-per-test')
      });
    }
    else {
      this.setState({
        PPTError: false
      }, () => {
        this.props.removeformerror('rtt-packets-per-test')
      });
    }
  }

  handleAdvancedClick(event) {
    this.setState({showAdvanced: !this.state.showAdvanced});
  }

  componentDidMount() {
    this.props.handleformdatachange('rtt-packets-per-test', this.state.valueRttPacketsPerTest);
  }

  componentWillUnmount() {
    this.props.removeformerror('rtt-packets-per-test');
    this.props.handleformdatachange('rtt-packets-per-test', null);
  }

  render() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-3">
            <label>
              Packets per test:
              <input type="text"
                name={"rtt-packets-per-test"}
                className={`${this.state.PPTError ? 'errorborder' : ''}`}
                value={this.state.valueRttPacketsPerTest}
                onChange={this.handleRttPacketsPerTestChange} />
              <span className="description">Test count ({TestDefaultValues.defaultparams.rtt.packets_per_test_min} - {TestDefaultValues.defaultparams.rtt.packets_per_test_max})</span>
            </label>
          </div>
        </div>
        <div className="row">
          <Button
              onClick={this.handleAdvancedClick}
              variant="outline-primary"
              size="sm">
            Advanced parameters
          </Button>
        </div>
        <div className="row">
          { this.state.showAdvanced ? <RttAdvanced
            addformerror = { this.props.addformerror }
            removeformerror = { this.props.removeformerror }
            handleformdatachange = { this.props.handleformdatachange }
          /> : null }
        </div>
      </Fragment>
    );
  }
}

class RttAdvanced extends Component {

  constructor(props) {
    super(props);

    let tbp = 'PT' + TestDefaultValues.defaultparams.rtt.time_between_packets + 'S';

    this.state = {
      valueTBP: TestDefaultValues.defaultparams.rtt.time_between_packets,
      valueTBPSubmit: tbp,
      valuePS: TestDefaultValues.defaultparams.rtt.packet_size,
      TBPError: false,
      PSError: false,
    };

    this.handleTBPChange = this.handleTBPChange.bind(this);
    this.handlePSChange = this.handlePSChange.bind(this);
  }

  handleTBPChange = async event => {
    const {value} = event.target
    let valuesubmit = 'PT' + parseInt(value) + 'S'

    await this.setState({
      valueTBP: value,
      valueTBPSubmit: valuesubmit
    });

    this.validateTBP();
    this.props.handleformdatachange('rtt-time-between-packets-submit', valuesubmit);
  }

  validateTBP = () => {
    const { valueTBP } = this.state;
    if (valNumBetweenError(valueTBP, TestDefaultValues.defaultparams.rtt.time_between_packets_min, TestDefaultValues.defaultparams.rtt.time_between_packets_max)) {
      this.setState({
        TBPError: true
      }, () => {
        this.props.addformerror('rtt-time-between-packets')
      });
    }
    else {
      this.setState({
        TBPError: false
      }, () => {
        this.props.removeformerror('rtt-time-between-packets')
      });
    }
  }

  handlePSChange = async event => {
    const {name, value} = event.target

    await this.setState({valuePS: value});
    this.validatePS();
    this.props.handleformdatachange(name, value);
  }

  validatePS = () => {
    const { valuePS } = this.state;
    if (valNumBetweenError(valuePS, TestDefaultValues.defaultparams.rtt.packet_size_min, TestDefaultValues.defaultparams.rtt.packet_size_max)) {
      this.setState({
        PSError: true
      }, () => {
        this.props.addformerror('rtt-packet-size')
      });
    }
    else {
      this.setState({
        PSError: false
      }, () => {
        this.props.removeformerror('rtt-packet-size')
      });
    }
  }

  componentDidMount() {
    this.props.handleformdatachange('rtt-time-between-packets-submit', this.state.valueTBPSubmit);
    this.props.handleformdatachange('rtt-packet-size', this.state.valuePS);
  }

  componentWillUnmount() {
    this.props.removeformerror('rtt-time-between-packets');
    this.props.removeformerror('rtt-packet-size');
    this.props.handleformdatachange('rtt-time-between-packets-submit', null);
    this.props.handleformdatachange('rtt-packet-size', null);
  }

  render() {
    return (
      <Fragment>
          <div className="col-md-6">
            <label>
              Time between packets (seconds):
              <input type="text"
                name={"rtt-time-between-packets"}
                className={`${this.state.TBPError ? 'errorborder' : ''}`}
                value={this.state.valueTBP}
                onChange={this.handleTBPChange} />
              <span className="description">Time between packets ({TestDefaultValues.defaultparams.rtt.time_between_packets_min} - {TestDefaultValues.defaultparams.rtt.time_between_packets_max})</span>
            </label>
            <input type="hidden"
                name={"rtt-time-between-packets-submit"}
              value={this.state.valueTBPSubmit} />
          </div>
          <div className="col-md-6">
            <label>
              Packet Size (bytes):
              <input type="text"
                name={"rtt-packet-size"}
                className={`${this.state.PSError ? 'errorborder' : ''}`}
                value={this.state.valuePS}
                onChange={this.handlePSChange} />
              <span className="description">Packet length ({TestDefaultValues.defaultparams.rtt.packet_size_min} - {TestDefaultValues.defaultparams.rtt.packet_size_max})</span>
            </label>
          </div>
      </Fragment>
    );
  }

}

export default Rtt;
