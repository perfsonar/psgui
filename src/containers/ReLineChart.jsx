import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class ReLineChart extends Component {

  render() {
		return (
    <LineChart
      width={800}
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
        label={{ value: "Packets", position: "insideBottomRight", fill:"#666", dy: 10}}
      />
      <YAxis
        type="number"
        domain={['dataMin - 1', 'dataMax + 1']}
        strokeWidth={1}
        dataKey="y"
        name="latency"
        label={{ value: "Latency", position: "insideLeft", fill:"#666", angle: -90, dx:5, dy: -100}}
      />
      <Line dataKey="y" strokeWidth={2} dot={false} stroke="CornflowerBlue" />
      <Tooltip />
    </LineChart>
		);
	}
}

export default ReLineChart;