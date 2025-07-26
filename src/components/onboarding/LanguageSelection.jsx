import React, { useState } from 'react'
import { Leaf } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { getTranslation } from '../../utils/translations'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'bn', name: 'বাংলা (Bangla)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
]

const LanguageSelection = ({ onNext }) => {
  const { state, dispatch } = useApp()
  const [selectedLanguage, setSelectedLanguage] = useState(state.selectedLanguage)

  const handleAccept = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: selectedLanguage })
    onNext()
  }

  return (
    <div className="min-h-screen bg-white px-5 py-10">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <Leaf size={60} className="text-primary-500 mx-auto mb-5" />
          <h1 className="text-2xl font-bold text-gray-900">
            {getTranslation(selectedLanguage, 'selectLanguage')}
          </h1>
        </div>

        <div className="space-y-3 mb-10">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => setSelectedLanguage(language.name)}
              className={`w-full flex items-center p-4 rounded-lg border-2 transition-colors ${
                selectedLanguage === language.name
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                selectedLanguage === language.name
                  ? 'border-primary-500'
                  : 'border-gray-300'
              }`}>
                {selectedLanguage === language.name && (
                  <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
                )}
              </div>
              <span className={`text-base ${
                selectedLanguage === language.name
                  ? 'text-primary-700 font-semibold'
                  : 'text-gray-700'
              }`}>
                {language.name}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-600 leading-relaxed">
            {getTranslation(selectedLanguage, 'termsText')}{' '}
            <span className="text-primary-600 underline">{getTranslation(selectedLanguage, 'termsOfUse')}</span> {getTranslation(selectedLanguage, 'and')}{' '}
            <span className="text-primary-600 underline">{getTranslation(selectedLanguage, 'privacyPolicy')}</span>
          </p>
        </div>
        
        <button 
          onClick={handleAccept}
          className="w-full btn-primary py-4 text-lg font-bold"
        >
          {getTranslation(selectedLanguage, 'accept')}
        </button>
      </div>
    </div>
  )
}

export default LanguageSelection