import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Wifi, WifiOff, Upload, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

const OFFLINE_QUEUE_KEY = 'offline_queue';
const OFFLINE_DATA_KEY = 'offline_data';

const OfflineManager = () => {
  const { state } = useApp();
  const [isConnected, setIsConnected] = useState(true);
  const [queuedItems, setQueuedItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Monitor network connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        processOfflineQueue();
      }
    });

    loadQueuedItems();

    return () => unsubscribe();
  }, []);

  const loadQueuedItems = async () => {
    try {
      const queueData = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      if (queueData) {
        setQueuedItems(JSON.parse(queueData));
      }
    } catch (error) {
      console.error('Error loading queued items:', error);
    }
  };

  const addToQueue = async (item) => {
    try {
      const currentQueue = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      const queue = currentQueue ? JSON.parse(currentQueue) : [];
      
      const newItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: item.type, // 'diagnosis', 'market_query', 'voice_query'
        data: item.data,
        status: 'pending'
      };

      queue.push(newItem);
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      setQueuedItems(queue);
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  };

  const processOfflineQueue = async () => {
    if (!isConnected || isUploading || queuedItems.length === 0) return;

    setIsUploading(true);
    
    try {
      const updatedQueue = [...queuedItems];
      
      for (let i = 0; i < updatedQueue.length; i++) {
        const item = updatedQueue[i];
        if (item.status === 'pending') {
          try {
            await processQueueItem(item);
            updatedQueue[i].status = 'completed';
          } catch (error) {
            updatedQueue[i].status = 'failed';
            updatedQueue[i].error = error.message;
          }
        }
      }

      // Remove completed items, keep failed ones for retry
      const remainingQueue = updatedQueue.filter(item => item.status !== 'completed');
      
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue));
      setQueuedItems(remainingQueue);
      
      if (remainingQueue.length < queuedItems.length) {
        Alert.alert(
          getTranslation(state.selectedLanguage, 'syncComplete'),
          getTranslation(state.selectedLanguage, 'syncCompleteDesc')
        );
      }
    } catch (error) {
      console.error('Error processing queue:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const processQueueItem = async (item) => {
    switch (item.type) {
      case 'diagnosis':
        // Process plant diagnosis
        return await processDiagnosis(item.data);
      case 'market_query':
        // Process market price query
        return await processMarketQuery(item.data);
      case 'voice_query':
        // Process voice assistant query
        return await processVoiceQuery(item.data);
      default:
        throw new Error('Unknown queue item type');
    }
  };

  const processDiagnosis = async (data) => {
    // Simulate API call for plant diagnosis
    const response = await fetch('/api/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Diagnosis API failed');
    }
    
    return await response.json();
  };

  const processMarketQuery = async (data) => {
    // Simulate API call for market data
    const response = await fetch('/api/market', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Market API failed');
    }
    
    return await response.json();
  };

  const processVoiceQuery = async (data) => {
    // Simulate API call for voice query
    const response = await fetch('/api/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Voice API failed');
    }
    
    return await response.json();
  };

  const retryFailedItems = async () => {
    const failedItems = queuedItems.filter(item => item.status === 'failed');
    const updatedQueue = queuedItems.map(item => 
      item.status === 'failed' ? { ...item, status: 'pending' } : item
    );
    
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));
    setQueuedItems(updatedQueue);
    
    if (isConnected) {
      processOfflineQueue();
    }
  };

  const clearQueue = async () => {
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
    setQueuedItems([]);
  };

  // Store data for offline access
  const storeOfflineData = async (key, data) => {
    try {
      const offlineData = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
      const currentData = offlineData ? JSON.parse(offlineData) : {};
      
      currentData[key] = {
        data,
        timestamp: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(currentData));
    } catch (error) {
      console.error('Error storing offline data:', error);
    }
  };

  // Retrieve offline data
  const getOfflineData = async (key) => {
    try {
      const offlineData = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
      if (offlineData) {
        const currentData = JSON.parse(offlineData);
        return currentData[key]?.data || null;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving offline data:', error);
      return null;
    }
  };

  if (queuedItems.length === 0 && isConnected) {
    return null; // Don't show anything when online and no queued items
  }

  return (
    <View style={styles.container}>
      {/* Connection Status */}
      <View style={[styles.statusBar, isConnected ? styles.online : styles.offline]}>
        {isConnected ? (
          <Wifi size={16} color="#10B981" />
        ) : (
          <WifiOff size={16} color="#EF4444" />
        )}
        <Text style={[styles.statusText, isConnected ? styles.onlineText : styles.offlineText]}>
          {isConnected 
            ? getTranslation(state.selectedLanguage, 'online')
            : getTranslation(state.selectedLanguage, 'offline')
          }
        </Text>
      </View>

      {/* Queue Status */}
      {queuedItems.length > 0 && (
        <View style={styles.queueContainer}>
          <View style={styles.queueHeader}>
            <Text style={styles.queueTitle}>
              {getTranslation(state.selectedLanguage, 'pendingSync')} ({queuedItems.length})
            </Text>
            {isUploading && <Upload size={16} color="#F59E0B" />}
          </View>
          
          <View style={styles.queueActions}>
            {isConnected && !isUploading && (
              <TouchableOpacity style={styles.syncButton} onPress={processOfflineQueue}>
                <Upload size={14} color="#FFFFFF" />
                <Text style={styles.syncButtonText}>
                  {getTranslation(state.selectedLanguage, 'syncNow')}
                </Text>
              </TouchableOpacity>
            )}
            
            {queuedItems.some(item => item.status === 'failed') && (
              <TouchableOpacity style={styles.retryButton} onPress={retryFailedItems}>
                <Text style={styles.retryButtonText}>
                  {getTranslation(state.selectedLanguage, 'retry')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Queue Items */}
          <View style={styles.queueItems}>
            {queuedItems.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.queueItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemType}>
                    {getTranslation(state.selectedLanguage, item.type)}
                  </Text>
                  <Text style={styles.itemTime}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <View style={[
                  styles.itemStatus,
                  item.status === 'completed' && styles.statusCompleted,
                  item.status === 'failed' && styles.statusFailed,
                  item.status === 'pending' && styles.statusPending
                ]}>
                  {item.status === 'completed' && <CheckCircle size={12} color="#10B981" />}
                  <Text style={[
                    styles.statusText,
                    item.status === 'completed' && styles.completedText,
                    item.status === 'failed' && styles.failedText,
                    item.status === 'pending' && styles.pendingText
                  ]}>
                    {getTranslation(state.selectedLanguage, item.status)}
                  </Text>
                </View>
              </View>
            ))}
            
            {queuedItems.length > 3 && (
              <Text style={styles.moreItems}>
                +{queuedItems.length - 3} {getTranslation(state.selectedLanguage, 'moreItems')}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  online: {
    backgroundColor: '#ECFDF5',
  },
  offline: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  onlineText: {
    color: '#10B981',
  },
  offlineText: {
    color: '#EF4444',
  },
  queueContainer: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  queueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  queueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  queueActions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  retryButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  queueItems: {
    marginTop: 8,
  },
  queueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemInfo: {
    flex: 1,
  },
  itemType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  itemTime: {
    fontSize: 10,
    color: '#6B7280',
  },
  itemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statusFailed: {
    backgroundColor: '#FEF2F2',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  completedText: {
    color: '#10B981',
  },
  failedText: {
    color: '#EF4444',
  },
  pendingText: {
    color: '#F59E0B',
  },
  moreItems: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

// Export utility functions for use in other components
export const offlineUtils = {
  addToQueue: async (item) => {
    // This would be called from other components to queue offline actions
    const offlineManager = new OfflineManager();
    return offlineManager.addToQueue(item);
  },
  
  storeOfflineData: async (key, data) => {
    const offlineManager = new OfflineManager();
    return offlineManager.storeOfflineData(key, data);
  },
  
  getOfflineData: async (key) => {
    const offlineManager = new OfflineManager();
    return offlineManager.getOfflineData(key);
  }
};

export default OfflineManager;