import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';
import { ArrowLeft, Calendar, Droplets, Sun, Thermometer, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

const CropCalendarScreen = ({ onBack }) => {
  const { state } = useApp();
  const [selectedCrop, setSelectedCrop] = useState(state.selectedCrops[0] || 'tomato');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 65,
    rainfall: 12,
    condition: 'Partly Cloudy'
  });

  const cropCalendarData = {
    tomato: {
      totalWeeks: 16,
      phases: [
        { phase: 'Seed Preparation', weeks: [1, 2], color: '#8B5CF6' },
        { phase: 'Sowing', weeks: [3, 4], color: '#22C55E' },
        { phase: 'Germination', weeks: [5, 6], color: '#3B82F6' },
        { phase: 'Vegetative Growth', weeks: [7, 8, 9, 10], color: '#F59E0B' },
        { phase: 'Flowering', weeks: [11, 12], color: '#EC4899' },
        { phase: 'Fruit Development', weeks: [13, 14], color: '#EF4444' },
        { phase: 'Harvest', weeks: [15, 16], color: '#10B981' }
      ],
      weeklyTasks: {
        1: ['Prepare seedbed', 'Select quality seeds', 'Check soil pH'],
        2: ['Treat seeds with fungicide', 'Prepare nursery area'],
        3: ['Sow seeds in nursery', 'Water gently', 'Provide shade'],
        4: ['Monitor germination', 'Remove weak seedlings'],
        5: ['Transplant seedlings', 'Apply base fertilizer'],
        6: ['Water regularly', 'Check for pests'],
        7: ['Apply first dose of fertilizer', 'Stake plants'],
        8: ['Prune suckers', 'Monitor for diseases'],
        9: ['Apply second fertilizer dose', 'Check irrigation'],
        10: ['Monitor growth', 'Apply pesticide if needed'],
        11: ['Support flowering', 'Reduce nitrogen'],
        12: ['Hand pollination if needed', 'Monitor fruit set'],
        13: ['Support heavy branches', 'Regular watering'],
        14: ['Monitor fruit development', 'Check for fruit flies'],
        15: ['Harvest ripe fruits', 'Check market prices'],
        16: ['Complete harvest', 'Prepare for next crop']
      }
    }
  };

  const getCurrentPhase = () => {
    const data = cropCalendarData[selectedCrop];
    if (!data) return null;
    
    return data.phases.find(phase => 
      phase.weeks.includes(currentWeek)
    );
  };

  const getWeeklyTasks = () => {
    const data = cropCalendarData[selectedCrop];
    return data?.weeklyTasks[currentWeek] || [];
  };

  const getWeatherRecommendation = () => {
    const currentPhase = getCurrentPhase();
    if (!currentPhase) return '';

    if (weatherData.rainfall > 20 && currentPhase.phase === 'Flowering') {
      return 'High rainfall may affect pollination. Consider protective measures.';
    }
    if (weatherData.temperature > 35 && currentPhase.phase === 'Fruit Development') {
      return 'High temperature may cause fruit cracking. Increase irrigation.';
    }
    return 'Weather conditions are favorable for current growth phase.';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTranslation(state.selectedLanguage, 'cropCalendar')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Crop Selection */}
        <View style={styles.cropSelector}>
          <Text style={styles.selectorLabel}>{getTranslation(state.selectedLanguage, 'selectedCrop')}</Text>
          <View style={styles.cropCard}>
            <Text style={styles.cropEmoji}>🍅</Text>
            <Text style={styles.cropName}>{getTranslation(state.selectedLanguage, selectedCrop)}</Text>
          </View>
        </View>

        {/* Current Phase */}
        {getCurrentPhase() && (
          <View style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <View style={[styles.phaseIndicator, { backgroundColor: getCurrentPhase().color }]} />
              <Text style={styles.phaseTitle}>{getCurrentPhase().phase}</Text>
            </View>
            <Text style={styles.phaseWeek}>Week {currentWeek} of {cropCalendarData[selectedCrop].totalWeeks}</Text>
          </View>
        )}

        {/* Weather Card */}
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>{getTranslation(state.selectedLanguage, 'currentWeather')}</Text>
          <View style={styles.weatherGrid}>
            <View style={styles.weatherItem}>
              <Thermometer size={20} color="#EF4444" />
              <Text style={styles.weatherValue}>{weatherData.temperature}°C</Text>
              <Text style={styles.weatherLabel}>{getTranslation(state.selectedLanguage, 'temperature')}</Text>
            </View>
            <View style={styles.weatherItem}>
              <Droplets size={20} color="#3B82F6" />
              <Text style={styles.weatherValue}>{weatherData.humidity}%</Text>
              <Text style={styles.weatherLabel}>{getTranslation(state.selectedLanguage, 'humidity')}</Text>
            </View>
            <View style={styles.weatherItem}>
              <Sun size={20} color="#F59E0B" />
              <Text style={styles.weatherValue}>{weatherData.rainfall}mm</Text>
              <Text style={styles.weatherLabel}>{getTranslation(state.selectedLanguage, 'rainfall')}</Text>
            </View>
          </View>
          
          {/* Weather Recommendation */}
          <View style={styles.weatherRecommendation}>
            <AlertTriangle size={16} color="#F59E0B" />
            <Text style={styles.recommendationText}>{getWeatherRecommendation()}</Text>
          </View>
        </View>

        {/* Weekly Tasks */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>{getTranslation(state.selectedLanguage, 'weeklyTasks')}</Text>
          {getWeeklyTasks().map((task, index) => (
            <View key={index} style={styles.taskItem}>
              <View style={styles.taskBullet} />
              <Text style={styles.taskText}>{task}</Text>
            </View>
          ))}
        </View>

        {/* Timeline Navigation */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>{getTranslation(state.selectedLanguage, 'cropTimeline')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeline}>
            {Array.from({ length: cropCalendarData[selectedCrop]?.totalWeeks || 16 }, (_, i) => i + 1).map((week) => (
              <TouchableOpacity
                key={week}
                style={[
                  styles.timelineWeek,
                  week === currentWeek && styles.activeWeek
                ]}
                onPress={() => setCurrentWeek(week)}
              >
                <Text style={[
                  styles.weekNumber,
                  week === currentWeek && styles.activeWeekNumber
                ]}>
                  {week}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Phase Legend */}
        <View style={styles.legendSection}>
          <Text style={styles.sectionTitle}>{getTranslation(state.selectedLanguage, 'growthPhases')}</Text>
          {cropCalendarData[selectedCrop]?.phases.map((phase, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: phase.color }]} />
              <Text style={styles.legendText}>{phase.phase}</Text>
              <Text style={styles.legendWeeks}>Weeks {phase.weeks.join(', ')}</Text>
            </View>
          ))}
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
  cropSelector: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  cropEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
  },
  phaseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phaseIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  phaseWeek: {
    fontSize: 14,
    color: '#6B7280',
  },
  weatherCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  weatherItem: {
    alignItems: 'center',
    flex: 1,
  },
  weatherValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 5,
  },
  weatherLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  weatherRecommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
  },
  tasksSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginTop: 6,
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  timelineSection: {
    marginBottom: 20,
  },
  timeline: {
    flexDirection: 'row',
  },
  timelineWeek: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activeWeek: {
    backgroundColor: '#22C55E',
  },
  weekNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeWeekNumber: {
    color: '#FFFFFF',
  },
  legendSection: {
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  legendWeeks: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default CropCalendarScreen;