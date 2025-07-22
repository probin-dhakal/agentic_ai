import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView
} from 'react-native';
import { Camera, ArrowLeft, Upload, Mic, Send, MicOff } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { callGeminiAPI } from '../config/gemini';
import { offlineUtils } from './OfflineManager';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

const CropHealthScreen = ({ onBack }) => {
  const { state } = useApp();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showQuestionInput, setShowQuestionInput] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos of your crops.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0]);
        analyzeCrop(result.assets[0].base64);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0]);
        analyzeCrop(result.assets[0].base64);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const analyzeCrop = async (imageBase64) => {
    try {
      setIsAnalyzing(true);
      setDiagnosis('');
      
      // Combine image analysis with user question if provided
      let prompt = "Analyze this crop image for diseases, pests, or health issues. Provide a detailed diagnosis and treatment recommendations.";
      if (userQuestion.trim()) {
        prompt += ` The farmer has a specific question: "${userQuestion.trim()}"`;
      }
      
      try {
        const result = await callGeminiAPI(prompt, imageBase64);
        setDiagnosis(result);
      } catch (error) {
        // If API fails, queue for offline processing
        await offlineUtils.addToQueue({
          type: 'diagnosis',
          data: { 
            image: imageBase64, 
            prompt: prompt,
            userQuestion: userQuestion.trim()
          }
        });
        
        setDiagnosis(getTranslation(state.selectedLanguage, 'diagnosisQueuedOffline'));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      setIsListening(true);
      // In a real app, you would implement speech-to-text here
      // For now, we'll simulate it
      setTimeout(() => {
        const sampleQuestions = [
          'What disease is affecting my tomato leaves?',
          'Why are my plant leaves turning yellow?',
          'Is this pest damage or nutrient deficiency?',
          'How can I treat these brown spots?'
        ];
        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        setUserQuestion(randomQuestion);
        setIsListening(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to capture voice input');
      setIsListening(false);
    }
  };

  const clearQuestion = () => {
    setUserQuestion('');
    setShowQuestionInput(false);
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTranslation(state.selectedLanguage, 'identifyCropProblem')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Image Display Area */}
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.cropImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Camera size={60} color="#D1D5DB" />
              <Text style={styles.placeholderText}>{getTranslation(state.selectedLanguage, 'noImageSelected')}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <Camera size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{getTranslation(state.selectedLanguage, 'takePhoto')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={pickImage}>
            <Upload size={24} color="#22C55E" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              {getTranslation(state.selectedLanguage, 'chooseFromGallery')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Question Input Section */}
        {selectedImage && (
          <View style={styles.questionSection}>
            <Text style={styles.questionTitle}>
              {getTranslation(state.selectedLanguage, 'askSpecificQuestion')}
            </Text>
            <Text style={styles.questionSubtitle}>
              {getTranslation(state.selectedLanguage, 'questionOptional')}
            </Text>
            
            {!showQuestionInput ? (
              <View style={styles.questionPrompt}>
                <TouchableOpacity 
                  style={styles.addQuestionButton}
                  onPress={() => setShowQuestionInput(true)}
                >
                  <Text style={styles.addQuestionText}>
                    {getTranslation(state.selectedLanguage, 'addQuestion')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.questionInputContainer}>
                {/* Text Input */}
                <View style={styles.textInputSection}>
                  <TextInput
                    style={styles.questionTextInput}
                    placeholder={getTranslation(state.selectedLanguage, 'typeYourQuestion')}
                    value={userQuestion}
                    onChangeText={setUserQuestion}
                    multiline
                    numberOfLines={3}
                  />
                </View>
                
                {/* Voice Input Button */}
                <View style={styles.voiceInputSection}>
                  <TouchableOpacity 
                    style={[styles.voiceButton, isListening && styles.voiceButtonActive]} 
                    onPress={handleVoiceInput}
                    disabled={isListening}
                  >
                    {isListening ? (
                      <MicOff size={20} color="#FFFFFF" />
                    ) : (
                      <Mic size={20} color="#22C55E" />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.voiceButtonText}>
                    {isListening 
                      ? getTranslation(state.selectedLanguage, 'listening')
                      : getTranslation(state.selectedLanguage, 'tapToSpeak')
                    }
                  </Text>
                </View>
                
                {/* Question Actions */}
                <View style={styles.questionActions}>
                  <TouchableOpacity style={styles.clearButton} onPress={clearQuestion}>
                    <Text style={styles.clearButtonText}>
                      {getTranslation(state.selectedLanguage, 'clear')}
                    </Text>
                  </TouchableOpacity>
                  
                  {userQuestion.trim() && (
                    <TouchableOpacity 
                      style={styles.analyzeWithQuestionButton}
                      onPress={() => analyzeCrop(selectedImage.base64)}
                    >
                      <Send size={16} color="#FFFFFF" />
                      <Text style={styles.analyzeWithQuestionText}>
                        {getTranslation(state.selectedLanguage, 'analyzeWithQuestion')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            
            {/* Current Question Display */}
            {userQuestion.trim() && !showQuestionInput && (
              <View style={styles.currentQuestionDisplay}>
                <Text style={styles.currentQuestionLabel}>
                  {getTranslation(state.selectedLanguage, 'yourQuestion')}:
                </Text>
                <Text style={styles.currentQuestionText}>{userQuestion}</Text>
                <TouchableOpacity 
                  style={styles.editQuestionButton}
                  onPress={() => setShowQuestionInput(true)}
                >
                  <Text style={styles.editQuestionText}>
                    {getTranslation(state.selectedLanguage, 'editQuestion')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Analyze Button */}
        {selectedImage && !isAnalyzing && (
          <TouchableOpacity 
            style={styles.analyzeButton}
            onPress={() => analyzeCrop(selectedImage.base64)}
          >
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.analyzeButtonText}>
              {userQuestion.trim() 
                ? getTranslation(state.selectedLanguage, 'analyzeWithQuestion')
                : getTranslation(state.selectedLanguage, 'analyzeImage')
              }
            </Text>
          </TouchableOpacity>
        )}

        {/* Analysis Section */}
        {isAnalyzing && (
          <View style={styles.analysisContainer}>
            <ActivityIndicator size="large" color="#22C55E" />
            <Text style={styles.analysisText}>{getTranslation(state.selectedLanguage, 'analyzingCrop')}</Text>
            <Text style={styles.analysisSubtext}>
              {userQuestion.trim() 
                ? getTranslation(state.selectedLanguage, 'analyzingWithQuestion')
                : getTranslation(state.selectedLanguage, 'analyzingDesc')
              }
            </Text>
          </View>
        )}

        {/* Diagnosis Results */}
        {diagnosis && !isAnalyzing && (
          <View style={styles.diagnosisContainer}>
            <Text style={styles.diagnosisTitle}>{getTranslation(state.selectedLanguage, 'diagnosisAndTreatment')}</Text>
            {userQuestion.trim() && (
              <View style={styles.questionContext}>
                <Text style={styles.questionContextLabel}>
                  {getTranslation(state.selectedLanguage, 'basedOnQuestion')}:
                </Text>
                <Text style={styles.questionContextText}>"{userQuestion}"</Text>
              </View>
            )}
            <View style={styles.diagnosisCard}>
              <Text style={styles.diagnosisText}>{diagnosis}</Text>
            </View>
            
            <TouchableOpacity style={styles.retakeButton} onPress={() => {
              setSelectedImage(null);
              setDiagnosis('');
              setUserQuestion('');
              setShowQuestionInput(false);
            }}>
              <Text style={styles.retakeButtonText}>{getTranslation(state.selectedLanguage, 'analyzeAnother')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions */}
        {!selectedImage && !isAnalyzing && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>{getTranslation(state.selectedLanguage, 'bestResults')}</Text>
            <View style={styles.instructionsList}>
              <Text style={styles.instructionItem}>{getTranslation(state.selectedLanguage, 'instruction1')}</Text>
              <Text style={styles.instructionItem}>{getTranslation(state.selectedLanguage, 'instruction2')}</Text>
              <Text style={styles.instructionItem}>{getTranslation(state.selectedLanguage, 'instruction3')}</Text>
              <Text style={styles.instructionItem}>{getTranslation(state.selectedLanguage, 'instruction4')}</Text>
              <Text style={styles.instructionItem}>{getTranslation(state.selectedLanguage, 'instruction5')}</Text>
            </View>
          </View>
        )}
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageContainer: {
    height: 250,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginBottom: 20,
    overflow: 'hidden',
  },
  cropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#22C55E',
  },
  analysisContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  analysisText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 15,
  },
  analysisSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  diagnosisContainer: {
    flex: 1,
  },
  diagnosisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  diagnosisCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
    marginBottom: 20,
  },
  diagnosisText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  retakeButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  instructionsList: {
    marginLeft: 10,
  },
  instructionItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  questionSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },
  questionPrompt: {
    alignItems: 'center',
  },
  addQuestionButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addQuestionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  questionInputContainer: {
    marginTop: 10,
  },
  textInputSection: {
    marginBottom: 15,
  },
  questionTextInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  voiceInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  voiceButtonText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  analyzeWithQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  analyzeWithQuestionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  currentQuestionDisplay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  currentQuestionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 4,
  },
  currentQuestionText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  editQuestionButton: {
    alignSelf: 'flex-start',
  },
  editQuestionText: {
    fontSize: 12,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  questionContext: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  questionContextLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 4,
  },
  questionContextText: {
    fontSize: 14,
    color: '#1F2937',
    fontStyle: 'italic',
  },
});

export default CropHealthScreen;