import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Building2, CheckCircle, Clock, FileText, ExternalLink } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { getTranslation } from '../utils/translations'

const GovernmentSchemesScreen = () => {
  const { state } = useApp()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [schemes, setSchemes] = useState([])

  const categories = [
    { id: 'all', labelKey: 'allSchemes', icon: Building2 },
    { id: 'subsidy', labelKey: 'subsidies', icon: CheckCircle },
    { id: 'insurance', labelKey: 'insurance', icon: FileText },
    { id: 'loan', labelKey: 'loans', icon: Clock },
  ]

  const mockSchemes = [
    {
      id: 1,
      name: 'PM-KISAN Samman Nidhi',
      category: 'subsidy',
      amount: '₹6,000/year',
      eligibility: 'Small & marginal farmers',
      status: 'eligible',
      description: 'Direct income support to farmer families',
      documents: ['Aadhaar Card', 'Bank Account', 'Land Records'],
      deadline: 'March 31, 2024'
    },
    {
      id: 2,
      name: 'Pradhan Mantri Fasal Bima Yojana',
      category: 'insurance',
      amount: 'Up to ₹2 lakh coverage',
      eligibility: 'All farmers',
      status: 'applied',
      description: 'Crop insurance against natural calamities',
      documents: ['Aadhaar Card', 'Bank Account', 'Land Records', 'Sowing Certificate'],
      deadline: 'Within 7 days of sowing'
    },
    {
      id: 3,
      name: 'Kisan Credit Card',
      category: 'loan',
      amount: 'Up to ₹3 lakh',
      eligibility: 'Farmers with land records',
      status: 'not_applied',
      description: 'Credit facility for agricultural needs',
      documents: ['Aadhaar Card', 'PAN Card', 'Land Records', 'Income Certificate'],
      deadline: 'No deadline'
    },
    {
      id: 4,
      name: 'Soil Health Card Scheme',
      category: 'subsidy',
      amount: 'Free soil testing',
      eligibility: 'All farmers',
      status: 'eligible',
      description: 'Free soil testing and nutrient recommendations',
      documents: ['Aadhaar Card', 'Land Records'],
      deadline: 'Ongoing'
    }
  ]

  useEffect(() => {
    setSchemes(mockSchemes)
  }, [])

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'eligible': return 'text-green-600 bg-green-100'
      case 'applied': return 'text-amber-600 bg-amber-100'
      case 'approved': return 'text-blue-600 bg-blue-100'
      case 'not_applied': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'eligible': return 'Eligible'
      case 'applied': return 'Applied'
      case 'approved': return 'Approved'
      case 'not_applied': return 'Not Applied'
      default: return status
    }
  }

  const handleApplyScheme = (scheme) => {
    alert(`Application guide for ${scheme.name}:\n\nDocuments required: ${scheme.documents.join(', ')}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Government Schemes</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <IconComponent size={16} />
                <span className="text-sm font-medium">
                  {category.id === 'all' ? 'All' : 
                   category.id === 'subsidy' ? 'Subsidies' :
                   category.id === 'insurance' ? 'Insurance' : 'Loans'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Schemes List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Available Schemes ({filteredSchemes.length})
          </h2>
          
          <div className="space-y-4">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{scheme.name}</h3>
                    <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium inline-block">
                      {scheme.amount}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(scheme.status)}`}>
                    {getStatusText(scheme.status)}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-4">{scheme.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-600 w-20">Eligibility:</span>
                    <span className="text-sm text-gray-700 flex-1">{scheme.eligibility}</span>
                  </div>
                  <div className="flex">
                    <span className="text-sm font-semibold text-gray-600 w-20">Deadline:</span>
                    <span className="text-sm text-gray-700 flex-1">{scheme.deadline}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {scheme.status === 'eligible' || scheme.status === 'not_applied' ? (
                    <button 
                      onClick={() => handleApplyScheme(scheme)}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <FileText size={16} />
                      <span>Apply Now</span>
                    </button>
                  ) : (
                    <button className="flex-1 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2">
                      <Clock size={16} />
                      <span>Track Application</span>
                    </button>
                  )}
                  
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                    <ExternalLink size={16} />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-primary-50 border-l-4 border-primary-500 rounded-lg p-5">
          <h3 className="font-bold text-primary-800 mb-2">Need Help?</h3>
          <p className="text-primary-700 text-sm mb-4">
            Contact our support team for assistance with government schemes and applications.
          </p>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default GovernmentSchemesScreen