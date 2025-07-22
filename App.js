import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { AppProvider, useApp } from './src/contexts/AppContext';
import SplashScreen from './src/components/SplashScreen';
import OnboardingFlow from './src/components/onboarding/OnboardingFlow';
import HomeScreen from './src/components/home/HomeScreen';
import VoiceInputScreen from './src/components/VoiceInputScreen';
import CropHealthScreen from './src/components/CropHealthScreen';
import MarketPricesScreen from './src/components/MarketPricesScreen';
import CropCalendarScreen from './src/components/CropCalendarScreen';
import GovernmentSchemesScreen from './src/components/GovernmentSchemesScreen';
import PlaceholderScreen from './src/components/PlaceholderScreen';
import BottomNavigation from './src/components/BottomNavigation';
import OfflineManager from './src/components/OfflineManager';

const AppContent = () => {
  const { state } = useApp();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('home');

  const handleNavigation = (screen) => {
    setCurrentScreen(screen);
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'home') {
      setCurrentScreen('home');
    } else if (tabId === 'market') {
      setCurrentScreen('market');
    } else {
      setCurrentScreen('placeholder');
    }
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setActiveTab('home');
  };

  // Show splash screen while loading
  if (state.loading) {
    return <SplashScreen />;
  }

  // Show onboarding if not completed
  if (state.currentScreen === 'onboarding' || !state.onboardingCompleted) {
    return <OnboardingFlow />;
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigation} />;
      case 'voiceInput':
        return <VoiceInputScreen onBack={handleBack} />;
      case 'cropHealth':
        return <CropHealthScreen onBack={handleBack} />;
      case 'market':
        return <MarketPricesScreen onBack={handleBack} />;
      case 'cropCalendar':
        return <CropCalendarScreen onBack={handleBack} />;
      case 'governmentSchemes':
        return <GovernmentSchemesScreen onBack={handleBack} />;
      case 'placeholder':
        return (
          <PlaceholderScreen 
            title={
              activeTab === 'community' ? 'Community' :
              activeTab === 'profile' ? 'Profile' : 'Feature'
            }
            onBack={handleBack} 
          />
        );
      default:
        return <HomeScreen onNavigate={handleNavigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <OfflineManager />
      {renderScreen()}
      {(currentScreen === 'home' || currentScreen === 'market' || currentScreen === 'placeholder') && (
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      )}
    </View>
  );
};

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});