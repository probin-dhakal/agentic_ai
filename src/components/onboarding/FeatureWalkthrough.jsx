import React from 'react'
import { Stethoscope, Package, Users } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { getTranslation } from '../../utils/translations'

const features = [
  {
    id: 1,
    titleKey: 'instantDiseaseDetection',
    descriptionKey: 'diseaseDetectionDesc',
    icon: Stethoscope,
    color: '#EF4444',
  },
  {
    id: 2,
    titleKey: 'greatProductDeals',
    descriptionKey: 'productDealsDesc',
    icon: Package,
    color: '#F59E0B',
  },
  {
    id: 3,
    titleKey: 'supportiveCommunity',
    descriptionKey: 'communityDesc',
    icon: Users,
    color: '#8B5CF6',
  },
]

const FeatureWalkthrough = ({ currentStep, onNext, onSkip }) => {
  const { state } = useApp()
  const feature = features[currentStep - 2] // Adjust for 0-based indexing (steps 2-4)
  const IconComponent = feature.icon

  return (
    <div className="min-h-screen bg-white px-5 py-10 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div 
          className="w-40 h-40 rounded-full flex items-center justify-center mb-10"
          style={{ backgroundColor: `${feature.color}20` }}
        >
          <IconComponent size={80} style={{ color: feature.color }} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {getTranslation(state.selectedLanguage, feature.titleKey)}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed px-5 mb-10">
          {getTranslation(state.selectedLanguage, feature.descriptionKey)}
        </p>
        
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep - 2 
                  ? 'w-6 bg-primary-500' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-5">
        <button 
          onClick={onSkip}
          className="px-6 py-3 text-gray-600 font-medium"
        >
          {getTranslation(state.selectedLanguage, 'skip')}
        </button>
        
        <button 
          onClick={onNext}
          className="btn-primary px-8 py-3"
        >
          {getTranslation(state.selectedLanguage, 'next')}
        </button>
      </div>
    </div>
  )
}

export default FeatureWalkthrough