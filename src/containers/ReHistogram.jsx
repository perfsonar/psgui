import React, { Component } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import colors from '../includes/colordata.js';

class ReHistogram extends Component {

  render() {
		return (
    <BarChart
      width={800}
      height={400}
      data={this.props.data}
      barCategoryGap="1%"
      margin={{
          top: 20, right: 30, left: 20, bottom: 10,
        }}
      >
      <CartesianGrid strokeDasharray="5" />
      <XAxis
        dataKey="latency"
        label={{ value: "Latency", position: "insideBottomRight", fill:"#666", dy: 8}}
      />
      <YAxis
        dataKey="value"
        label={{ value: "Packets", position: "insideLeft", angle: -90, fill:"#666", dx:5, dy: -100}}
      />
      <Tooltip />
      <Bar dataKey="value">
        {this.props.data.map((entry, index) => (
          <Cell key={index} fill={colors[index]} />
        ))}
      </Bar>
    </BarChart>
		);
	}
}

export default ReHistogram;
