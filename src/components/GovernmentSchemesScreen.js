import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert 
} from 'react-native';
import { ArrowLeft, Search, Building2, CircleCheck as CheckCircle, Clock, FileText, ExternalLink } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

const GovernmentSchemesScreen = ({ onBack }) => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [schemes, setSchemes] = useState([]);

  const categories = [
    { id: 'all', labelKey: 'allSchemes', icon: Building2 },
    { id: 'subsidy', labelKey: 'subsidies', icon: CheckCircle },
    { id: 'insurance', labelKey: 'insurance', icon: FileText },
    { id: 'loan', labelKey: 'loans', icon: Clock },
  ];

  const mockSchemes = [
    {
      id: 1,
      nameKey: 'pmKisan',
      name: 'PM-KISAN Samman Nidhi',
      category: 'subsidy',
      amount: '₹6,000/year',
      eligibility: 'Small & marginal farmers',
      status: 'eligible',
      description: 'Direct income support to farmer families',
      documents: ['Aadhaar Card', 'Bank Account', 'Land Records'],
      applicationUrl: 'https://pmkisan.gov.in',
      deadline: 'March 31, 2024'
    },
    {
      id: 2,
      nameKey: 'cropInsurance',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      category: 'insurance',
      amount: 'Up to ₹2 lakh coverage',
      eligibility: 'All farmers',
      status: 'applied',
      description: 'Crop insurance against natural calamities',
      documents: ['Aadhaar Card', 'Bank Account', 'Land Records', 'Sowing Certificate'],
      applicationUrl: 'https://pmfby.gov.in',
      deadline: 'Within 7 days of sowing'
    },
    {
      id: 3,
      nameKey: 'kccLoan',
      name: 'Kisan Credit Card',
      category: 'loan',
      amount: 'Up to ₹3 lakh',
      eligibility: 'Farmers with land records',
      status: 'not_applied',
      description: 'Credit facility for agricultural needs',
      documents: ['Aadhaar Card', 'PAN Card', 'Land Records', 'Income Certificate'],
      applicationUrl: 'https://kcc.gov.in',
      deadline: 'No deadline'
    },
    {
      id: 4,
      nameKey: 'soilHealthCard',
      name: 'Soil Health Card Scheme',
      category: 'subsidy',
      amount: 'Free soil testing',
      eligibility: 'All farmers',
      status: 'eligible',
      description: 'Free soil testing and nutrient recommendations',
      documents: ['Aadhaar Card', 'Land Records'],
      applicationUrl: 'https://soilhealth.dac.gov.in',
      deadline: 'Ongoing'
    }
  ];

  useEffect(() => {
    setSchemes(mockSchemes);
  }, []);

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'eligible': return '#22C55E';
      case 'applied': return '#F59E0B';
      case 'approved': return '#3B82F6';
      case 'not_applied': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'eligible': return getTranslation(state.selectedLanguage, 'eligible');
      case 'applied': return getTranslation(state.selectedLanguage, 'applied');
      case 'approved': return getTranslation(state.selectedLanguage, 'approved');
      case 'not_applied': return getTranslation(state.selectedLanguage, 'notApplied');
      default: return status;
    }
  };

  const handleApplyScheme = (scheme) => {
    Alert.alert(
      getTranslation(state.selectedLanguage, 'applyScheme'),
      `${getTranslation(state.selectedLanguage, 'applySchemeDesc')} ${scheme.name}?`,
      [
        { text: getTranslation(state.selectedLanguage, 'cancel'), style: 'cancel' },
        { 
          text: getTranslation(state.selectedLanguage, 'proceed'), 
          onPress: () => {
            // In a real app, this would open the application form or external link
            Alert.alert(
              getTranslation(state.selectedLanguage, 'applicationGuide'),
              `${getTranslation(state.selectedLanguage, 'documentsRequired')}: ${scheme.documents.join(', ')}`
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTranslation(state.selectedLanguage, 'governmentSchemes')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={getTranslation(state.selectedLanguage, 'searchSchemes')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <IconComponent 
                  size={20} 
                  color={selectedCategory === category.id ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.activeCategoryText
                ]}>
                  {getTranslation(state.selectedLanguage, category.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Schemes List */}
        <View style={styles.schemesSection}>
          <Text style={styles.sectionTitle}>
            {getTranslation(state.selectedLanguage, 'availableSchemes')} ({filteredSchemes.length})
          </Text>
          
          {filteredSchemes.map((scheme) => (
            <View key={scheme.id} style={styles.schemeCard}>
              <View style={styles.schemeHeader}>
                <View style={styles.schemeInfo}>
                  <Text style={styles.schemeName}>{scheme.name}</Text>
                  <View style={styles.schemeAmount}>
                    <Text style={styles.amountText}>{scheme.amount}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(scheme.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(scheme.status) }]}>
                    {getStatusText(scheme.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.schemeDescription}>{scheme.description}</Text>
              
              <View style={styles.schemeDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{getTranslation(state.selectedLanguage, 'eligibility')}:</Text>
                  <Text style={styles.detailValue}>{scheme.eligibility}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{getTranslation(state.selectedLanguage, 'deadline')}:</Text>
                  <Text style={styles.detailValue}>{scheme.deadline}</Text>
                </View>
              </View>

              <View style={styles.schemeActions}>
                {scheme.status === 'eligible' || scheme.status === 'not_applied' ? (
                  <TouchableOpacity 
                    style={styles.applyButton}
                    onPress={() => handleApplyScheme(scheme)}
                  >
                    <FileText size={16} color="#FFFFFF" />
                    <Text style={styles.applyButtonText}>
                      {getTranslation(state.selectedLanguage, 'applyNow')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.trackButton}>
                    <Clock size={16} color="#F59E0B" />
                    <Text style={styles.trackButtonText}>
                      {getTranslation(state.selectedLanguage, 'trackApplication')}
                    </Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity style={styles.detailsButton}>
                  <ExternalLink size={16} color="#6B7280" />
                  <Text style={styles.detailsButtonText}>
                    {getTranslation(state.selectedLanguage, 'viewDetails')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>{getTranslation(state.selectedLanguage, 'needHelp')}</Text>
          <Text style={styles.helpText}>
            {getTranslation(state.selectedLanguage, 'helpDescription')}
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>{getTranslation(state.selectedLanguage, 'contactSupport')}</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 10,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCategoryButton: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  schemesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  schemeCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  schemeInfo: {
    flex: 1,
    marginRight: 10,
  },
  schemeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  schemeAmount: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  amountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  schemeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
    lineHeight: 20,
  },
  schemeDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  schemeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  detailsButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  helpSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#16A34A',
    marginBottom: 15,
    lineHeight: 20,
  },
  helpButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GovernmentSchemesScreen;