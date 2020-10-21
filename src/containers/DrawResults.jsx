import React, { Component } from 'react';
import '../App.css';
import ReLineChart from '../containers/ReLineChart';
import ReHistogram from '../containers/ReHistogram';

class DrawResults extends Component {

  constructor(props) {
    super(props);
    this.histdata = Object.entries(this.props.results["histogram-latency"]).map(([key, value], i) => ({index:i, latency:key, value:value})).sort((a, b) => a.latency - b.latency)
    this.rawdata = Object.entries(this.props.results["raw-packets"]).map(([key, value], i) => ({x:key, y:value.calclatency}))
  }

  render() {
    if (this.props.results.testtype === 'latency') {
      return (
        <div>
          <h3>{this.props.results.tr.test.type}: {this.props.results.tr.test.spec.source} -> {this.props.results.tr.test.spec.dest} ({this.props.results.tr.test.spec["packet-count"]} packets)</h3>
          <div>Average latency: {this.props.results.avglatency} ms</div>
          <div>Delay variation: {this.props.results.jitter} ms</div>
          <div><a href={this.props.results.tr.href + '/runs/first'}>{this.props.results.tr.href}/runs/first</a></div>
          <ReLineChart
            data={this.rawdata}
            avglatency = {this.props.results.avglatency}
            jitter = {this.props.results.jitter}
          />
          <ReHistogram
            data={this.histdata}
          />
        </div>
      );
    }
  }
}
export default DrawResults;
