import React from 'react'
import { Leaf } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { getTranslation } from '../utils/translations'

const SplashScreen = () => {
  const { state } = useApp()
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
      <div className="text-center mb-12">
        <Leaf size={80} className="text-primary-500 mx-auto mb-5" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {getTranslation(state.selectedLanguage, 'appTitle')}
        </h1>
        <p className="text-lg text-gray-600">
          {getTranslation(state.selectedLanguage, 'appSubtitle')}
        </p>
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  )
}

export default SplashScreen