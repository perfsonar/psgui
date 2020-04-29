import React, { Component, Fragment} from "react";
import '../App.css';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import { valNumBetweenError } from '../includes/common.js';


class Trace extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showAdvanced: false,
    };

    this.handleAdvancedClick = this.handleAdvancedClick.bind(this);
  }

  handleAdvancedClick = event => {
    this.setState({showAdvanced: !this.state.showAdvanced});
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
        { this.state.showAdvanced ? <TraceAdvanced
          addformerror = { this.props.addformerror }
          removeformerror = { this.props.removeformerror }
          handleformdatachange = { this.props.handleformdatachange }
        /> : null }
      </Fragment>
    );
  }
}

const traceTools = [
  { value: 'traceroute', label: 'traceroute' },
  { value: 'tracepath', label: 'tracepath' },
  { value: 'paris-traceroute', label: 'paris-traceroute' }
];

class TraceAdvanced extends Component {

  constructor(props) {
    super(props);

    let toolarray = TestDefaultValues.defaultparams.trace.tool.split(',');

    this.state = {
      valueFirstTTL: TestDefaultValues.defaultparams.trace.first_ttl,
      valueFirstTTLmax: TestDefaultValues.defaultparams.trace.max_ttl,
      valueMaxTTL: TestDefaultValues.defaultparams.trace.max_ttl,
      valueTraceTool: traceTools.filter(option => toolarray.includes(option.value)),
      FTTLError: false,
      MTTLError: false
    };

    this.handleTraceToolsChange = this.handleTraceToolsChange.bind(this);
    this.handleTraceFirstTTLChange = this.handleTraceFirstTTLChange.bind(this);
    this.handleTraceMaxTTLChange = this.handleTraceMaxTTLChange.bind(this);
  }

  handleTraceToolsChange = async valueTraceTool => {
    await this.setState({
      valueTraceTool
    });
    if(valueTraceTool != null) {
      let vtopts = this.state.valueTraceTool.map(val => val.value);
      this.props.handleformdatachange('trace-select-tools', vtopts);
    }
  };

  handleTraceFirstTTLChange = async event => {
    const {name, value} = event.target;
    await this.setState({valueFirstTTL: value});
    this.validateFTTL();
    this.props.handleformdatachange(name, value);
  }

  validateFTTL = () => {
    const { valueFirstTTL , valueMaxTTL } = this.state;
    //valueFirstTTL between max_ttl_min and valueMaxTTL
    if (valNumBetweenError(valueFirstTTL, TestDefaultValues.defaultparams.trace.max_ttl_min, valueMaxTTL)) {
      this.setState({
        FTTLError: true
      }, () => {
        this.props.addformerror('trace-first-ttl')
      });
    }
    else {
      this.setState({
        FTTLError: false
      }, () => {
        this.props.removeformerror('trace-first-ttl')
      });
    }
  }

  handleTraceMaxTTLChange = async event => {
    const {name, value} = event.target;
    let ftm = Math.max(TestDefaultValues.defaultparams.trace.max_ttl_min, Math.min(value, TestDefaultValues.defaultparams.trace.max_ttl_max));
    if(isNaN(ftm)) {
      ftm = TestDefaultValues.defaultparams.trace.max_ttl_min;
    }
    await this.setState({
      valueMaxTTL: value,
      valueFirstTTLmax: ftm
    });
    this.validateMTTL();
    this.props.handleformdatachange(name, value);
  }


  validateMTTL = () => {
    const { valueMaxTTL } = this.state;
    if (valNumBetweenError(valueMaxTTL, TestDefaultValues.defaultparams.trace.max_ttl_min, TestDefaultValues.defaultparams.trace.max_ttl_max)) {
      this.setState({
        MTTLError: true
      }, () => {
        this.props.addformerror('trace-max-ttl')
      });
    }
    else {
      this.setState({
        MTTLError: false
      }, () => {
        this.props.removeformerror('trace-max-ttl')
      });
    }
  }

  componentDidMount() {
    this.props.handleformdatachange('trace-first-ttl', this.state.valueFirstTTL);
    this.props.handleformdatachange('trace-max-ttl', this.state.valueMaxTTL);
    this.props.handleformdatachange('trace-select-tools', this.state.valueTraceTool.map(val => val.value));
  }

  componentWillUnmount() {
    this.props.removeformerror('trace-first-ttl');
    this.props.removeformerror('trace-max-ttl');
    this.props.handleformdatachange('trace-first-ttl', null);
    this.props.handleformdatachange('trace-max-ttl', null);
    this.props.handleformdatachange('trace-select-tools', null);
  }

  render() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-6">
            <label>
              First hop to report:
              <input type="text"
                name={"trace-first-ttl"}
                className={`${this.state.FTTLError ? 'errorborder' : ''}`}
                value={this.state.valueFirstTTL}
                onChange={this.handleTraceFirstTTLChange} />
              <span className="description">First TTL value ( {TestDefaultValues.defaultparams.trace.max_ttl_min} - {this.state.valueFirstTTLmax} )</span>
            </label>
          </div>
          <div className="col-md-6">
            <label>
              Maximum number of hops:
              <input type="text"
                className={`${this.state.MTTLError ? 'errorborder' : ''}`}
                name={"trace-max-ttl"}
                value={this.state.valueMaxTTL}
                onChange={this.handleTraceMaxTTLChange} />
              <span className="description">Maximum number of hops ( {TestDefaultValues.defaultparams.trace.max_ttl_min} - {TestDefaultValues.defaultparams.trace.max_ttl_max} )</span>
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            Tool(s), in order of preference:
            <Select
              placeholder="Tool(s), in order of preference"
              name={"trace-select-tools"}
              options= { traceTools }
              isMulti
              onChange={this.handleTraceToolsChange}
              value={this.state.valueTraceTool } />
          </div>
        </div>

      </Fragment>
    );
  }

}

export default Trace;
