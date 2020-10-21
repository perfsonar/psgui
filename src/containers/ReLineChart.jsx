import React, { Component } from 'react';
import { LineChart, Line, ReferenceLine, ReferenceArea, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

class ReLineChart extends Component {

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
        dataKey="y"
        name="latency"
        label={{ value: "Latency [ms]", position: "insideLeft", fill:"#666", angle: -90, dx:5, dy: -60}}
      />
      <Line nameKey="a" dataKey="y" strokeWidth={2} dot={false} stroke="CornflowerBlue" />
      <ReferenceLine y={this.props.avglatency} label={{ position: "left", value: this.props.avglatency + ' ms'}} stroke="red" strokeDasharray="3 3" />
      <ReferenceArea y1={this.props.avglatency - this.props.jitter} y2={this.props.avglatency + this.props.jitter} strokeOpacity={0.3} />
      <Tooltip formatter={(y) => [y + ' ms', 'Latency'] } labelFormatter={(x) => 'Packet No. ' + x} />

    </LineChart>
		);
	}
}

export default ReLineChart;