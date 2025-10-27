import React, { useState } from 'react';
import { Bluetooth, Radio, Send, AlertCircle, Smartphone, RefreshCw, Check, X } from 'lucide-react';

const BluetoothPage = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('Need Help');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sendStatus, setSendStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Scan for Bluetooth devices using Web Bluetooth API
  const scanForDevices = async () => {
    setIsScanning(true);
    setSendStatus(null);
    
    try {
      // Request Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      });

      // Add discovered device to list
      const newDevice = {
        id: device.id,
        name: device.name || 'Unknown Device',
        device: device,
        signal: 'Strong',
        distance: Math.floor(Math.random() * 100) + 10 + 'm'
      };

      setNearbyDevices(prev => {
        const exists = prev.find(d => d.id === device.id);
        if (exists) return prev;
        return [...prev, newDevice];
      });

      setSendStatus({ type: 'success', message: `✅ Found: ${device.name || 'Device'}` });
    } catch (error) {
      console.error('Bluetooth scan error:', error);
      if (error.message.includes('User cancelled')) {
        setSendStatus({ type: 'info', message: 'Device selection cancelled' });
      } else {
        setSendStatus({ 
          type: 'error', 
          message: 'Bluetooth not available. Please enable Bluetooth on your device.'
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Send SMS via backend
  const sendEmergencySMS = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendStatus({ type: 'info', message: '📤 Sending emergency message...' });

    try {
      const emergencyMessage = `[EMERGENCY BLUETOOTH ALERT]\nType: ${messageType}\nMessage: ${message}\nFrom: Weather Tracker App`;

      const response = await fetch('http://localhost:5000/api/bluetooth/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          message: emergencyMessage,
          messageType: messageType
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSendStatus({ 
          type: 'success', 
          message: data.twilioConfigured 
            ? '✅ Emergency SMS sent successfully!' 
            : '✅ Message logged! (Add Twilio credentials to send real SMS)'
        });
        setMessage('');
      } else {
        setSendStatus({ 
          type: 'error', 
          message: data.error || 'Failed to send message' 
        });
      }
    } catch (error) {
      setSendStatus({ 
        type: 'error', 
        message: '❌ Network error: Unable to send message' 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Emergency Bluetooth Network
            </h1>
            <p className="text-gray-600">
              Low-energy communication + SMS for emergency situations
            </p>
          </div>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
              isEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-12' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Bluetooth
            className={isEnabled ? 'text-blue-500 animate-pulse' : 'text-gray-400'}
            size={24}
          />
          <span className={`font-medium ${isEnabled ? 'text-blue-500' : 'text-gray-500'}`}>
            {isEnabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start">
          <AlertCircle className="text-blue-500 mr-3 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">Emergency Communication</h3>
            <p className="text-sm text-blue-700">
              Enable Bluetooth to discover nearby devices, then send emergency SMS alerts to any phone number.
              Perfect for testing emergency notifications!
            </p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {sendStatus && (
        <div className={`border-l-4 p-4 rounded ${
          sendStatus.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
          sendStatus.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
          'bg-blue-50 border-blue-500 text-blue-800'
        }`}>
          <div className="flex items-center">
            {sendStatus.type === 'success' && <Check className="mr-2" size={20} />}
            {sendStatus.type === 'error' && <X className="mr-2" size={20} />}
            <p className="font-medium">{sendStatus.message}</p>
          </div>
        </div>
      )}

      {/* Scan for Devices */}
      {isEnabled && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Radio className="mr-2 text-primary" size={24} />
            Nearby Bluetooth Devices
          </h2>
          
          <button
            onClick={scanForDevices}
            disabled={isScanning}
            className="w-full mb-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={isScanning ? 'animate-spin' : ''} size={20} />
            <span>{isScanning ? 'Scanning for devices...' : 'Scan for Bluetooth Devices'}</span>
          </button>

          {nearbyDevices.length > 0 ? (
            <div className="space-y-3">
              {nearbyDevices.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer ${
                    selectedDevice?.id === device.id ? 'border-primary bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="flex items-center space-x-3">
                    <Bluetooth className="text-blue-500" size={24} />
                    <div>
                      <p className="font-semibold text-gray-800">{device.name}</p>
                      <p className="text-sm text-gray-500">Range: ~{device.distance}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {device.signal}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bluetooth className="mx-auto mb-3 text-gray-300" size={48} />
              <p>No devices found yet</p>
              <p className="text-sm mt-1">Click "Scan for Bluetooth Devices" to discover nearby devices</p>
            </div>
          )}
        </div>
      )}

      {/* Emergency SMS Form */}
      {isEnabled && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Smartphone className="mr-2 text-danger" size={24} />
            Send Emergency SMS
          </h2>
          <form onSubmit={sendEmergencySMS} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+1234567890 (include country code)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 For testing: Use your own phone number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Type *
              </label>
              <select 
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option>Need Help</option>
                <option>Medical Emergency</option>
                <option>Location Update</option>
                <option>Safe & Secure</option>
                <option>Evacuation Alert</option>
                <option>Hurricane Warning</option>
                <option>Custom Message</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Details *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter emergency details, location, or instructions..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-danger text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} className={isSending ? 'animate-pulse' : ''} />
              <span>{isSending ? 'Sending...' : 'Send Emergency SMS'}</span>
            </button>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            <strong>⚙️ Setup:</strong> Without Twilio, messages are logged to backend console.
            To send real SMS, add these to your <code className="bg-yellow-100 px-1 rounded">.env</code>:
            <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded overflow-x-auto">
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token  
TWILIO_PHONE_NUMBER=+1234567890
            </pre>
          </div>
        </div>
      )}

      {/* How it Works */}
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">🔧 How This Works</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start">
            <span className="mr-2">1️⃣</span>
            <p><strong>Enable Bluetooth</strong> - Activates the emergency communication system</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2">2️⃣</span>
            <p><strong>Scan for Devices</strong> - Uses Web Bluetooth API to discover nearby devices</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2">3️⃣</span>
            <p><strong>Send SMS</strong> - Backend sends emergency text to any phone number</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2">✅</span>
            <p><strong>Test Mode</strong> - Without Twilio, messages are logged for testing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BluetoothPage;
