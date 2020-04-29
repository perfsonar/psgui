import React, { Component } from "react";
import '../App.css';
import Select from 'react-select';
import TestDefaultValues from '../includes/TestDefaultValues.js';
import Latency from '../containers/Latency';
import Throughput from '../containers/Throughput';
import Rtt from '../containers/Rtt';
import Trace from '../containers/Trace';

const options = TestDefaultValues.tests.map(item => ({ label: item,  value: item}));

class TestParams extends Component {

  constructor(props) {
    super(props);

    let search = window.location.search;
    let params = new URLSearchParams(search);
    let test = params.get('test');

    this.state = {
      testoptions: options,
      testOption: options.filter(option => option.value === test)[0]
    };

    this.handleTestChange = this.handleTestChange.bind(this);
  }

  componentDidMount() {
    if(!this.state.testOption || this.state.testOption==='') {
      this.setState({
        testOption: options.filter(option => option.value === TestDefaultValues.defaultparams.general.default_test)[0]
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

  renderSelectedTest(param) {
    switch(param.value) {
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

  render() {
    const { testoptions, testOption } = this.state;
    if(!this.state.testOption || this.state.testOption==='') {
      return <div>Error - wrong URL param test</div>;
    }
    else {
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
                    options= { testoptions }
                    onChange={this.handleTestChange}
                    value={ testOption } />
                </div>
              </div>
              {this.renderSelectedTest(testOption)}
            </div>
        </fieldset>
      );
    }
  }
}

export default TestParams;
