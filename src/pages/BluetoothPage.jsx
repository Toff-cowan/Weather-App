import React, { useState, useEffect } from 'react';
import { Bluetooth, BluetoothOff, Users, Share2, AlertCircle } from 'lucide-react';

const BluetoothPage = () => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [sharedData, setSharedData] = useState([]);
  const [bluetoothSupported, setBluetoothSupported] = useState(true);

  useEffect(() => {
    // Check if Web Bluetooth API is supported
    if (!navigator.bluetooth) {
      setBluetoothSupported(false);
    }
  }, []);

  const toggleBluetooth = async () => {
    if (!isBluetoothEnabled) {
      // Enable Bluetooth
      setIsConnecting(true);
      try {
        // TODO: Implement actual Bluetooth connection
        // This uses Web Bluetooth API for low energy communication
        // Example implementation:
        /*
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['YOUR_SERVICE_UUID'] }] // Replace with your service UUID
        });
        const server = await device.gatt.connect();
        // Set up characteristics for data exchange
        */
        
        // Simulate connection
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsBluetoothEnabled(true);
        
        // Mock connected device
        setConnectedDevices([
          { id: 1, name: 'Emergency Device 1', distance: '15m', lastSeen: new Date() }
        ]);
      } catch (error) {
        console.error('Bluetooth connection failed:', error);
        alert('Failed to enable Bluetooth. Please ensure Bluetooth is available on your device.');
      } finally {
        setIsConnecting(false);
      }
    } else {
      // Disable Bluetooth
      setIsBluetoothEnabled(false);
      setConnectedDevices([]);
    }
  };

  const scanForDevices = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual device scanning
      // Example:
      /*
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['YOUR_SERVICE_UUID']
      });
      */
      
      // Simulate scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock discovered devices
      setConnectedDevices(prev => [
        ...prev,
        { 
          id: Date.now(), 
          name: `Emergency Device ${prev.length + 1}`, 
          distance: `${Math.floor(Math.random() * 50)}m`,
          lastSeen: new Date()
        }
      ]);
    } catch (error) {
      console.error('Device scan failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const shareEmergencyData = async () => {
    if (!isBluetoothEnabled) {
      alert('Please enable Bluetooth first');
      return;
    }

    try {
      // TODO: Implement actual data sharing via Bluetooth
      // Send emergency information to connected devices
      // Example:
      /*
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify({
        type: 'emergency',
        location: { lat: XX, lon: XX },
        message: 'Emergency data'
      }));
      await characteristic.writeValue(data);
      */
      
      const newData = {
        id: Date.now(),
        type: 'Emergency Alert',
        message: 'Shared emergency information with nearby devices',
        timestamp: new Date().toLocaleString(),
        recipients: connectedDevices.length
      };
      
      setSharedData(prev => [newData, ...prev]);
      alert('Emergency data shared successfully!');
    } catch (error) {
      console.error('Failed to share data:', error);
      alert('Failed to share data. Please try again.');
    }
  };

  if (!bluetoothSupported) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <BluetoothOff className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bluetooth Not Supported</h2>
          <p className="text-gray-600">
            Your browser doesn't support Web Bluetooth API. Please use a supported browser like Chrome, Edge, or Opera on desktop or Android.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <Bluetooth className="mr-3 text-primary" size={32} />
          Bluetooth Emergency Network
        </h1>
        <p className="text-gray-600">
          Low-energy Bluetooth communication for sharing emergency information when internet is unavailable
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
        <div className="flex items-start">
          <AlertCircle className="text-primary mr-3 flex-shrink-0 mt-1" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Enable Bluetooth to connect with nearby emergency apps</li>
              <li>Share your location and emergency status with nearby devices</li>
              <li>Receive emergency information from others in your area</li>
              <li>Works without internet connection using Bluetooth Low Energy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bluetooth Toggle */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Bluetooth Status</h2>
            <p className="text-sm text-gray-600">
              {isBluetoothEnabled ? 'Connected and ready to share' : 'Disconnected'}
            </p>
          </div>
          <button
            onClick={toggleBluetooth}
            disabled={isConnecting}
            className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isBluetoothEnabled ? 'bg-primary' : 'bg-gray-300'
            } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform ${
                isBluetoothEnabled ? 'translate-x-12' : 'translate-x-1'
              }`}
            >
              {isBluetoothEnabled ? (
                <Bluetooth className="m-2 text-primary" size={24} />
              ) : (
                <BluetoothOff className="m-2 text-gray-400" size={24} />
              )}
            </span>
          </button>
        </div>

        {isConnecting && (
          <div className="text-center py-4">
            <div className="animate-spin text-2xl mb-2">🔄</div>
            <p className="text-sm text-gray-600">Connecting to Bluetooth...</p>
          </div>
        )}
      </div>

      {/* Connected Devices */}
      {isBluetoothEnabled && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Users className="mr-2" size={24} />
              Nearby Devices ({connectedDevices.length})
            </h2>
            <button
              onClick={scanForDevices}
              disabled={isConnecting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isConnecting ? 'Scanning...' : 'Scan for Devices'}
            </button>
          </div>

          {connectedDevices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="mx-auto mb-2" size={48} />
              <p>No devices found nearby</p>
              <p className="text-sm">Click "Scan for Devices" to search for emergency apps in your area</p>
            </div>
          ) : (
            <div className="space-y-3">
              {connectedDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                      <Bluetooth className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{device.name}</p>
                      <p className="text-sm text-gray-600">Distance: {device.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-success rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Connected</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Share Data Section */}
      {isBluetoothEnabled && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Share2 className="mr-2" size={24} />
            Share Emergency Information
          </h2>
          <p className="text-gray-600 mb-4">
            Broadcast your emergency status and location to all nearby connected devices
          </p>
          <button
            onClick={shareEmergencyData}
            className="w-full bg-danger hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Share Emergency Data
          </button>
        </div>
      )}

      {/* Shared Data History */}
      {sharedData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Shares</h2>
          <div className="space-y-3">
            {sharedData.map((data) => (
              <div key={data.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{data.type}</p>
                    <p className="text-sm text-gray-600 mt-1">{data.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Shared with {data.recipients} device(s) • {data.timestamp}
                    </p>
                  </div>
                  <Share2 className="text-success" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BluetoothPage;

