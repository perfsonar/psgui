import React, { Component } from 'react';
import '../App.css';
import ReLatencyChart from '../containers/ReLatencyChart';
import ReThroughputChart from '../containers/ReThroughputChart';
import ReLatencyHistogram from '../containers/ReLatencyHistogram';
import ReTable from '../containers/ReTable';
import { getReadableNetworkSpeedString, getThousendsDivisionSep } from '../includes/common.js';

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
    else if (this.props.results.testtype === 'throughput') {
      const sepArr = []
      for (const [key, value] of Object.entries(this.props.results.intervals)) {
        sepArr.push(getThousendsDivisionSep(value.streams["0"]["throughput-bits"]))
      }
      var counts = {};
      sepArr.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
      this.divisionSep = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      this.measurementUnits = getReadableNetworkSpeedString(this.divisionSep)
      this.rawdata = Object.entries(this.props.results.intervals).map((value) => ({x:Math.round(value["1"].streams["0"].end), y:(value["1"].streams["0"]["throughput-bits"]/this.divisionSep).toFixed(2)}))
      console.log(getReadableNetworkSpeedString(1000000))
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
          <ReLatencyChart
            data={this.rawdata}
            stats = {this.props.results.stats}
          />
          <ReLatencyHistogram
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
    else if (this.props.results.testtype === 'throughput') {
      return (
        <div>
          <a href={this.props.results.tr.href + '/runs/first'}>{this.props.results.tr.href}/runs/first</a>
          <ReThroughputChart
            data={this.rawdata}
            units={this.measurementUnits}
          />
        </div>
      );
    }
    else {
      return (
        <div>
          <a href={this.props.results.tr.href + '/runs/first'}>{this.props.results.tr.href}/runs/first</a>
        </div>
      );
    }
  }
}
export default DrawResults;
