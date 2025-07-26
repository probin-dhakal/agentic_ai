import React, { useState } from 'react'
import { Flower, Home, Wheat } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { getTranslation } from '../../utils/translations'

const farmingTypes = [
  {
    id: 'pots',
    titleKey: 'growInPots',
    descriptionKey: 'potsDesc',
    icon: Flower,
    color: '#EC4899',
  },
  {
    id: 'garden',
    titleKey: 'growInGarden',
    descriptionKey: 'gardenDesc',
    icon: Home,
    color: '#8B5CF6',
  },
  {
    id: 'fields',
    titleKey: 'growInFields',
    descriptionKey: 'fieldsDesc',
    icon: Wheat,
    color: '#F59E0B',
  },
]

const FarmingTypeSelection = ({ onNext, onSkip }) => {
  const { state, dispatch } = useApp()
  const [selectedType, setSelectedType] = useState('')

  const handleNext = () => {
    if (selectedType) {
      dispatch({ type: 'SET_FARMING_TYPE', payload: selectedType })
    }
    onNext()
  }

  return (
    <div className="min-h-screen bg-white px-5 py-10">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {getTranslation(state.selectedLanguage, 'chooseFarmingType')}
          </h1>
          <p className="text-gray-600">
            {getTranslation(state.selectedLanguage, 'farmingTypeDesc')}
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {farmingTypes.map((type) => {
            const IconComponent = type.icon
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full flex items-center p-5 rounded-xl border-2 transition-colors ${
                  selectedType === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div 
                  className="w-15 h-15 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <IconComponent size={40} style={{ color: type.color }} />
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${
                      selectedType === type.id ? 'text-primary-700' : 'text-gray-900'
                    }`}>
                      {getTranslation(state.selectedLanguage, type.titleKey)}
                    </h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedType === type.id
                        ? 'border-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedType === type.id && (
                        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getTranslation(state.selectedLanguage, type.descriptionKey)}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={onSkip}
            className="px-6 py-3 text-gray-600 font-medium"
          >
            {getTranslation(state.selectedLanguage, 'skip')}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={!selectedType}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              selectedType
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {getTranslation(state.selectedLanguage, 'next')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FarmingTypeSelection