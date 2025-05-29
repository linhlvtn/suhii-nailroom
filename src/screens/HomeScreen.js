// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Appbar, Button, Snackbar, Text } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StatisticsScreen from './StatisticsScreen';

const Tab = createBottomTabNavigator();

const StoreScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const newReports = Array.from({ length: 10 }, (_, index) => ({
      id: index.toString(),
      title: `Báo cáo ${index + 1}`,
      content: 'Nội dung báo cáo...',
    }));
    setReports(newReports);
  };

  const handleLoadMore = () => {
    const moreReports = Array.from({ length: 5 }, (_, index) => ({
      id: (reports.length + index).toString(),
      title: `Báo cáo ${reports.length + index + 1}`,
      content: 'Nội dung báo cáo...',
    }));
    setReports(prevReports => [...prevReports, ...moreReports]);
  };

  const handleLogout = () => {
    setSnackbarText('Đăng xuất thành công!');
    setSnackbarVisible(true);
    // TODO: Đăng xuất logic, ví dụ firebase auth signOut()
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportItem}>
      <Text style={styles.reportTitle}>{item.title}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="" />
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.list}
      />

      <Button
        mode="contained"
        style={styles.createReportButton}
        onPress={() => navigation.navigate('CreateReport')}
      >
        Tạo Báo Cáo Mới
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator initialRouteName="Cửa hàng">
      <Tab.Screen name="Cửa hàng" component={StoreScreen} />
      <Tab.Screen name="Thống kê" component={StatisticsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  list: {
    padding: 16,
  },
  reportItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  reportTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  createReportButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
  },
});

export default HomeScreen;
