import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const BarChart = ({ data, labels }) => {
  const chartData = labels.map((label, index) => {
    return {
      label: label,
      count: data[index],
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
      ][index],
    };
  });

  return (
    <div>
      <RechartsBarChart
        width={800}
        height={300}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" background={{ fill: "#eee" }} />
      </RechartsBarChart>
    </div>
  );
};

export default React.memo(BarChart);
