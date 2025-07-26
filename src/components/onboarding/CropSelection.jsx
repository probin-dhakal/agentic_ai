import React, { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { getTranslation } from '../../utils/translations'

const crops = [
  { id: 'almond', nameKey: 'almond', emoji: '🌰' },
  { id: 'apple', nameKey: 'apple', emoji: '🍎' },
  { id: 'apricot', nameKey: 'apricot', emoji: '🍑' },
  { id: 'banana', nameKey: 'banana', emoji: '🍌' },
  { id: 'barley', nameKey: 'barley', emoji: '🌾' },
  { id: 'bean', nameKey: 'bean', emoji: '🫘' },
  { id: 'brinjal', nameKey: 'brinjal', emoji: '🍆' },
  { id: 'cabbage', nameKey: 'cabbage', emoji: '🥬' },
  { id: 'chilli', nameKey: 'chilli', emoji: '🌶️' },
  { id: 'corn', nameKey: 'corn', emoji: '🌽' },
  { id: 'cotton', nameKey: 'cotton', emoji: '☁️' },
  { id: 'cucumber', nameKey: 'cucumber', emoji: '🥒' },
  { id: 'garlic', nameKey: 'garlic', emoji: '🧄' },
  { id: 'ginger', nameKey: 'ginger', emoji: '🫚' },
  { id: 'grape', nameKey: 'grape', emoji: '🍇' },
  { id: 'mango', nameKey: 'mango', emoji: '🥭' },
  { id: 'onion', nameKey: 'onion', emoji: '🧅' },
  { id: 'potato', nameKey: 'potato', emoji: '🥔' },
  { id: 'rice', nameKey: 'rice', emoji: '🍚' },
  { id: 'sugarcane', nameKey: 'sugarcane', emoji: '🎋' },
  { id: 'tomato', nameKey: 'tomato', emoji: '🍅' },
  { id: 'wheat', nameKey: 'wheat', emoji: '🌾' },
]

const CropSelection = ({ onNext }) => {
  const { state, dispatch } = useApp()
  const [selectedCrops, setSelectedCrops] = useState([])
  const maxCrops = 8

  const toggleCrop = (cropId) => {
    setSelectedCrops(prev => {
      if (prev.includes(cropId)) {
        return prev.filter(id => id !== cropId)
      } else if (prev.length < maxCrops) {
        return [...prev, cropId]
      }
      return prev
    })
  }

  const handleNext = () => {
    dispatch({ type: 'SET_CROPS', payload: selectedCrops })
    onNext()
  }

  return (
    <div className="min-h-screen bg-white px-5 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {getTranslation(state.selectedLanguage, 'selectCrops')}
          </h1>
          <p className="text-gray-600 mb-4">
            {getTranslation(state.selectedLanguage, 'selectCropsDesc')}
          </p>
          <div className="text-xl font-semibold text-primary-500">
            {selectedCrops.length}/{maxCrops}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8">
          {crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => toggleCrop(crop.id)}
              className={`aspect-square flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors relative ${
                selectedCrops.includes(crop.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="text-3xl mb-2">{crop.emoji}</span>
              <span className={`text-xs font-medium text-center ${
                selectedCrops.includes(crop.id) ? 'text-primary-700' : 'text-gray-700'
              }`}>
                {getTranslation(state.selectedLanguage, crop.nameKey)}
              </span>
              {selectedCrops.includes(crop.id) && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={handleNext}
            disabled={selectedCrops.length === 0}
            className={`px-12 py-4 rounded-lg font-semibold text-lg transition-colors ${
              selectedCrops.length > 0
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default CropSelection