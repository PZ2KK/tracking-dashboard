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
    <div className="space-y-6 px-2 sm:px-0">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-md sm:text-lg font-medium mb-4">Tracking Status Distribution</h3>
        <div className="h-36 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.statusCounts}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                    window.innerWidth >= 640
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : null
                  }
                outerRadius={window.innerWidth < 640 ? '70%' : 80}
                fill="#8884d8"
                dataKey="count"
                paddingAngle={5}
                innerRadius={window.innerWidth < 640 ? '40%' : 60}
                isAnimationActive={false}
              >
                {chartData.statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  fontSize: window.innerWidth < 640 ? '12px' : '14px'
                }}
              />
              <Legend 
                layout={window.innerWidth < 640 ? 'vertical' : 'vertical'}
                align={window.innerWidth < 640 ? 'left' : 'right'}
                verticalAlign={window.innerWidth < 640 ? 'middle' : 'middle'}
                wrapperStyle={{ 
                  paddingLeft: window.innerWidth < 640 ? '0' : '20px',
                  paddingTop: window.innerWidth < 640 ? '10px' : '0'
                }}
                iconSize={window.innerWidth < 640 ? 10 : 12}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-md sm:text-lg font-medium mb-4">Monthly Tracking Volume</h3>
        <div className="h-48 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData.monthlyCounts}
              margin={{
                top: 5,
                right: window.innerWidth < 640 ? 10 : 30,
                left: window.innerWidth < 640 ? 10 : 20,
                bottom: window.innerWidth < 640 ? 0 : 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ 
                  fill: '#6b7280',
                  fontSize: window.innerWidth < 640 ? '10px' : '12px'
                }}
                tickMargin={10}
                tickFormatter={(value) => {
                  if (window.innerWidth < 640) {
                    const [year, month] = value.split('-')
                    return `${month}/${year.slice(2)}`
                  }
                  return value;
                }}
              />
              <YAxis 
                tick={{ 
                  fill: '#6b7280',
                  fontSize: window.innerWidth < 640 ? '10px' : '12px'
                }}
                tickMargin={10}
                width={window.innerWidth < 640 ? 30 : 40}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  fontSize: window.innerWidth < 640 ? '12px' : '14px'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="top" 
                align="center"
                wrapperStyle={{ 
                  paddingBottom: '20px',
                  fontSize: window.innerWidth < 640 ? '12px' : '14px'
                }}
                iconSize={window.innerWidth < 640 ? 10 : 12}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Number of Trackings"
                stroke="#8884d8" 
                strokeWidth={window.innerWidth < 640 ? 2 : 3}
                isAnimationActive={false}
                dot={{
                  fill: '#8884d8',
                  stroke: '#fff',
                  strokeWidth: window.innerWidth < 640 ? 1 : 2,
                  r: window.innerWidth < 640 ? 3 : 5,
                  activeDot: { r: window.innerWidth < 640 ? 5 : 8 }
                }}
                activeDot={{ r: window.innerWidth < 640 ? 5 : 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
