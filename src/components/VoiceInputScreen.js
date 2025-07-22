import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Mic, Send, ArrowLeft, Globe } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { callGeminiAPI } from '../config/gemini';
import { offlineUtils } from './OfflineManager';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

const VoiceInputScreen = ({ onBack }) => {
  const { state } = useApp();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(state.selectedLanguage);

  const handleVoiceInput = async () => {
    try {
      setIsListening(true);
      // In a real app, you would implement speech-to-text here
      // For now, we'll simulate it
      setTimeout(() => {
        setInputText('What is the best time to sow wheat?');
        setIsListening(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to capture voice input');
      setIsListening(false);
    }
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    try {
      setIsLoading(true);
      
      // Check if online, if not queue the request
      try {
        const aiResponse = await callGeminiAPI(inputText);
        setResponse(aiResponse);
        
        // Text-to-speech for the response
        Speech.speak(aiResponse, {
          language: 'en',
          pitch: 1.0,
          rate: 0.8,
        });
      } catch (error) {
        // If API fails, queue for offline processing
        await offlineUtils.addToQueue({
          type: 'voice_query',
          data: { query: inputText, language: currentLanguage }
        });
        
        setResponse(getTranslation(state.selectedLanguage, 'queryQueuedOffline'));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    const languages = ['English', 'हिंदी', 'ಕನ್ನಡ'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTranslation(state.selectedLanguage, 'aiAssistant')}</Text>
        <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
          <Globe size={20} color="#22C55E" />
          <Text style={styles.languageText}>{getTranslation(state.selectedLanguage, 'language')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Voice Input Section */}
        <View style={styles.voiceSection}>
          <TouchableOpacity 
            style={[styles.micButton, isListening && styles.micButtonActive]} 
            onPress={handleVoiceInput}
            disabled={isLoading}
          >
            <Mic size={40} color={isListening ? "#FFFFFF" : "#22C55E"} />
          </TouchableOpacity>
          <Text style={styles.voiceText}>
            {isListening ? getTranslation(state.selectedLanguage, 'listening') : getTranslation(state.selectedLanguage, 'clickToSpeak')}
          </Text>
        </View>

        {/* Text Input */}
        <View style={styles.textInputSection}>
          <TextInput
            style={styles.textInput}
            placeholder={getTranslation(state.selectedLanguage, 'writeToKnow')}
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSubmit}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={20} color={!inputText.trim() ? "#9CA3AF" : "#FFFFFF"} />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#22C55E" />
            <Text style={styles.loadingText}>{getTranslation(state.selectedLanguage, 'gettingResponse')}</Text>
          </View>
        )}

        {/* Response Section */}
        {response && !isLoading && (
          <View style={styles.responseSection}>
            <Text style={styles.responseTitle}>{getTranslation(state.selectedLanguage, 'aiResponse')}</Text>
            <View style={styles.responseCard}>
              <Text style={styles.responseText}>{response}</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>{getTranslation(state.selectedLanguage, 'quickQuestions')}</Text>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => setInputText('What diseases affect tomato plants?')}
          >
            <Text style={styles.quickActionText}>{getTranslation(state.selectedLanguage, 'tomatoDiseases')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => setInputText('Current market price of wheat')}
          >
            <Text style={styles.quickActionText}>{getTranslation(state.selectedLanguage, 'wheatPrices')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => setInputText('Government schemes for farmers')}
          >
            <Text style={styles.quickActionText}>{getTranslation(state.selectedLanguage, 'governmentSchemes')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageText: {
    fontSize: 12,
    color: '#22C55E',
    marginLeft: 4,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  voiceSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0FDF4',
    borderWidth: 3,
    borderColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  micButtonActive: {
    backgroundColor: '#22C55E',
    borderColor: '#16A34A',
  },
  voiceText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  textInputSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#22C55E',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 10,
  },
  responseSection: {
    marginBottom: 30,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  responseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  responseText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  quickActions: {
    marginTop: 20,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  quickActionButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    color: '#374151',
  },
});

export default VoiceInputScreen;