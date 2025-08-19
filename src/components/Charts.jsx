import React, { useState, useEffect } from 'react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Charts = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processChartData = async () => {
      try {
        // Fetch the mock data directly from the public folder
        const response = await fetch('/mock-data.json');
        const data = await response.json();
        const trackings = data.trackings || [];

        // Group by status
        const statusCounts = trackings.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});

        // Convert to array format for charts
        const statusData = Object.entries(statusCounts).map(([name, count]) => ({
          name,
          count,
        }));

        // Group by month
        const monthlyCounts = trackings.reduce((acc, item) => {
          if (item.startDate) {
            const date = new Date(item.startDate);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            acc[monthYear] = (acc[monthYear] || 0) + 1;
          }
          return acc;
        }, {});

        // Convert to array and sort by date
        const monthlyData = Object.entries(monthlyCounts)
          .map(([month, count]) => ({
            month,
            count,
          }))
          .sort((a, b) => a.month.localeCompare(b.month));

        // Calculate total cost
        const totalCost = trackings.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);

        setChartData({
          statusCounts: statusData,
          monthlyCounts: monthlyData,
          totalTrackings: trackings.length,
          totalCost: totalCost.toFixed(2)
        });
        setError(null);
      } catch (err) {
        console.error('Error processing chart data:', err);
        setError('Failed to process chart data');
      } finally {
        setLoading(false);
      }
    };

    processChartData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || !chartData) {
    return <div className="p-4 text-red-500">{error || 'No chart data available'}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Tracking Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.statusCounts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                    window.innerWidth >= 768
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : null
                  }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                paddingAngle={5}
                innerRadius={60}
                isAnimationActive={false}
              >
                {chartData.statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mt-8">
        <h3 className="text-lg font-medium mb-4">Monthly Tracking Volume</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData.monthlyCounts}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280' }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="top" 
                align="center"
                wrapperStyle={{ paddingBottom: '20px' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Number of Trackings"
                stroke="#8884d8" 
                strokeWidth={3}
                isAnimationActive={false}
                dot={{
                  fill: '#8884d8',
                  stroke: '#fff',
                  strokeWidth: 2,
                  r: 5,
                  activeDot: { r: 8 }
                }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
