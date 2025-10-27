import React, { useState } from 'react';
import { Phone, MapPin, Search, ExternalLink } from 'lucide-react';

const EmergencyContactsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Replace with actual data from your database or API
  // You can expand this with more regions and contacts
  const emergencyContacts = {
    'jamaica': {
      name: 'Jamaica',
      contacts: [
        { type: 'Emergency Services', number: '119', description: 'Police, Fire, Ambulance' },
        { type: 'Police', number: '119', description: 'Jamaica Constabulary Force' },
        { type: 'Fire Brigade', number: '110', description: 'Jamaica Fire Brigade' },
        { type: 'Ambulance', number: '110', description: 'Emergency Medical Services' },
        { type: 'Disaster Management', number: '1-888-463-6282', description: 'Office of Disaster Preparedness and Emergency Management (ODPEM)' },
        { type: 'Hurricane Hotline', number: '1-888-991-5005', description: 'ODPEM Hurricane Information' },
        { type: 'Red Cross', number: '1-876-926-3516', description: 'Jamaica Red Cross' },
      ]
    },
    'bahamas': {
      name: 'Bahamas',
      contacts: [
        { type: 'Emergency Services', number: '919', description: 'Police, Fire, Ambulance' },
        { type: 'Police', number: '911 or 919', description: 'Royal Bahamas Police Force' },
        { type: 'Fire Brigade', number: '919', description: 'Fire Services' },
        { type: 'Disaster Management', number: '1-242-322-6232', description: 'National Emergency Management Agency (NEMA)' },
        { type: 'Hurricane Center', number: '1-242-377-7025', description: 'Bahamas Department of Meteorology' },
        { type: 'Red Cross', number: '1-242-323-7370', description: 'Bahamas Red Cross' },
      ]
    },
    'barbados': {
      name: 'Barbados',
      contacts: [
        { type: 'Emergency Services', number: '211', description: 'Police, Fire, Ambulance' },
        { type: 'Police', number: '211', description: 'Royal Barbados Police Force' },
        { type: 'Fire Brigade', number: '311', description: 'Barbados Fire Service' },
        { type: 'Ambulance', number: '511', description: 'Emergency Ambulance Service' },
        { type: 'Disaster Management', number: '1-246-511-4200', description: 'Department of Emergency Management (DEM)' },
        { type: 'Red Cross', number: '1-246-427-6461', description: 'Barbados Red Cross' },
      ]
    },
    'trinidad': {
      name: 'Trinidad and Tobago',
      contacts: [
        { type: 'Emergency Services', number: '999', description: 'Police, Fire, Ambulance' },
        { type: 'Police', number: '999', description: 'Trinidad and Tobago Police Service' },
        { type: 'Fire Brigade', number: '990', description: 'Fire Services' },
        { type: 'Ambulance', number: '811', description: 'Emergency Health Services' },
        { type: 'Disaster Management', number: '1-868-511-4362', description: 'Office of Disaster Preparedness and Management (ODPM)' },
        { type: 'Red Cross', number: '1-868-627-6265', description: 'Trinidad and Tobago Red Cross' },
      ]
    },
    'puerto-rico': {
      name: 'Puerto Rico',
      contacts: [
        { type: 'Emergency Services', number: '911', description: 'Police, Fire, Ambulance' },
        { type: 'Police', number: '911', description: 'Puerto Rico Police' },
        { type: 'Fire Department', number: '911', description: 'Fire Services' },
        { type: 'Disaster Management', number: '1-787-724-0124', description: 'Emergency Management Bureau' },
        { type: 'FEMA', number: '1-800-621-3362', description: 'Federal Emergency Management Agency' },
        { type: 'Red Cross', number: '1-787-758-8150', description: 'American Red Cross - Puerto Rico' },
      ]
    },
    'florida': {
      name: 'Florida, USA',
      contacts: [
        { type: 'Emergency Services', number: '911', description: 'Police, Fire, Ambulance' },
        { type: 'Hurricane Hotline', number: '1-800-342-3557', description: 'Florida Division of Emergency Management' },
        { type: 'FEMA', number: '1-800-621-3362', description: 'Federal Emergency Management Agency' },
        { type: 'Red Cross', number: '1-800-RED-CROSS', description: 'American Red Cross' },
        { type: 'Emergency Info', number: '211', description: 'General Emergency Information' },
      ]
    }
  };

  const filteredContacts = selectedRegion
    ? { [selectedRegion]: emergencyContacts[selectedRegion] }
    : emergencyContacts;

  const regions = Object.keys(emergencyContacts).map(key => ({
    value: key,
    label: emergencyContacts[key].name
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <Phone className="mr-3 text-danger" size={32} />
          Emergency Contacts
        </h1>
        <p className="text-gray-600">
          Quick access to emergency services and disaster management contacts by region
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Contacts
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by service type..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border-l-4 border-danger p-4 rounded">
        <p className="text-red-800 font-semibold">
          🚨 In a life-threatening emergency, always call your local emergency number immediately!
        </p>
      </div>

      {/* Contacts by Region */}
      <div className="space-y-6">
        {Object.entries(filteredContacts).map(([regionKey, regionData]) => {
          const filteredRegionContacts = regionData.contacts.filter(contact =>
            searchQuery === '' ||
            contact.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.description.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredRegionContacts.length === 0) return null;

          return (
            <div key={regionKey} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-danger to-orange-500 text-white p-4">
                <h2 className="text-2xl font-bold flex items-center">
                  <MapPin className="mr-2" size={24} />
                  {regionData.name}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {filteredRegionContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{contact.type}</h3>
                        <p className="text-sm text-gray-600 mt-1">{contact.description}</p>
                      </div>
                      <div className="ml-4 flex items-center space-x-3">
                        <a
                          href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`}
                          className="flex items-center space-x-2 px-4 py-2 bg-danger hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                        >
                          <Phone size={18} />
                          <span>{contact.number}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Resources */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Resources</h2>
        <div className="space-y-3">
          <a
            href="https://www.weather.gov/safety/hurricane"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <span className="font-medium text-blue-800">National Hurricane Center - Safety Info</span>
            <ExternalLink className="text-blue-600" size={20} />
          </a>
          <a
            href="https://www.redcross.org/get-help/how-to-prepare-for-emergencies.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <span className="font-medium text-red-800">Red Cross - Emergency Preparedness</span>
            <ExternalLink className="text-red-600" size={20} />
          </a>
          <a
            href="https://www.ready.gov/hurricanes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <span className="font-medium text-green-800">Ready.gov - Hurricane Preparedness</span>
            <ExternalLink className="text-green-600" size={20} />
          </a>
        </div>
      </div>

      {/* Contact Addition Note */}
      <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Contact information is regularly updated. If you notice any outdated information or would like to add contacts for your region, please report it through our emergency report form.
        </p>
      </div>
    </div>
  );
};

export default EmergencyContactsPage;

