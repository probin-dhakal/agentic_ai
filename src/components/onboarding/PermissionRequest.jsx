import React from 'react'
import { Bell, MapPin } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { getTranslation } from '../../utils/translations'

const permissions = {
  notifications: {
    titleKey: 'allowNotifications',
    descriptionKey: 'notificationDesc',
    icon: Bell,
    color: '#3B82F6',
  },
  location: {
    titleKey: 'allowLocation',
    descriptionKey: 'locationDesc',
    icon: MapPin,
    color: '#10B981',
  },
}

const PermissionRequest = ({ type, onNext, onSkip }) => {
  const { state } = useApp()
  const permission = permissions[type]
  const IconComponent = permission.icon

  const handleAllow = async () => {
    try {
      if (type === 'notifications') {
        // Request notification permission
        if ('Notification' in window) {
          await Notification.requestPermission()
        }
      } else if (type === 'location') {
        // Request location permission
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(() => {}, () => {})
        }
      }
      onNext()
    } catch (error) {
      console.error('Permission request error:', error)
      onNext() // Continue anyway
    }
  }

  return (
    <div className="min-h-screen bg-white px-5 py-10 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div 
          className="w-40 h-40 rounded-full flex items-center justify-center mb-10"
          style={{ backgroundColor: `${permission.color}20` }}
        >
          <IconComponent size={80} style={{ color: permission.color }} />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {getTranslation(state.selectedLanguage, permission.titleKey)}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed px-5">
          {getTranslation(state.selectedLanguage, permission.descriptionKey)}
        </p>
      </div>

      <div className="flex justify-between items-center pt-5">
        <button 
          onClick={onSkip}
          className="px-6 py-3 text-gray-600 font-medium"
        >
          {getTranslation(state.selectedLanguage, 'skip')}
        </button>
        
        <button 
          onClick={handleAllow}
          className="btn-primary px-8 py-3"
        >
          {getTranslation(state.selectedLanguage, 'allow')}
        </button>
      </div>
    </div>
  )
}

export default PermissionRequest