import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import Layout from './components/Layout'
import SplashScreen from './components/SplashScreen'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import HomeScreen from './components/home/HomeScreen'
import VoiceInputScreen from './components/VoiceInputScreen'
import CropHealthScreen from './components/CropHealthScreen'
import MarketPricesScreen from './components/MarketPricesScreen'
import CropCalendarScreen from './components/CropCalendarScreen'
import GovernmentSchemesScreen from './components/GovernmentSchemesScreen'
import PlaceholderScreen from './components/PlaceholderScreen'

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomeScreen />} />
              <Route path="voice" element={<VoiceInputScreen />} />
              <Route path="crop-health" element={<CropHealthScreen />} />
              <Route path="market" element={<MarketPricesScreen />} />
              <Route path="calendar" element={<CropCalendarScreen />} />
              <Route path="schemes" element={<GovernmentSchemesScreen />} />
              <Route path="community" element={<PlaceholderScreen title="Community" />} />
              <Route path="profile" element={<PlaceholderScreen title="Profile" />} />
            </Route>
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/splash" element={<SplashScreen />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App