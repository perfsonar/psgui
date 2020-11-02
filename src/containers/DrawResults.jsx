import React, { Component } from 'react';
import '../App.css';
import ReLineChart from '../containers/ReLineChart';
import ReHistogram from '../containers/ReHistogram';
import ReTable from '../containers/ReTable';

const AVGcolumns = [
  {
    Header: "Measurement",
    accessor: "x",
  },
  {
    Header: "Value",
    accessor: "y",
  },
];

const PTcolumns = [
  {
    Header: "Packet No.",
    accessor: "x",
  },
  {
    Header: "Latency",
    accessor: "y",
  },
];

class DrawResults extends Component {

  constructor(props) {
    super(props);
    if (this.props.results.testtype === 'latency') {
      this.histdata = Object.entries(this.props.results["histogram-latency"]).map(([key, value], i) => ({index:i, latency:key, value:value})).sort((a, b) => a.latency - b.latency)
      this.rawdata = Object.entries(this.props.results["raw-packets"]).map(([key, value], i) => ({x:key, y:value.calclatency}))
    }

    if (this.props.results.testtype === 'latency') {
      this.avg = [
          { x : 'Average latency', y :  this.props.results.stats.avglatency + ' ms' },
          { x : 'Delay variation', y :  this.props.results.stats.rfcjitter + ' ms'},
          { x : 'Delay Median', y :  this.props.results.stats.p50 + ' ms' },
          { x : 'Delay Minimum', y :  this.props.results.stats.minimum + ' ms' },
          { x : 'Delay Maximum', y :  this.props.results.stats.maximum + ' ms' },
          { x : 'P95 - P50', y :  this.props.results.stats.p95p50 + ' ms' },
          { x : 'P75 - P25', y :  this.props.results.stats.p75p25 + ' ms' },
      ];
    }
  }

  render() {
    if (this.props.results.testtype === 'latency') {
      return (
        <div>
          <h3>{this.props.results.tr.test.type}: {this.props.results.tr.test.spec.source} -> {this.props.results.tr.test.spec.dest} ({this.props.results.tr.test.spec["packet-count"]} packets)</h3>
          <div><a href={this.props.results.tr.href + '/runs/first'}>{this.props.results.tr.href}/runs/first</a></div>
          <ReLineChart
            data={this.rawdata}
            stats = {this.props.results.stats}
          />
          <ReHistogram
            data={this.histdata}
          />
          <ReTable
            columns={AVGcolumns}
            data={this.avg}
          />
          <ReTable
            columns={PTcolumns}
            data={this.rawdata}
          />
        </div>
      );
    }
    else {
      console.log(this.props);
      return (
        <div>
          <a href={this.props.results.tr.href + '/runs/first'}>{this.props.results.tr.href}/runs/first</a>
        </div>
      );
    }
  }
}
export default DrawResults;
