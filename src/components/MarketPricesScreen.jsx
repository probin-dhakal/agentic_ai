import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react'
import { callGeminiAPI } from '../config/gemini'
import { useApp } from '../contexts/AppContext'
import { getTranslation } from '../utils/translations'

const crops = [
  { id: 'tomato', nameKey: 'tomato', emoji: '🍅' },
  { id: 'wheat', nameKey: 'wheat', emoji: '🌾' },
  { id: 'rice', nameKey: 'rice', emoji: '🍚' },
  { id: 'onion', nameKey: 'onion', emoji: '🧅' },
  { id: 'potato', nameKey: 'potato', emoji: '🥔' },
  { id: 'corn', nameKey: 'corn', emoji: '🌽' },
]

const MarketPricesScreen = () => {
  const { state } = useApp()
  const navigate = useNavigate()
  const [selectedCrop, setSelectedCrop] = useState(crops[0])
  const [showDropdown, setShowDropdown] = useState(false)
  const [priceData, setPriceData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [marketInsights, setMarketInsights] = useState('')

  useEffect(() => {
    fetchMarketData()
  }, [selectedCrop])

  const fetchMarketData = async () => {
    try {
      setIsLoading(true)
      
      // Simulate market data
      const mockPriceData = {
        currentPrice: Math.floor(Math.random() * 50) + 20,
        change: (Math.random() - 0.5) * 20,
        unit: 'kg',
        lastUpdated: new Date().toLocaleTimeString(),
      }
      
      setPriceData(mockPriceData)
      
      // Get AI insights
      const prompt = `Provide market analysis and selling recommendations for ${selectedCrop.id} with current price trends.`
      const insights = await callGeminiAPI(prompt)
      setMarketInsights(insights)
    } catch (error) {
      console.error('Failed to fetch market data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {getTranslation(state.selectedLanguage, 'marketPrices')}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Crop Selector */}
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-3">
            {getTranslation(state.selectedLanguage, 'selectCrop')}
          </label>
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">{selectedCrop.emoji}</span>
                <span className="font-medium">{getTranslation(state.selectedLanguage, selectedCrop.nameKey)}</span>
              </div>
              <ChevronDown size={20} className="text-gray-500" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {crops.map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => {
                      setSelectedCrop(crop)
                      setShowDropdown(false)
                    }}
                    className="w-full px-4 py-3 flex items-center hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-xl mr-3">{crop.emoji}</span>
                    <span>{getTranslation(state.selectedLanguage, crop.nameKey)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price Display */}
        {priceData && (
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {getTranslation(state.selectedLanguage, selectedCrop.nameKey)}
              </h2>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                priceData.change >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {priceData.change >= 0 ? 
                  <TrendingUp size={16} className="text-green-600" /> : 
                  <TrendingDown size={16} className="text-red-600" />
                }
                <span className={`text-sm font-semibold ${
                  priceData.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {priceData.change >= 0 ? '+' : ''}{priceData.change.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900 mb-2">
                ₹{priceData.currentPrice}/{priceData.unit}
              </p>
              <p className="text-sm text-gray-600">
                {getTranslation(state.selectedLanguage, 'lastUpdated')}: {priceData.lastUpdated}
              </p>
            </div>
          </div>
        )}

        {/* Market Data Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {getTranslation(state.selectedLanguage, 'marketData')}
          </h2>
          <div className="bg-primary-50 border-l-4 border-primary-500 rounded-lg p-4">
            <p className="text-gray-800">
              {getTranslation(state.selectedLanguage, 'todaysPrice')}: {getTranslation(state.selectedLanguage, selectedCrop.nameKey)} ₹{priceData?.currentPrice || 0}/{priceData?.unit || 'kg'}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching market insights...</p>
          </div>
        )}

        {/* AI Market Insights */}
        {marketInsights && !isLoading && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {getTranslation(state.selectedLanguage, 'aiMarketInsights')}
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">{marketInsights}</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {getTranslation(state.selectedLanguage, 'quickStats')}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-lg font-bold text-gray-900">₹{(priceData?.currentPrice || 0) - 5}</p>
              <p className="text-sm text-gray-600">{getTranslation(state.selectedLanguage, 'yesterday')}</p>
            </div>
            <div className="card text-center">
              <p className="text-lg font-bold text-gray-900">₹{(priceData?.currentPrice || 0) + 3}</p>
              <p className="text-sm text-gray-600">{getTranslation(state.selectedLanguage, 'weekHigh')}</p>
            </div>
            <div className="card text-center">
              <p className="text-lg font-bold text-gray-900">₹{(priceData?.currentPrice || 0) - 8}</p>
              <p className="text-sm text-gray-600">{getTranslation(state.selectedLanguage, 'weekLow')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketPricesScreen