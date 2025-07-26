import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Leaf, Users, ShoppingBag, User } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { getTranslation } from '../utils/translations'

const BottomNavigation = () => {
  const { state } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  
  const tabs = [
    { id: 'home', path: '/', labelKey: 'yourCrops', icon: Leaf },
    { id: 'community', path: '/community', labelKey: 'community', icon: Users },
    { id: 'market', path: '/market', labelKey: 'market', icon: ShoppingBag },
    { id: 'profile', path: '/profile', labelKey: 'you', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 pb-6">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = location.pathname === tab.path
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center py-2 px-3 min-w-0 flex-1"
            >
              <IconComponent 
                size={24} 
                className={`mb-1 ${isActive ? 'text-primary-500' : 'text-gray-400'}`}
              />
              <span className={`text-xs ${isActive ? 'text-primary-500 font-semibold' : 'text-gray-400'}`}>
                {getTranslation(state.selectedLanguage, tab.labelKey)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation