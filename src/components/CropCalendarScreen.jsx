import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Droplets, Sun, Thermometer, AlertTriangle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { getTranslation } from '../utils/translations'

const CropCalendarScreen = () => {
  const { state } = useApp()
  const navigate = useNavigate()
  const [selectedCrop] = useState('tomato')
  const [currentWeek, setCurrentWeek] = useState(1)
  const [weatherData] = useState({
    temperature: 28,
    humidity: 65,
    rainfall: 12,
    condition: 'Partly Cloudy'
  })

  const cropCalendarData = {
    tomato: {
      totalWeeks: 16,
      phases: [
        { phase: 'Seed Preparation', weeks: [1, 2], color: '#8B5CF6' },
        { phase: 'Sowing', weeks: [3, 4], color: '#22C55E' },
        { phase: 'Germination', weeks: [5, 6], color: '#3B82F6' },
        { phase: 'Vegetative Growth', weeks: [7, 8, 9, 10], color: '#F59E0B' },
        { phase: 'Flowering', weeks: [11, 12], color: '#EC4899' },
        { phase: 'Fruit Development', weeks: [13, 14], color: '#EF4444' },
        { phase: 'Harvest', weeks: [15, 16], color: '#10B981' }
      ],
      weeklyTasks: {
        1: ['Prepare seedbed', 'Select quality seeds', 'Check soil pH'],
        2: ['Treat seeds with fungicide', 'Prepare nursery area'],
        3: ['Sow seeds in nursery', 'Water gently', 'Provide shade'],
        4: ['Monitor germination', 'Remove weak seedlings'],
        5: ['Transplant seedlings', 'Apply base fertilizer'],
        6: ['Water regularly', 'Check for pests'],
        7: ['Apply first dose of fertilizer', 'Stake plants'],
        8: ['Prune suckers', 'Monitor for diseases'],
        9: ['Apply second fertilizer dose', 'Check irrigation'],
        10: ['Monitor growth', 'Apply pesticide if needed'],
        11: ['Support flowering', 'Reduce nitrogen'],
        12: ['Hand pollination if needed', 'Monitor fruit set'],
        13: ['Support heavy branches', 'Regular watering'],
        14: ['Monitor fruit development', 'Check for fruit flies'],
        15: ['Harvest ripe fruits', 'Check market prices'],
        16: ['Complete harvest', 'Prepare for next crop']
      }
    }
  }

  const getCurrentPhase = () => {
    const data = cropCalendarData[selectedCrop]
    if (!data) return null
    
    return data.phases.find(phase => 
      phase.weeks.includes(currentWeek)
    )
  }

  const getWeeklyTasks = () => {
    const data = cropCalendarData[selectedCrop]
    return data?.weeklyTasks[currentWeek] || []
  }

  const getWeatherRecommendation = () => {
    const currentPhase = getCurrentPhase()
    if (!currentPhase) return ''

    if (weatherData.rainfall > 20 && currentPhase.phase === 'Flowering') {
      return 'High rainfall may affect pollination. Consider protective measures.'
    }
    if (weatherData.temperature > 35 && currentPhase.phase === 'Fruit Development') {
      return 'High temperature may cause fruit cracking. Increase irrigation.'
    }
    return 'Weather conditions are favorable for current growth phase.'
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
            {getTranslation(state.selectedLanguage, 'cropCalendar')}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Crop Selection */}
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-3">
            Selected Crop
          </label>
          <div className="bg-primary-50 border-l-4 border-primary-500 rounded-lg p-4 flex items-center">
            <span className="text-2xl mr-3">🍅</span>
            <span className="text-lg font-semibold text-primary-800">
              {getTranslation(state.selectedLanguage, selectedCrop)}
            </span>
          </div>
        </div>

        {/* Current Phase */}
        {getCurrentPhase() && (
          <div className="card">
            <div className="flex items-center mb-3">
              <div 
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: getCurrentPhase().color }}
              ></div>
              <h2 className="text-lg font-bold text-gray-900">{getCurrentPhase().phase}</h2>
            </div>
            <p className="text-gray-600">Week {currentWeek} of {cropCalendarData[selectedCrop].totalWeeks}</p>
          </div>
        )}

        {/* Weather Card */}
        <div className="bg-blue-50 rounded-lg p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Current Weather</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <Thermometer size={20} className="text-red-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{weatherData.temperature}°C</p>
              <p className="text-xs text-gray-600">Temperature</p>
            </div>
            <div className="text-center">
              <Droplets size={20} className="text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{weatherData.humidity}%</p>
              <p className="text-xs text-gray-600">Humidity</p>
            </div>
            <div className="text-center">
              <Sun size={20} className="text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{weatherData.rainfall}mm</p>
              <p className="text-xs text-gray-600">Rainfall</p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start">
            <AlertTriangle size={16} className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">{getWeatherRecommendation()}</p>
          </div>
        </div>

        {/* Weekly Tasks */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">This Week's Tasks</h2>
          <div className="space-y-3">
            {getWeeklyTasks().map((task, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-800">{task}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Navigation */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Crop Timeline</h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {Array.from({ length: cropCalendarData[selectedCrop]?.totalWeeks || 16 }, (_, i) => i + 1).map((week) => (
              <button
                key={week}
                onClick={() => setCurrentWeek(week)}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  week === currentWeek 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {week}
              </button>
            ))}
          </div>
        </div>

        {/* Phase Legend */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Growth Phases</h2>
          <div className="space-y-3">
            {cropCalendarData[selectedCrop]?.phases.map((phase, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: phase.color }}
                  ></div>
                  <span className="text-gray-800">{phase.phase}</span>
                </div>
                <span className="text-sm text-gray-600">Weeks {phase.weeks.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropCalendarScreen