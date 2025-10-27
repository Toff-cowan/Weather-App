import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, Wind, Droplets, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsPage = () => {
  const [stormData, setStormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStormData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/storm-analytics');
        const data = await response.json();
        setStormData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching storm data:', error);
        setLoading(false);
      }
    };

    fetchStormData();
    // Refresh data every 10 minutes
    const interval = setInterval(fetchStormData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🌀</div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!stormData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">No storm data available at this time.</p>
      </div>
    );
  }

  const windSpeedChartData = {
    labels: stormData.windSpeedHistory.labels,
    datasets: [
      {
        label: 'Wind Speed (mph)',
        data: stormData.windSpeedHistory.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const pressureChartData = {
    labels: stormData.pressureHistory.labels,
    datasets: [
      {
        label: 'Pressure (mb)',
        data: stormData.pressureHistory.data,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const sizeGrowthChartData = {
    labels: stormData.sizeGrowth.labels,
    datasets: [
      {
        label: 'Storm Size (miles)',
        data: stormData.sizeGrowth.data,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Storm Analytics</h1>
        <p className="text-gray-600">
          Data sourced from StormCarib.com and other meteorological sources
        </p>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Wind size={32} />
            <span className="text-sm opacity-80">Wind Speed</span>
          </div>
          <p className="text-3xl font-bold">{stormData.currentStats.maxWindSpeed}</p>
          <p className="text-sm opacity-90 mt-1">Maximum sustained</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Droplets size={32} />
            <span className="text-sm opacity-80">Pressure</span>
          </div>
          <p className="text-3xl font-bold">{stormData.currentStats.minPressure}</p>
          <p className="text-sm opacity-90 mt-1">Minimum central</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={32} />
            <span className="text-sm opacity-80">Category</span>
          </div>
          <p className="text-3xl font-bold">{stormData.currentStats.category}</p>
          <p className="text-sm opacity-90 mt-1">Hurricane scale</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity size={32} />
            <span className="text-sm opacity-80">Movement</span>
          </div>
          <p className="text-2xl font-bold">{stormData.currentStats.movement}</p>
          <p className="text-sm opacity-90 mt-1">Current direction</p>
        </div>
      </div>

      {/* Storm Name */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold">{stormData.stormName}</h2>
        <p className="opacity-90">Tracking and analysis</p>
      </div>

      {/* Wind Speed Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Wind Speed Over Time</h2>
        <div style={{ height: '300px' }}>
          <Line data={windSpeedChartData} options={chartOptions} />
        </div>
      </div>

      {/* Pressure Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Atmospheric Pressure Trends</h2>
        <div style={{ height: '300px' }}>
          <Line data={pressureChartData} options={chartOptions} />
        </div>
      </div>

      {/* Size Growth Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Storm Size Growth</h2>
        <div style={{ height: '300px' }}>
          <Bar data={sizeGrowthChartData} options={chartOptions} />
        </div>
      </div>

      {/* Data Source Note */}
      <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Data Source:</strong> Analytics are web-scraped from{' '}
          <a 
            href="https://stormcarib.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            StormCarib.com
          </a>
          {' '}and updated every 10 minutes. Historical data provides insights into storm intensity changes and movement patterns.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;

