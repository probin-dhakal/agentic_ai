import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { getTranslation } from '../utils/translations'

const PlaceholderScreen = ({ title }) => {
  const { state } = useApp()
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-10 py-20">
        <div className="text-center">
          <div className="text-8xl mb-6">🚧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
          <p className="text-gray-600 leading-relaxed">
            This feature is under development and will be available soon.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderScreen