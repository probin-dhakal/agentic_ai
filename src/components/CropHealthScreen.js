import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Camera, ArrowLeft, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { callGeminiAPI } from '../config/gemini';
import { offlineUtils } from './OfflineManager';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

const CropHealthScreen = ({ onBack }) => {
  const { state } = useApp();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');

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
      
      try {
        const prompt = "Analyze this crop image for diseases, pests, or health issues. Provide a detailed diagnosis and treatment recommendations.";
        const result = await callGeminiAPI(prompt, imageBase64);
        setDiagnosis(result);
      } catch (error) {
        // If API fails, queue for offline processing
        await offlineUtils.addToQueue({
          type: 'diagnosis',
          data: { image: imageBase64, prompt: "Analyze crop for diseases" }
        });
        
        setDiagnosis(getTranslation(state.selectedLanguage, 'diagnosisQueuedOffline'));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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

      <View style={styles.content}>
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

        {/* Analysis Section */}
        {isAnalyzing && (
          <View style={styles.analysisContainer}>
            <ActivityIndicator size="large" color="#22C55E" />
            <Text style={styles.analysisText}>{getTranslation(state.selectedLanguage, 'analyzingCrop')}</Text>
            <Text style={styles.analysisSubtext}>
              {getTranslation(state.selectedLanguage, 'analyzingDesc')}
            </Text>
          </View>
        )}

        {/* Diagnosis Results */}
        {diagnosis && !isAnalyzing && (
          <View style={styles.diagnosisContainer}>
            <Text style={styles.diagnosisTitle}>{getTranslation(state.selectedLanguage, 'diagnosisAndTreatment')}</Text>
            <View style={styles.diagnosisCard}>
              <Text style={styles.diagnosisText}>{diagnosis}</Text>
            </View>
            
            <TouchableOpacity style={styles.retakeButton} onPress={() => {
              setSelectedImage(null);
              setDiagnosis('');
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
            </View>
          </View>
        )}
      </View>
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
});

export default CropHealthScreen;