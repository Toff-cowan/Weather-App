import React, { useState, useEffect } from 'react';
import { Thermometer, Wind, Droplets, Eye, Gauge, MapPin, RefreshCw } from 'lucide-react';

const JamaicaWeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/weather/jamaica');
      const data = await response.json();
      setWeatherData(data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Jamaica weather:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🌤️</div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Weather data not available.</p>
      </div>
    );
  }

  const { parsed, summary, observation_time, stationName, raw } = weatherData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <MapPin className="mr-2" size={28} />
              <h1 className="text-3xl font-bold">Jamaica Weather</h1>
            </div>
            <p className="text-sm opacity-90">{stationName}</p>
            <p className="text-xs opacity-75 mt-1">
              Observation Time: {observation_time} UTC
            </p>
          </div>
          <button
            onClick={fetchWeather}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition-all"
            title="Refresh data"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Current Conditions</h2>
        <p className="text-2xl text-gray-700 leading-relaxed">{summary}</p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-3">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Main Weather Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Temperature */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Thermometer size={40} />
            <span className="text-sm opacity-80">Temperature</span>
          </div>
          <p className="text-4xl font-bold">{parsed.temperature.fahrenheit}°F</p>
          <p className="text-lg opacity-90 mt-1">{parsed.temperature.celsius}°C</p>
        </div>

        {/* Wind */}
        <div className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Wind size={40} />
            <span className="text-sm opacity-80">Wind</span>
          </div>
          <p className="text-2xl font-bold">{parsed.wind.speed} {parsed.wind.unit}</p>
          <p className="text-sm opacity-90 mt-1">
            {parsed.wind.directionCompass} ({parsed.wind.direction}°)
          </p>
          {parsed.wind.gust && (
            <p className="text-sm opacity-80 mt-1">Gusts: {parsed.wind.gust} {parsed.wind.unit}</p>
          )}
        </div>

        {/* Dew Point */}
        <div className="bg-gradient-to-br from-teal-400 to-green-500 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Droplets size={40} />
            <span className="text-sm opacity-80">Dew Point</span>
          </div>
          <p className="text-4xl font-bold">{parsed.dewPoint.fahrenheit}°F</p>
          <p className="text-lg opacity-90 mt-1">{parsed.dewPoint.celsius}°C</p>
        </div>

        {/* Pressure */}
        <div className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Gauge size={40} />
            <span className="text-sm opacity-80">Pressure</span>
          </div>
          <p className="text-3xl font-bold">{parsed.pressure.value}</p>
          <p className="text-lg opacity-90 mt-1">{parsed.pressure.unit}</p>
        </div>

        {/* Visibility */}
        <div className="bg-gradient-to-br from-gray-400 to-gray-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye size={40} />
            <span className="text-sm opacity-80">Visibility</span>
          </div>
          <p className="text-3xl font-bold">{parsed.visibility.description}</p>
        </div>

        {/* Cloud Cover */}
        <div className="bg-gradient-to-br from-slate-400 to-slate-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-4xl">☁️</div>
            <span className="text-sm opacity-80">Sky Conditions</span>
          </div>
          <p className="text-2xl font-bold">{parsed.clouds}</p>
        </div>
      </div>

      {/* Wind Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Wind Details</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Direction:</span>
            <span className="font-semibold text-gray-800">{parsed.wind.description}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Speed:</span>
            <span className="font-semibold text-gray-800">{parsed.wind.speed} knots</span>
          </div>
          {parsed.wind.gust && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gust Speed:</span>
              <span className="font-semibold text-gray-800 text-red-600">{parsed.wind.gust} knots</span>
            </div>
          )}
        </div>
      </div>

      {/* Raw METAR Data */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Raw METAR Data</h2>
        <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
          {raw}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          METAR = Meteorological Aerodrome Report (Aviation Weather Format)
        </p>
      </div>

      {/* Data Source Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Data Source:</strong> National Weather Service (NOAA) -{' '}
          <a 
            href="https://tgftp.nws.noaa.gov/weather/current/MKJP.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            Kingston/Norman Manley Station (MKJP)
          </a>
          . Data updates hourly and is automatically refreshed.
        </p>
      </div>
    </div>
  );
};

export default JamaicaWeatherPage;

