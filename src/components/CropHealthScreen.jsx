import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ArrowLeft, Upload, Mic, Send, MicOff } from 'lucide-react'
import { callGeminiAPI } from '../config/gemini'
import { useApp } from '../contexts/AppContext'
import { getTranslation } from '../utils/translations'

const CropHealthScreen = () => {
  const { state } = useApp()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosis, setDiagnosis] = useState('')
  const [userQuestion, setUserQuestion] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showQuestionInput, setShowQuestionInput] = useState(false)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage({
          uri: e.target.result,
          base64: e.target.result.split(',')[1]
        })
        analyzeCrop(e.target.result.split(',')[1])
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeCrop = async (imageBase64) => {
    try {
      setIsAnalyzing(true)
      setDiagnosis('')
      
      let prompt = "Analyze this crop image for diseases, pests, or health issues. Provide a detailed diagnosis and treatment recommendations."
      if (userQuestion.trim()) {
        prompt += ` The farmer has a specific question: "${userQuestion.trim()}"`
      }
      
      const result = await callGeminiAPI(prompt, imageBase64)
      setDiagnosis(result)
    } catch (error) {
      console.error('Analysis error:', error)
      setDiagnosis('Failed to analyze the image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleVoiceInput = async () => {
    try {
      setIsListening(true)
      // Simulate voice input
      setTimeout(() => {
        const sampleQuestions = [
          'What disease is affecting my tomato leaves?',
          'Why are my plant leaves turning yellow?',
          'Is this pest damage or nutrient deficiency?',
          'How can I treat these brown spots?'
        ]
        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
        setUserQuestion(randomQuestion)
        setIsListening(false)
      }, 2000)
    } catch (error) {
      console.error('Voice input error:', error)
      setIsListening(false)
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
            {getTranslation(state.selectedLanguage, 'identifyCropProblem')}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Image Display Area */}
        <div className="h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
          {selectedImage ? (
            <img src={selectedImage.uri} alt="Crop" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="text-center">
              <Camera size={60} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {getTranslation(state.selectedLanguage, 'noImageSelected')}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <label className="btn-primary w-full flex items-center justify-center space-x-2 cursor-pointer">
            <Camera size={24} />
            <span>{getTranslation(state.selectedLanguage, 'takePhoto')}</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          
          <label className="btn-secondary w-full flex items-center justify-center space-x-2 cursor-pointer">
            <Upload size={24} />
            <span>{getTranslation(state.selectedLanguage, 'chooseFromGallery')}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Question Input Section */}
        {selectedImage && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-5">
            <h3 className="font-bold text-gray-900 mb-2">
              Ask a Specific Question
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Optional: Ask about specific symptoms or concerns
            </p>
            
            {!showQuestionInput ? (
              <button 
                onClick={() => setShowQuestionInput(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Add Question
              </button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Type your question about the plant problem..."
                  className="input-field"
                  rows="3"
                />
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                      isListening 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-primary-50 border-2 border-primary-500 text-primary-500'
                    }`}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <span className="text-sm text-gray-600 flex-1">
                    {isListening ? 'Listening...' : 'Tap to speak your question'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setUserQuestion('')
                      setShowQuestionInput(false)
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm"
                  >
                    Clear
                  </button>
                  
                  {userQuestion.trim() && (
                    <button 
                      onClick={() => analyzeCrop(selectedImage.base64)}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                    >
                      <Send size={16} />
                      <span>Analyze with Question</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analyze Button */}
        {selectedImage && !isAnalyzing && (
          <button 
            onClick={() => analyzeCrop(selectedImage.base64)}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Camera size={20} />
            <span>
              {userQuestion.trim() ? 'Analyze with Question' : 'Analyze Image'}
            </span>
          </button>
        )}

        {/* Analysis Section */}
        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {getTranslation(state.selectedLanguage, 'analyzingCrop')}
            </h3>
            <p className="text-sm text-gray-600">
              {userQuestion.trim() 
                ? 'Analyzing your crop and considering your specific question'
                : 'Our AI is examining the image for diseases and health issues'
              }
            </p>
          </div>
        )}

        {/* Diagnosis Results */}
        {diagnosis && !isAnalyzing && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              {getTranslation(state.selectedLanguage, 'diagnosisAndTreatment')}
            </h3>
            
            {userQuestion.trim() && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-700 mb-1">
                  Based on your question:
                </p>
                <p className="text-sm text-gray-700 italic">"{userQuestion}"</p>
              </div>
            )}
            
            <div className="bg-gray-50 border-l-4 border-primary-500 rounded-lg p-5">
              <p className="text-gray-800 leading-relaxed">{diagnosis}</p>
            </div>
            
            <button 
              onClick={() => {
                setSelectedImage(null)
                setDiagnosis('')
                setUserQuestion('')
                setShowQuestionInput(false)
              }}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              {getTranslation(state.selectedLanguage, 'analyzeAnother')}
            </button>
          </div>
        )}

        {/* Instructions */}
        {!selectedImage && !isAnalyzing && (
          <div className="bg-gray-50 rounded-lg p-5">
            <h3 className="font-bold text-gray-900 mb-4">
              {getTranslation(state.selectedLanguage, 'bestResults')}
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>{getTranslation(state.selectedLanguage, 'instruction1')}</p>
              <p>{getTranslation(state.selectedLanguage, 'instruction2')}</p>
              <p>{getTranslation(state.selectedLanguage, 'instruction3')}</p>
              <p>{getTranslation(state.selectedLanguage, 'instruction4')}</p>
              <p>{getTranslation(state.selectedLanguage, 'instruction5')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CropHealthScreen