import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Send, ArrowLeft, Globe, MicOff, Copy, Volume2 } from 'lucide-react'
import { callGeminiAPI } from '../config/gemini'
import { useApp } from '../contexts/AppContext'
import { getTranslation } from '../utils/translations'

const VoiceInputScreen = () => {
  const { state } = useApp()
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: getTranslation(state.selectedLanguage, 'welcomeMessage'),
      timestamp: new Date()
    }
  ])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleVoiceInput = async () => {
    try {
      setIsListening(true)
      // Simulate voice input
      setTimeout(() => {
        const sampleQuestions = [
          'What is the best time to sow wheat?',
          'How to treat tomato leaf curl disease?',
          'What are the current market prices for rice?',
          'Which government schemes are available for farmers?'
        ]
        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
        setInputText(randomQuestion)
        setIsListening(false)
      }, 2000)
    } catch (error) {
      console.error('Voice input error:', error)
      setIsListening(false)
    }
  }

  const handleSubmit = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputText.trim()
    setInputText('')
    setIsLoading(true)

    try {
      const typingMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '',
        isTyping: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, typingMessage])

      const aiResponse = await callGeminiAPI(currentInput)

      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping)
        return [...filtered, {
          id: Date.now() + 2,
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        }]
      })

      // Text-to-speech simulation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse)
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping)
        return [...filtered, {
          id: Date.now() + 2,
          type: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
          isError: true
        }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInputText(question)
  }

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  const handleSpeakMessage = (content) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const renderMessage = (message) => {
    const isUser = message.type === 'user'
    const isTyping = message.isTyping
    const isError = message.isError

    return (
      <div key={message.id} className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-sm">🤖</span>
          </div>
        )}
        
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-primary-500 text-white rounded-br-sm' 
            : `bg-white border border-gray-200 text-gray-900 rounded-bl-sm ${isError ? 'bg-red-50 border-red-200' : ''}`
        }`}>
          {isTyping ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              <span className="text-sm text-gray-600 italic">
                {getTranslation(state.selectedLanguage, 'aiTyping')}
              </span>
            </div>
          ) : (
            <>
              <p className={`text-sm ${isError ? 'text-red-600' : ''}`}>
                {message.content}
              </p>
              
              {!isUser && !isError && (
                <div className="flex space-x-2 mt-2">
                  <button 
                    onClick={() => handleCopyMessage(message.content)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy size={14} className="text-gray-500" />
                  </button>
                  <button 
                    onClick={() => handleSpeakMessage(message.content)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Volume2 size={14} className="text-gray-500" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        
        {isUser && (
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <span className="text-sm">👨‍🌾</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">
              {getTranslation(state.selectedLanguage, 'aiAssistant')}
            </h1>
            <p className="text-xs text-primary-500">
              {getTranslation(state.selectedLanguage, 'onlineStatus')}
            </p>
          </div>
          <button className="p-2 bg-primary-50 rounded-full">
            <Globe size={20} className="text-primary-500" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 bg-gray-50">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="bg-white border-t border-gray-200 px-5 py-4">
          <p className="text-sm font-semibold text-gray-600 mb-3">
            {getTranslation(state.selectedLanguage, 'quickQuestions')}
          </p>
          <div className="flex space-x-2 overflow-x-auto">
            <button 
              onClick={() => handleQuickQuestion('What diseases affect tomato plants?')}
              className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm transition-colors"
            >
              {getTranslation(state.selectedLanguage, 'tomatoDiseases')}
            </button>
            <button 
              onClick={() => handleQuickQuestion('Current market price of wheat')}
              className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm transition-colors"
            >
              {getTranslation(state.selectedLanguage, 'wheatPrices')}
            </button>
            <button 
              onClick={() => handleQuickQuestion('Government schemes for farmers')}
              className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm transition-colors"
            >
              {getTranslation(state.selectedLanguage, 'governmentSchemes')}
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-5 py-4">
        <div className="flex items-end space-x-3">
          <button 
            onClick={handleVoiceInput}
            disabled={isLoading}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isListening 
                ? 'bg-primary-500 text-white' 
                : 'bg-primary-50 border-2 border-primary-500 text-primary-500'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={getTranslation(state.selectedLanguage, 'typeMessage')}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '100px' }}
              disabled={isLoading}
            />
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={!inputText.trim() || isLoading}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              !inputText.trim() 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        
        {isListening && (
          <div className="flex items-center justify-center mt-3 py-2 bg-primary-50 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
            <span className="text-sm text-primary-600 font-medium">
              {getTranslation(state.selectedLanguage, 'listening')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default VoiceInputScreen