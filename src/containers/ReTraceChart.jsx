import React, { Component } from 'react';
import { LineChart, Line,  CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const formatter = (value, name, props) => {
  let formattedName = props.payload['y']
  if(!formattedName) {
    formattedName = 'Unknown'
  }
  let formattedValue = value + ' ms'
  return [formattedValue, formattedName, props]
}

const labelFormatter = (value, name, props) => {
  let formattedName = name
  let formattedValue = 'Packet '  + value
  return [formattedValue, formattedName, props]
}

class ReTraceChart extends Component {

  render() {
		return (
    <LineChart
      width={1200}
      height={400}
      data={this.props.data}
      margin={{
          top: 20, right: 30, left: 20, bottom: 10,
        }}
    >
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

      <XAxis
        dataKey="x"
        domain={['dataMin', 'dataMax']}
        strokeWidth={1}
        label={{ value: "Packet [No.]", position: "insideBottomRight", fill:"#666", dy: 10}}
      />

      <YAxis
        type="number"
        domain={['dataMin', 'dataMax + 1']}
        strokeWidth={1}
        dataKey="p"
        name="latency"
        label={{ value: "Time [ms]", position: "insideLeft", fill:"#666", angle: -90, dx:5, dy: -60}}
      />

      <Line nameKey="a" dataKey="p" strokeWidth={2} dot={false} stroke="CornflowerBlue" />
      <Tooltip formatter={ formatter } labelFormatter={labelFormatter} />

    </LineChart>
		);
	}
}

export default ReTraceChart;