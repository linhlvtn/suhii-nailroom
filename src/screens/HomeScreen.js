// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, RefreshControl } from 'react-native';
import { Appbar, Button, Snackbar, Text, Card, Chip } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../services/firebaseConfig';
import StatisticsScreen from './StatisticsScreen';

const Tab = createBottomTabNavigator();

const SERVICES = {
  nail: { label: 'Nail', color: '#e91e63' },
  mi: { label: 'Mi', color: '#9c27b0' },
  goi: { label: 'Gội', color: '#2196f3' },
  khac: { label: 'Khác', color: '#ff9800' }
};

const StoreScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    try {
      const reportsQuery = query(
        collection(db, 'reports'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
        const reportsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        setReports(reportsData);
        setLoading(false);
        setRefreshing(false);
      }, (error) => {
        console.error('Error loading reports:', error);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up reports listener:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // The onSnapshot listener will automatically update the data
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSnackbarText('Đăng xuất thành công!');
      setSnackbarVisible(true);
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 1000);
    } catch (error) {
      setSnackbarText('Lỗi khi đăng xuất');
      setSnackbarVisible(true);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderReportItem = ({ item }) => (
    <Card style={styles.reportCard}>
      <Card.Content>
        <View style={styles.reportHeader}>
          <View style={styles.reportInfo}>
            <Text style={styles.reportPrice}>{formatPrice(item.price)}</Text>
            <Text style={styles.reportDate}>{formatDate(item.createdAt)}</Text>
          </View>
          
          <Chip 
            style={[
              styles.serviceChip, 
              { backgroundColor: SERVICES[item.service]?.color || '#757575' }
            ]}
            textStyle={styles.serviceChipText}
          >
            {SERVICES[item.service]?.label || item.service}
          </Chip>
        </View>

        {item.note ? (
          <Text style={styles.reportNote} numberOfLines={2}>
            {item.note}
          </Text>
        ) : null}

        {item.imageUrl && (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.reportImage}
            resizeMode="cover"
          />
        )}
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Chưa có báo cáo nào</Text>
      <Text style={styles.emptyStateSubtitle}>
        Nhấn nút "Tạo Báo Cáo Mới" để bắt đầu
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="" />
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          reports.length === 0 && styles.emptyList
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#e91e63']}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <Button
        mode="contained"
        style={styles.createReportButton}
        contentStyle={styles.createReportButtonContent}
        onPress={() => navigation.navigate('CreateReport')}
        icon="plus"
      >
        Tạo Báo Cáo Mới
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator 
      initialRouteName="Cửa hàng"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <Tab.Screen 
        name="Cửa hàng" 
        component={StoreScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/icon.png')} 
              style={{ width: size, height: size, tintColor: color }}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Thống kê" 
        component={StatisticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image 
              source={require('../../assets/icon.png')} 
              style={{ width: size, height: size, tintColor: color }}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  logo: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  reportCard: {
    marginBottom: 12,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportInfo: {
    flex: 1,
  },
  reportPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#666',
  },
  serviceChip: {
    marginLeft: 12,
  },
  serviceChipText: {
    color: 'white',
    fontSize: 12,
  },
  reportNote: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  reportImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  createReportButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    elevation: 8,
    backgroundColor: '#e91e63',
  },
  createReportButtonContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  snackbar: {
    backgroundColor: '#388e3c',
  },
});

export default HomeScreen;