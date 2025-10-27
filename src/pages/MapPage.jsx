import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Wind, Droplets } from 'lucide-react';

const MapPage = () => {
  const [activeStorms, setActiveStorms] = useState([]);
  const [selectedStorm, setSelectedStorm] = useState(null);

  useEffect(() => {
    const fetchActiveStorms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/active-storms');
        const data = await response.json();
        setActiveStorms(data);
      } catch (error) {
        console.error('Error fetching active storms:', error);
        setActiveStorms([]);
      }
    };

    fetchActiveStorms();
    // Refresh every 5 minutes
    const interval = setInterval(fetchActiveStorms, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category) => {
    if (category >= 5) return 'text-red-600';
    if (category >= 3) return 'text-orange-600';
    if (category >= 1) return 'text-yellow-600';
    return 'text-blue-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Storm Tracking</h1>
        <p className="text-gray-600">Real-time satellite imagery and storm data</p>
      </div>

      {/* Active Storms Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <AlertCircle className="mr-2 text-danger" size={24} />
          Active Storms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeStorms.map((storm) => (
            <div
              key={storm.id}
              onClick={() => setSelectedStorm(storm)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedStorm?.id === storm.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-primary'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">{storm.name}</h3>
                <span className={`text-sm font-semibold ${getCategoryColor(storm.category)}`}>
                  Category {storm.category}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Wind size={16} className="mr-2" />
                  <span>Winds: {storm.windSpeed}</span>
                </div>
                <div className="flex items-center">
                  <Droplets size={16} className="mr-2" />
                  <span>Pressure: {storm.pressure}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>Moving {storm.movement}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <span className="inline-block px-3 py-1 bg-danger text-white text-xs font-semibold rounded-full">
                  {storm.status}
                </span>
              </div>
            </div>
          ))}
          {activeStorms.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No active storms at this time
            </div>
          )}
        </div>
      </div>

      {/* Map Container - Clickable Card */}
      <a
        href="https://zoom.earth/maps/satellite/#view=17.22446,-77.083,8z/overlays=radar,wind,fires"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
      >
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
          <h2 className="text-2xl font-semibold mb-2">Interactive Satellite Map</h2>
          <p className="text-sm opacity-90">Click to open Zoom Earth - Real-time Weather Tracking</p>
        </div>
        
        {/* Preview Image/Placeholder */}
        <div className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600" style={{ height: '400px' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
            <MapPin className="mb-4 animate-bounce" size={64} />
            <h3 className="text-3xl font-bold mb-2">View Live Satellite Map</h3>
            <p className="text-lg mb-4 text-center">Real-time tracking of hurricanes, storms, and weather patterns</p>
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold">Click to Launch Zoom Earth</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-300 opacity-10 rounded-full blur-xl"></div>
        </div>
        
        <div className="bg-gray-50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Wind className="text-primary" size={20} />
              <span className="text-sm text-gray-700"><strong>Wind Patterns</strong> - Live data</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="text-primary" size={20} />
              <span className="text-sm text-gray-700"><strong>Radar Overlay</strong> - Real-time</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-primary" size={20} />
              <span className="text-sm text-gray-700"><strong>Active Fires</strong> - Tracking</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            <strong>Features:</strong> Satellite imagery, storm tracking, wind speed visualization, radar overlays, and fire detection
          </p>
        </div>
      </a>

      {/* Selected Storm Details */}
      {selectedStorm && (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{selectedStorm.name} Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-80">Category</p>
              <p className="text-2xl font-bold">{selectedStorm.category}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Wind Speed</p>
              <p className="text-xl font-semibold">{selectedStorm.windSpeed}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Pressure</p>
              <p className="text-xl font-semibold">{selectedStorm.pressure}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Movement</p>
              <p className="text-xl font-semibold">{selectedStorm.movement}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white border-opacity-30">
            <p className="text-sm opacity-90">
              <strong>Location:</strong> {selectedStorm.location.lat}°N, {Math.abs(selectedStorm.location.lon)}°W
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;

