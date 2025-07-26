import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import SplashScreen from './SplashScreen'
import OnboardingFlow from './onboarding/OnboardingFlow'
import BottomNavigation from './BottomNavigation'

const Layout = () => {
  const { state } = useApp()
  const location = useLocation()

  // Show splash screen while loading
  if (state.loading) {
    return <SplashScreen />
  }

  // Show onboarding if not completed
  if (!state.onboardingCompleted) {
    return <OnboardingFlow />
  }

  // Hide bottom navigation on certain routes
  const hideBottomNav = ['/voice', '/crop-health', '/calendar', '/schemes'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      {!hideBottomNav && <BottomNavigation />}
    </div>
  )
}

export default Layout