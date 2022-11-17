import React, { Component } from 'react';
import '../App.css';
import ReLatencyChart from '../containers/ReLatencyChart';
import ReThroughputChart from '../containers/ReThroughputChart';
import ReRTTChart from '../containers/ReRTTChart';
import ReTraceChart from '../containers/ReTraceChart';
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

const TPcolumns = [
  {
    Header: "Second",
    accessor: "x",
  },
  {
    Header: "Throughput",
    accessor: "y",
  },
];

const RTcolumns = [
  {
    Header: "Nr.",
    accessor: "x",
  },
  {
    Header: "IP",
    accessor: "y",
  },
  {
    Header: "Length (Bytes)",
    accessor: "z",
  },
  {
    Header: "TTL",
    accessor: "p",
  },
  {
    Header: "Time (ms)",
    accessor: "q",
  },
];

const TTcolumns = [
  {
    Header: "Nr.",
    accessor: "x",
  },
  {
    Header: "hostname",
    accessor: "y",
  },
  {
    Header: "IP",
    accessor: "z",
  },
  {
    Header: "RTT (ms)",
    accessor: "p",
  },
  //~ {
    //~ Header: "AS Owner",
    //~ accessor: "q",
  //~ },
  //~ {
    //~ Header: "AS Number",
    //~ accessor: "r",
  //~ },
];

const flatten = (obj, prefix = '', res = {}) =>
  Object.entries(obj).reduce((r, [key, val]) => {
    const k = `${prefix}${key}`
    if(typeof val === 'object'){
      flatten(val, `${k}.`, r)
    } else {
      res[k] = val
    }
    return r
  }, res
)

//~ const iso8601sec2ms = (iso) => 1000*parseFloat(iso.substring(iso.lastIndexOf("PT") + 2, iso.lastIndexOf("S"))).toFixed(2);
const iso8601sec2ms = (iso) => (iso) ? parseFloat((1000*parseFloat(iso.substring(iso.lastIndexOf("PT") + 2, iso.lastIndexOf("S")))).toFixed(2)) : 0;

const TestParameters = (tp) => {
  const [showParams, setShowParams] = React.useState(false)
  console.log(showParams);
  const onClick = () => setShowParams(!showParams);
  console.log(showParams);
  return (
    <div>
      <input type="submit" value="Show/Hide Test Parameters" onClick={onClick} />
      { showParams ? <TestParams tp={tp} /> : null }
    </div>
  )
}

const TestParams = (tp) => (
    <div className="testparams">
        <pre className="description">{JSON.stringify(tp, null, 2) }</pre>
    </div>
)

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
    }
    else if (this.props.results.testtype === 'rtt') {
      this.rawdata = Object.entries(this.props.results["result"]["roundtrips"]).map(
        ([key, value], i) => ({
          x:key,
          y:value['ip'],
          z:value['length'],
          p:value['ttl'],
          q:iso8601sec2ms(value['rtt'])
        })
      )
    }
    else if (this.props.results.testtype === 'trace') {
      this.rawdata = Object.entries(
        this.props.results["result"]["paths"][0]).map(
          ([key, value], i) => ({
            x:key,
            y:value['hostname'],
            z:value['ip'],
            q:value["as"],
            r:value['as'],
            p:iso8601sec2ms(value['rtt'])
          })
      )
      let val = 0
      for (var k in this.rawdata){
        if(k > 0 && this.rawdata[k]['p'] == 0) {
          this.rawdata[k]['p'] = val
        }
        val = this.rawdata[k]['p']
      }
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
          <h3>{this.props.results.tr.test.type}: {this.props.results.tr.test.spec.source} -> {this.props.results.tr.test.spec.dest} ({this.props.results["packets-sent"]} packets)</h3>
          <div><a href={this.props.results.tr.href + '/runs/first'}>{this.props.results.tr.href}/runs/first</a></div>
          <TestParameters
            tp={this.props.results.tr.test.spec}
          />
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
          <h3>{this.props.results.tr.test.type}: {this.props.results.tr.test.spec.source} -> {this.props.results.tr.test.spec.dest} ({this.props.results.tr.tool})</h3>
          <div><a href={this.props.results.tr.href + '/runs/first'}>{this.props.results.tr.href}/runs/first</a></div>
          <TestParameters
            tp={this.props.results.tr.test.spec}
          />
          <ReThroughputChart
            data={this.rawdata}
            units={this.measurementUnits}
          />
          <ReTable
            columns={TPcolumns}
            data={this.rawdata}
          />
        </div>
      );
    }
    else if (this.props.results.testtype === 'rtt') {
      return (
        <div>
          <h3>{this.props.results.tr.test.type}: {this.props.results.tr.test.spec.source} -> {this.props.results.tr.test.spec.dest} ({this.props.results.tr.tool})</h3>
          <div><a href={this.props.results.tr.href + '/runs/first'}>{this.props.results.tr.href}/runs/first</a></div>
          <TestParameters
            tp={this.props.results.tr.test.spec}
          />
          <ReRTTChart
            data={this.rawdata}
            units={this.measurementUnits}
          />
          <ReTable
            columns={RTcolumns}
            data={this.rawdata}
          />
        </div>
      );
    }
    else if (this.props.results.testtype === 'trace') {
        console.log(this.props.results.tr.test.spec);
      return (
        <div>
          <h3>{this.props.results.tr.test.type}: {this.props.results.tr.test.spec.source} -> {this.props.results.tr.test.spec.dest} ({this.props.results.tr.tool})</h3>
          <div><a href={this.props.results.tr.href + '/runs/first'}>{this.props.results.tr.href}/runs/first</a></div>
          <TestParameters
            tp={this.props.results.tr.test.spec}
          />
          <ReTraceChart
            data={this.rawdata}
            units={this.measurementUnits}
          />
          <ReTable
            columns={TTcolumns}
            data={this.rawdata}
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
