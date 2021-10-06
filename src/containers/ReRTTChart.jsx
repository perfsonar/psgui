import React, { Component } from 'react';
import { LineChart, Line, ReferenceLine, ReferenceArea, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class ReRTTChart extends Component {

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
        domain={['dataMin - 1', 'dataMax + 1']}
        strokeWidth={1}
        dataKey="q"
        name="latency"
        label={{ value: "Time [ms]", position: "insideLeft", fill:"#666", angle: -90, dx:5, dy: -60}}
      />

      <Line nameKey="a" dataKey="q" strokeWidth={2} dot={false} stroke="CornflowerBlue" />
      <Tooltip formatter={(y) => [y + ' ms', 'Time'] } labelFormatter={(x) => 'Packet No. ' + x} />

    </LineChart>
		);
	}
}

export default ReRTTChart;