import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Mic, Send, ArrowLeft, Globe, MicOff, Copy, Volume2 } from 'lucide-react-native';
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
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: getTranslation(state.selectedLanguage, 'welcomeMessage'),
      timestamp: new Date()
    }
  ]);
  const [currentLanguage, setCurrentLanguage] = useState(state.selectedLanguage);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleVoiceInput = async () => {
    try {
      setIsListening(true);
      // In a real app, you would implement speech-to-text here
      // For now, we'll simulate it
      setTimeout(() => {
        const sampleQuestions = [
          'What is the best time to sow wheat?',
          'How to treat tomato leaf curl disease?',
          'What are the current market prices for rice?',
          'Which government schemes are available for farmers?'
        ];
        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        setInputText(randomQuestion);
        setIsListening(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to capture voice input');
      setIsListening(false);
    }
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // Add typing indicator
      const typingMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '',
        isTyping: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, typingMessage]);

      let aiResponse;
      try {
        aiResponse = await callGeminiAPI(currentInput);
      } catch (error) {
        // If API fails, queue for offline processing
        await offlineUtils.addToQueue({
          type: 'voice_query',
          data: { query: currentInput, language: currentLanguage }
        });
        
        aiResponse = getTranslation(state.selectedLanguage, 'queryQueuedOffline');
      }

      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          id: Date.now() + 2,
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        }];
      });

      // Text-to-speech for the response
      Speech.speak(aiResponse, {
        language: 'en',
        pitch: 1.0,
        rate: 0.8,
      });
    } catch (error) {
      // Remove typing indicator and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          id: Date.now() + 2,
          type: 'assistant',
          content: getTranslation(state.selectedLanguage, 'errorMessage'),
          timestamp: new Date(),
          isError: true
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  const handleCopyMessage = (content) => {
    // In a real app, you would use Clipboard API
    Alert.alert(
      getTranslation(state.selectedLanguage, 'copied'),
      getTranslation(state.selectedLanguage, 'messageCopied')
    );
  };

  const handleSpeakMessage = (content) => {
    Speech.speak(content, {
      language: 'en',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const toggleLanguage = () => {
    const languages = ['English', 'हिंदी', 'ಕನ್ನಡ'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    const isTyping = message.isTyping;
    const isError = message.isError;

    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer
      ]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          isError && styles.errorBubble
        ]}>
          {isTyping ? (
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color="#6B7280" />
              <Text style={styles.typingText}>
                {getTranslation(state.selectedLanguage, 'aiTyping')}
              </Text>
            </View>
          ) : (
            <>
              <Text style={[
                styles.messageText,
                isUser ? styles.userMessageText : styles.assistantMessageText,
                isError && styles.errorMessageText
              ]}>
                {message.content}
              </Text>
              
              {!isUser && !isError && (
                <View style={styles.messageActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleCopyMessage(message.content)}
                  >
                    <Copy size={14} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleSpeakMessage(message.content)}
                  >
                    <Volume2 size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
        
        {isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👨‍🌾</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{getTranslation(state.selectedLanguage, 'aiAssistant')}</Text>
          <Text style={styles.headerSubtitle}>{getTranslation(state.selectedLanguage, 'onlineStatus')}</Text>
        </View>
        <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
          <Globe size={20} color="#22C55E" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>{getTranslation(state.selectedLanguage, 'quickQuestions')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={styles.quickActionChip}
              onPress={() => handleQuickQuestion('What diseases affect tomato plants?')}
            >
              <Text style={styles.quickActionText}>{getTranslation(state.selectedLanguage, 'tomatoDiseases')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionChip}
              onPress={() => handleQuickQuestion('Current market price of wheat')}
            >
              <Text style={styles.quickActionText}>{getTranslation(state.selectedLanguage, 'wheatPrices')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionChip}
              onPress={() => handleQuickQuestion('Government schemes for farmers')}
            >
              <Text style={styles.quickActionText}>{getTranslation(state.selectedLanguage, 'governmentSchemes')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]} 
            onPress={handleVoiceInput}
            disabled={isLoading}
          >
            {isListening ? (
              <MicOff size={20} color="#FFFFFF" />
            ) : (
              <Mic size={20} color="#22C55E" />
            )}
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder={getTranslation(state.selectedLanguage, 'typeMessage')}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSubmit}
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={20} color={!inputText.trim() ? "#9CA3AF" : "#FFFFFF"} />
          </TouchableOpacity>
        </View>
        
        {isListening && (
          <View style={styles.listeningIndicator}>
            <ActivityIndicator size="small" color="#22C55E" />
            <Text style={styles.listeningText}>
              {getTranslation(state.selectedLanguage, 'listening')}
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
  },
  languageButton: {
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  chatContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#22C55E',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  errorBubble: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#374151',
  },
  errorMessageText: {
    color: '#DC2626',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  messageActions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  quickActionChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#374151',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  voiceButtonActive: {
    backgroundColor: '#22C55E',
    borderColor: '#16A34A',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
  },
  listeningText: {
    fontSize: 14,
    color: '#22C55E',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default VoiceInputScreen;