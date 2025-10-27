import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MapPage from './pages/MapPage';
import EmergencyReportPage from './pages/EmergencyReportPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BluetoothPage from './pages/BluetoothPage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import OnboardingGuide from './components/OnboardingGuide';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen the onboarding guide
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <Router>
      {showOnboarding && <OnboardingGuide onComplete={handleOnboardingComplete} />}
      <Layout>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/report" element={<EmergencyReportPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/bluetooth" element={<BluetoothPage />} />
          <Route path="/contacts" element={<EmergencyContactsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

