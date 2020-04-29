import React, { Component, Fragment} from "react";
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import Switch from "react-switch";
import { valNumBetweenError } from '../includes/common.js';

const protocolOptions = [
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' }
];

class Throughput extends Component {

  constructor(props) {
    super(props);

    let tds = 'PT' + TestDefaultValues.defaultparams.throughput.test_duration + 'S';

    this.state = {
      valueProtocol: protocolOptions.filter(option => option.value === TestDefaultValues.defaultparams.throughput.protocol),
      valueTestDuration: TestDefaultValues.defaultparams.throughput.test_duration,
      valueTestDurationSubmit: tds,
      showAdvanced: false,
      TDuError: false,
    };

    this.handleProtocolChange = this.handleProtocolChange.bind(this);
    this.handleTestDurationChange = this.handleTestDurationChange.bind(this);
    this.handleAdvancedClick = this.handleAdvancedClick.bind(this);
  }

  handleProtocolChange = async valueProtocol => {
    await this.setState({
      valueProtocol
    });
    this.props.handleformdatachange('select-throughput-protocol', valueProtocol.value);
  };

  handleTestDurationChange = async event => {
    const {name, value} = event.target
    let valuesubmit = 'PT' + parseInt(value) + 'S'
    await this.setState({
      valueTestDuration: value,
      valueTestDurationSubmit: valuesubmit
    });
    this.validateTDu();
    this.props.handleformdatachange(name, valuesubmit);
  }

    validateTDu = () => {
    const { valueTestDuration } = this.state;
    if (valNumBetweenError(valueTestDuration, TestDefaultValues.defaultparams.throughput.test_duration_min, TestDefaultValues.defaultparams.throughput.test_duration_max)) {
      this.setState({
        TDuError: true
      }, () => {
        this.props.addformerror('throughput-test-duration')
      });
    }
    else {
      this.setState({
        TDuError: false
      }, () => {
        this.props.removeformerror('throughput-test-duration')
      });
    }
  }

  handleAdvancedClick(event) {
    this.setState({showAdvanced: !this.state.showAdvanced});
  }

  componentDidMount() {
    this.props.handleformdatachange('select-throughput-protocol', this.state.valueProtocol[0].value);
    this.props.handleformdatachange('throughput-test-duration', this.state.valueTestDuration);
  }

  componentWillUnmount() {
    this.props.removeformerror('throughput-test-duration');
    this.props.handleformdatachange('select-throughput-protocol', null);
    this.props.handleformdatachange('throughput-test-duration', null);
  }

  render() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-6">
            <Select
              placeholder="Protocol"
              name={"select-throughput-protocol"}
              options= { protocolOptions }
              onChange={this.handleProtocolChange}
              value={this.state.valueProtocol } />
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <label>
              Test duration:
              <input type="text"
                name={"throughput-test-duration"}
                className={`${this.state.TDuError ? 'errorborder' : ''}`}
                value={this.state.valueTestDuration}
                onChange={this.handleTestDurationChange} />
              <span className="description">Total runtime of test in seconds ({TestDefaultValues.defaultparams.throughput.test_duration_min} - {TestDefaultValues.defaultparams.throughput.test_duration_max})</span>
            </label>
            <input type="hidden"
              name={"throughput-test-duration-submit"}
              value={this.state.valueTestDurationSubmit} />
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
        { this.state.showAdvanced ? <ThroughputAdvanced
          addformerror = { this.props.addformerror }
          removeformerror = { this.props.removeformerror }
          handleformdatachange = { this.props.handleformdatachange }
        /> : null }
      </Fragment>
    );
  }
}

const throughputTools = [
  { value: 'iperf', label: 'iperf' },
  { value: 'iperf3', label: 'iperf3' },
  { value: 'nuttcp', label: 'nuttcp' }
];

class ThroughputAdvanced extends Component {

  constructor(props) {
    super(props);

    let toolarray = TestDefaultValues.defaultparams.throughput.tool.split(',');

    this.state = {
      valueThroughputTool: throughputTools.filter(option => toolarray.includes(option.value)),
      valueThroughputAutotuning: TestDefaultValues.defaultparams.throughput.autotuning,
      valueParallelStreams: TestDefaultValues.defaultparams.throughput.parallelstreams,
      valueOmitInterval: TestDefaultValues.defaultparams.throughput.omitinterval,
      valueOmitIntervalSubmit: 'PT' + TestDefaultValues.defaultparams.throughput.omitinterval + 'S',
      valueThroughputZeroCopy: TestDefaultValues.defaultparams.throughput.zerocopy,
      valueThroughputTosBits: TestDefaultValues.defaultparams.throughput.tos_bits,
      PStError: false,
      OIError: false,
      TBrror: false,
    };

    this.handleThroughputToolsChange = this.handleThroughputToolsChange.bind(this);
    this.handleThroughputAutotuningChange = this.handleThroughputAutotuningChange.bind(this);
    this.handleThroughputParallelStreamsChange = this.handleThroughputParallelStreamsChange.bind(this);
    this.handleThroughputOmitIntervalChange = this.handleThroughputOmitIntervalChange.bind(this);
    this.handleThroughputZeroCopyChange = this.handleThroughputZeroCopyChange.bind(this);
    this.handleThroughputTosBitsChange = this.handleThroughputTosBitsChange.bind(this);
  }

  handleThroughputToolsChange = async valueThroughputTool => {
    await this.setState({
      valueThroughputTool
    });
    if(valueThroughputTool != null) {
      let vtopts = this.state.valueThroughputTool.map(val => val.value);
      this.props.handleformdatachange('throughput-select-tools', vtopts);
    }
  };

  handleThroughputAutotuningChange = () => {
    this.setState({valueThroughputAutotuning: !this.state.valueThroughputAutotuning});
  }

  handleThroughputParallelStreamsChange = async event => {
    const {name, value} = event.target;
    await this.setState({valueParallelStreams: value});
    this.validatePSt();
    this.props.handleformdatachange(name, value);
  }

  validatePSt = () => {
    const { valueParallelStreams } = this.state;
    if (valNumBetweenError(valueParallelStreams, TestDefaultValues.defaultparams.throughput.parallelstreams_min, TestDefaultValues.defaultparams.throughput.parallelstreams_max)) {
      this.setState({
        PStError: true
      }, () => {
        this.props.addformerror('throughput-parallel-streams')
      });
    }
    else {
      this.setState({
        PStError: false
      }, () => {
        this.props.removeformerror('throughput-parallel-streams')
      });
    }
  }

  handleThroughputOmitIntervalChange = async event => {
    const {value} = event.target
    let valuesubmit = 'PT' + parseInt(value) + 'S'

    await this.setState({
      valueOmitInterval: value,
      valueOmitIntervalSubmit: 'PT' + parseInt(value) + 'S'
    });
    this.validateOI();
    this.props.handleformdatachange('throughput-omit-interval-submit', valuesubmit);
  }

  validateOI = () => {
    const { valueOmitInterval } = this.state;
    if (valNumBetweenError(valueOmitInterval, TestDefaultValues.defaultparams.throughput.omitinterval_min, TestDefaultValues.defaultparams.throughput.omitinterval_max)) {
      this.setState({
        OIError: true
      }, () => {
        this.props.addformerror('throughput-omit-interval')
      });
    }
    else {
      this.setState({
        OIError: false
      }, () => {
        this.props.removeformerror('throughput-omit-interval')
      });
    }
  }

  handleThroughputZeroCopyChange = () => {
    this.setState({valueThroughputZeroCopy: !this.state.valueThroughputZeroCopy});
  }

  handleThroughputTosBitsChange = async event => {
    const {name, value} = event.target;
    await this.setState({valueThroughputTosBits: value});
    this.validateTB();
    this.props.handleformdatachange(name, value);
  }

  validateTB = () => {
    const { valueThroughputTosBits } = this.state;

    if (valNumBetweenError(valueThroughputTosBits, TestDefaultValues.defaultparams.throughput.tos_bits_min, TestDefaultValues.defaultparams.throughput.tos_bits_max)) {
      this.setState({
        TBError: true
      }, () => {
        this.props.addformerror('throughput-tos-bits')
      });
    }
    else {
      this.setState({
        TBError: false
      }, () => {
        this.props.removeformerror('throughput-tos-bits')
      });
    }
  }

  componentDidMount() {
    this.props.handleformdatachange('throughput-select-tools', this.state.valueThroughputTool.map(val => val.value));
    this.props.handleformdatachange('throughput-parallel-streams', this.state.valueParallelStreams);
    this.props.handleformdatachange('throughput-omit-interval-submit', this.state.valueOmitIntervalSubmit);
    this.props.handleformdatachange('throughput-tos-bits', this.state.valueThroughputTosBits);
  }

  componentWillUnmount() {
    this.props.removeformerror('throughput-parallel-streams');
    this.props.removeformerror('throughput-omit-interval');
    this.props.removeformerror('throughput-tos-bits');
    this.props.handleformdatachange('throughput-select-tools', null);
    this.props.handleformdatachange('throughput-parallel-streams', null);
    this.props.handleformdatachange('throughput-omit-interval-submit', null);
    this.props.handleformdatachange('throughput-tos-bits', null);
  }

  render() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-4">
            Tool(s), in order of preference:
            <Select
              placeholder="Tool(s), in order of preference"
              name={"throughput-select-tools"}
              options= { throughputTools }
              isMulti
              onChange={this.handleThroughputToolsChange}
              value={this.state.valueThroughputTool } />
          </div>
          <div className="col-md-4">
            <div>Use Autotuning</div>
            <label>
              <Switch
                onChange={this.handleThroughputAutotuningChange}
                checked={this.state.valueThroughputAutotuning}
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <label>
              Number of Parallel Streams:
              <input type="text"
                name={"throughput-parallel-streams"}
                className={`${this.state.PStError ? 'errorborder' : ''}`}
                value={this.state.valueParallelStreams}
                onChange={this.handleThroughputParallelStreamsChange} />
              <span className="description">How many parallel streams to run during the test ({TestDefaultValues.defaultparams.throughput.parallelstreams_min} - {TestDefaultValues.defaultparams.throughput.parallelstreams_max})</span>
            </label>
          </div>
          <div className="col-md-4">
            <label>
              Omit Interval (sec):
              <input type="text"
                name={"throughput-omit-interval"}
                className={`${this.state.OIError ? 'errorborder' : ''}`}
                value={this.state.valueOmitInterval}
                onChange={this.handleThroughputOmitIntervalChange} />
              <span className="description">Number of seconds to omit from the start of the test ({TestDefaultValues.defaultparams.throughput.omitinterval_min} - {TestDefaultValues.defaultparams.throughput.omitinterval_max})</span>
            </label>
            <input type="hidden"
              name={"throughput-omit-interval-submit"}
              value={this.state.valueOmitIntervalSubmit} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <label>
              TOS bits:
              <input type="text"
                name={"throughput-tos-bits"}
                className={`${this.state.TBError ? 'errorborder' : ''}`}
                value={this.state.valueThroughputTosBits}
                onChange={this.handleThroughputTosBitsChange} />
              <span className="description">IP type-of-service octet (decimal integer) ({TestDefaultValues.defaultparams.throughput.tos_bits_min} - {TestDefaultValues.defaultparams.throughput.tos_bits_max})</span>
            </label>
          </div>
          <div className="col-md-4">
            <div>Use Zero Copy</div>
            <label>
              <Switch
                name={"throughput-zero-copy"}
                onChange={this.handleThroughputZeroCopyChange}
                checked={this.state.valueThroughputZeroCopy}
              />
            </label>
          </div>
        </div>
      </Fragment>
    );
  }

}

export default Throughput;
