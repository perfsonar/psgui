import React, { Component, Fragment} from "react";
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import { Button } from 'react-bootstrap';
import { valNumBetweenError } from '../includes/common.js';

class Latency extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showAdvanced: false,
    };

    this.handleAdvancedClick = this.handleAdvancedClick.bind(this);
  }

  handleAdvancedClick(event) {
    this.setState({showAdvanced: !this.state.showAdvanced});
  }

  componentDidMount() {
    this.props.handleformdatachange('latency-output-raw', true);
  }

  componentWillUnmount() {
    this.props.handleformdatachange('latency-output-raw', null);
  }

  render() {
    return (
      <Fragment>
        <div className="row">
          <Button
              onClick={this.handleAdvancedClick}
              variant="outline-primary"
              size="sm">
            Advanced parameters
          </Button>
        </div>
          { this.state.showAdvanced ? <LatencyAdvanced
            addformerror = { this.props.addformerror }
            removeformerror = { this.props.removeformerror }
            handleformdatachange = { this.props.handleformdatachange }
          /> : null }
      </Fragment>
    );
  }
}

class LatencyAdvanced extends Component {

  constructor(props) {
    super(props);

    this.state = {
      valuePC: TestDefaultValues.defaultparams.latency.packet_count,
      valuePI: TestDefaultValues.defaultparams.latency.packet_interval,
      valuePT: TestDefaultValues.defaultparams.latency.packet_timeout,
      valuePP: TestDefaultValues.defaultparams.latency.packet_padding,
      PCError: false,
      PIError: false,
      PTError: false,
      PPError: false
    };

    this.handlePCChange = this.handlePCChange.bind(this);
    this.handlePIChange = this.handlePIChange.bind(this);
    this.handlePTChange = this.handlePTChange.bind(this);
    this.handlePPChange = this.handlePPChange.bind(this);
  }

  handlePCChange = async event => {
    const {name, value} = event.target;
    await this.setState({valuePC: value});
    this.validatePC();
    this.props.handleformdatachange(name, value);
  }

  handlePIChange = async event => {
    const {name, value} = event.target;
    await this.setState({valuePI: value});
    this.validatePI();
    this.props.handleformdatachange(name, value);
  }

  handlePTChange = async event => {
    const {name, value} = event.target;
    await this.setState({valuePT: value});
    this.validatePT();
    this.props.handleformdatachange(name, value);
  }

  handlePPChange = async event => {
    const {name, value} = event.target;
    await this.setState({ valuePP: value });
    this.validatePP();
    this.props.handleformdatachange(name, value);
  };

  validatePC = () => {
    const { valuePC } = this.state;
    if (valNumBetweenError(valuePC, TestDefaultValues.defaultparams.latency.packet_count_min, TestDefaultValues.defaultparams.latency.packet_count_max)) {
      this.setState({
        PCError: true
      }, () => {
        this.props.addformerror('latency-packet-count')
      });
    }
    else {
      this.setState({
        PCError: false
      }, () => {
        this.props.removeformerror('latency-packet-count')
      });
    }
  }

  validatePI = () => {
    const { valuePI } = this.state;
    if (valNumBetweenError(valuePI, TestDefaultValues.defaultparams.latency.packet_interval_min, TestDefaultValues.defaultparams.latency.packet_interval_max)) {
      this.setState({
        PIError: true
      }, () => {
        this.props.addformerror('latency-packet-interval')
      });
    }
    else {
      this.setState({
        PIError: false
      }, () => {
        this.props.removeformerror('latency-packet-interval')
      });
    }
  }

  validatePT = () => {
    const { valuePT } = this.state;
    if (valNumBetweenError(valuePT, TestDefaultValues.defaultparams.latency.packet_timeout_min, TestDefaultValues.defaultparams.latency.packet_timeout_max)) {
      this.setState({
        PTError: true
      }, () => {
        this.props.addformerror('latency-packet-timeout')
      });
    }
    else {
      this.setState({
        PTError: false
      }, () => {
        this.props.removeformerror('latency-packet-timeout')
      });
    }
  }

  validatePP = () => {
    const { valuePP } = this.state;
    if (valNumBetweenError(valuePP, TestDefaultValues.defaultparams.latency.packet_padding_min, TestDefaultValues.defaultparams.latency.packet_padding_max)) {
      this.setState({
        PPError: true
      }, () => {
        this.props.addformerror('latency-packet-padding')
      });
    }
    else {
      this.setState({
        PPError: false
      }, () => {
        this.props.removeformerror('latency-packet-padding');
      });
    }
  }

  componentDidMount() {
    this.props.handleformdatachange('latency-packet-count', this.state.valuePC);
    this.props.handleformdatachange('latency-packet-interval', this.state.valuePI);
    this.props.handleformdatachange('latency-packet-timeout', this.state.valuePT);
    this.props.handleformdatachange('latency-packet-padding', this.state.valuePP);
  }

  componentWillUnmount() {
    this.props.removeformerror('latency-packet-count');
    this.props.removeformerror('latency-packet-interval');
    this.props.removeformerror('latency-packet-timeout');
    this.props.removeformerror('latency-packet-padding');
    this.props.handleformdatachange('latency-packet-count', null);
    this.props.handleformdatachange('latency-packet-interval', null);
    this.props.handleformdatachange('latency-packet-timeout', null);
    this.props.handleformdatachange('latency-packet-padding', null);
  }

  render() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-6">
            <label>
              Packet Count:
              <input type="text"
                name={"latency-packet-count"}
                className={`${this.state.PCError ? 'errorborder' : ''}`}
                value={this.state.valuePC}
                onChange={this.handlePCChange} />
              <span className="description">The number of packets to send ({TestDefaultValues.defaultparams.latency.packet_count_min} - {TestDefaultValues.defaultparams.latency.packet_count_max})</span>
            </label>
          </div>
          <div className="col-md-6">
            <label>
              Packet Interval:
              <input type="text"
                name={"latency-packet-interval"}
                className={`${this.state.PIError ? 'errorborder' : ''}`}
                value={this.state.valuePI}
                onChange={this.handlePIChange} />
              <span className="description">The number of seconds to delay between sending packets ({TestDefaultValues.defaultparams.latency.packet_interval_min} - {TestDefaultValues.defaultparams.latency.packet_interval_max})</span>
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label>
              Packet Timeout:
              <input type="text"
                name={"latency-packet-timeout"}
                className={`${this.state.PTError ? 'errorborder' : ''}`}
                value={this.state.valuePT}
                onChange={this.handlePTChange} />
              <span className="description">The number of seconds to wait before declaring a packet lost ({TestDefaultValues.defaultparams.latency.packet_timeout_min} - {TestDefaultValues.defaultparams.latency.packet_timeout_max})</span>
            </label>
          </div>
          <div className="col-md-6">
            <label>
              Packet Padding:
              <input type="text"
                name={"latency-packet-padding"}
                className={`${this.state.PPError ? 'errorborder' : ''}`}
                value={this.state.valuePP}
                onChange={this.handlePPChange}
              />
              <span className="description">The size of padding to add to the packet in bytes ({TestDefaultValues.defaultparams.latency.packet_padding_min} - {TestDefaultValues.defaultparams.latency.packet_padding_max})</span>
            </label>
          </div>
        </div>
      </Fragment>
    );
  }

}

export default Latency;
