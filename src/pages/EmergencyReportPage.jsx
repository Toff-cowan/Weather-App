import React, { useState } from 'react';
import { AlertTriangle, MapPin, Upload, CheckCircle } from 'lucide-react';

const EmergencyReportPage = () => {
  const [formData, setFormData] = useState({
    emergencyType: '',
    severity: '',
    location: '',
    latitude: '',
    longitude: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    peopleAffected: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
        },
        (error) => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API endpoint to submit emergency report
      // This should send data to your backend, which then forwards to authorities
      // Example:
      // const formDataToSend = new FormData();
      // Object.keys(formData).forEach(key => {
      //   if (key === 'images') {
      //     formData.images.forEach(image => formDataToSend.append('images', image));
      //   } else {
      //     formDataToSend.append(key, formData[key]);
      //   }
      // });
      // await axios.post('YOUR_API_ENDPOINT/emergency-report', formDataToSend);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          emergencyType: '',
          severity: '',
          location: '',
          latitude: '',
          longitude: '',
          description: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          peopleAffected: '',
          images: []
        });
      }, 3000);
    } catch (error) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="mx-auto text-success mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted Successfully!</h2>
          <p className="text-gray-600">
            Your emergency report has been received and will be forwarded to the appropriate authorities.
            Emergency services will contact you if additional information is needed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <AlertTriangle className="mr-3 text-danger" size={32} />
          Report Emergency
        </h1>
        <p className="text-gray-600">
          Submit detailed information about emergencies in your area. Your report helps authorities respond effectively.
        </p>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border-l-4 border-danger p-4 mb-6 rounded">
        <p className="text-sm text-red-800">
          <strong>Life-threatening emergency?</strong> Call 911 immediately. This form is for reporting non-life-threatening situations or providing additional information to authorities.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Emergency Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Emergency Type *
          </label>
          <select
            name="emergencyType"
            value={formData.emergencyType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select emergency type</option>
            <option value="hurricane">Hurricane/Storm</option>
            <option value="flood">Flooding</option>
            <option value="fire">Fire</option>
            <option value="powerOutage">Power Outage</option>
            <option value="structuralDamage">Structural Damage</option>
            <option value="roadClosed">Road Closure/Blockage</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Severity Level *
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select severity</option>
            <option value="critical">Critical - Immediate danger</option>
            <option value="high">High - Urgent response needed</option>
            <option value="moderate">Moderate - Response needed soon</option>
            <option value="low">Low - Monitoring required</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location Description *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g., 123 Main Street, Downtown area, near City Hall"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* GPS Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="e.g., 18.4655"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="e.g., -77.9215"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center space-x-2 text-primary hover:text-blue-600 font-semibold"
        >
          <MapPin size={20} />
          <span>Use My Current Location</span>
        </button>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Detailed Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Provide detailed information about the emergency situation..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* People Affected */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Approximate Number of People Affected
          </label>
          <input
            type="number"
            name="peopleAffected"
            value={formData.peopleAffected}
            onChange={handleChange}
            placeholder="e.g., 10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Contact Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Contact Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Photos (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer text-primary hover:text-blue-600 font-semibold">
              Click to upload images
            </label>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
            {formData.images.length > 0 && (
              <p className="text-sm text-success mt-2">{formData.images.length} file(s) selected</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-danger hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Submitting Report...
            </>
          ) : (
            'Submit Emergency Report'
          )}
        </button>
      </form>
    </div>
  );
};

export default EmergencyReportPage;

