import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserStatsChart = ({ data }) => {
  // Format data for the chart
  const chartData = data.map(item => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      users: item.count
    };
  });

  // Sort data chronologically
  chartData.sort((a, b) => {
    const aDate = new Date(a.name);
    const bDate = new Date(b.name);
    return aDate - bDate;
  });

  return (
    <div className="h-80">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#8884d8" name="New Users" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No user signup data available</p>
        </div>
      )}
    </div>
  );
};

export default UserStatsChart;