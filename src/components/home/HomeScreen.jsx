import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Leaf, 
  Plus, 
  Camera, 
  Mic, 
  TrendingUp,
  Calendar,
  Building2,
  MessageCircle,
  MoreHorizontal,
  Cloud
} from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { getTranslation } from '../../utils/translations'

const HomeScreen = () => {
  const { state } = useApp()
  const navigate = useNavigate()

  const selectedCrops = state.selectedCrops.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Leaf size={24} className="text-primary-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">
              {getTranslation(state.selectedLanguage, 'plantix')}
            </h1>
          </div>
          <button className="p-2">
            <MoreHorizontal size={24} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* User ID Display */}
        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-sm text-gray-600 text-center">
            {getTranslation(state.selectedLanguage, 'userId')}: {state.user?.uid?.substring(0, 8) || 'Anonymous'}
          </p>
        </div>

        {/* Crops Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {getTranslation(state.selectedLanguage, 'yourCrops')}
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {selectedCrops.map((cropId, index) => (
              <div key={cropId} className="flex-shrink-0 text-center">
                <div className="w-15 h-15 bg-primary-50 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🌱</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">{cropId}</p>
              </div>
            ))}
            <button className="flex-shrink-0 w-15 h-15 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-primary-500">
              <Plus size={24} className="text-primary-500" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {getTranslation(state.selectedLanguage, 'quickActions')}
          </h2>
          <div className="space-y-4">
            {/* Primary Action */}
            <button 
              onClick={() => navigate('/crop-health')}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white rounded-xl p-6 flex items-center justify-center space-x-3 transition-colors"
            >
              <Camera size={32} />
              <span className="text-lg font-semibold">
                {getTranslation(state.selectedLanguage, 'diagnosePlant')}
              </span>
            </button>
            
            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/voice')}
                className="card hover:shadow-md transition-shadow flex flex-col items-center space-y-3 py-6"
              >
                <Mic size={28} className="text-primary-500" />
                <span className="font-medium text-gray-900">
                  {getTranslation(state.selectedLanguage, 'askQuestion')}
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/market')}
                className="card hover:shadow-md transition-shadow flex flex-col items-center space-y-3 py-6"
              >
                <TrendingUp size={28} className="text-blue-500" />
                <span className="font-medium text-gray-900">
                  {getTranslation(state.selectedLanguage, 'marketPrices')}
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/schemes')}
                className="card hover:shadow-md transition-shadow flex flex-col items-center space-y-3 py-6"
              >
                <Building2 size={28} className="text-purple-500" />
                <span className="font-medium text-gray-900">
                  {getTranslation(state.selectedLanguage, 'govSchemes')}
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/calendar')}
                className="card hover:shadow-md transition-shadow flex flex-col items-center space-y-3 py-6"
              >
                <Calendar size={28} className="text-amber-500" />
                <span className="font-medium text-gray-900">
                  {getTranslation(state.selectedLanguage, 'cropCalendar')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Weather Card */}
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-semibold text-gray-900">Dimow, 20 Jul</p>
              <p className="text-sm text-gray-600">Foggy</p>
            </div>
            <Cloud size={48} className="text-gray-400" />
          </div>
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">34°C</p>
              <p className="text-sm text-gray-600">25°C / 33°C</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800 text-center">
              {getTranslation(state.selectedLanguage, 'sprayingUnfavorable')}
            </p>
          </div>
        </div>

        {/* Crop Health Status */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {getTranslation(state.selectedLanguage, 'cropHealthStatus')}
          </h2>
          <div className="bg-primary-50 border-l-4 border-primary-500 rounded-lg p-5">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
              <p className="font-semibold text-primary-800">
                {getTranslation(state.selectedLanguage, 'overallHealthy')}
              </p>
            </div>
            <p className="text-sm text-primary-700 mb-4">
              {getTranslation(state.selectedLanguage, 'lastCheckDesc')}
            </p>
            <button 
              onClick={() => navigate('/crop-health')}
              className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors flex items-center space-x-2"
            >
              <Camera size={16} />
              <span>{getTranslation(state.selectedLanguage, 'checkNow')}</span>
            </button>
          </div>
        </div>

        {/* Manage Fields */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {getTranslation(state.selectedLanguage, 'manageFields')}
          </h2>
          <div className="card text-center">
            <h3 className="font-bold text-gray-900 mb-2">
              {getTranslation(state.selectedLanguage, 'startPrecisionFarming')}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {getTranslation(state.selectedLanguage, 'precisionFarmingDesc')}
            </p>
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl">🚜</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/voice')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  )
}

export default HomeScreen