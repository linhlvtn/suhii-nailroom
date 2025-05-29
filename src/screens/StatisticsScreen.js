// src/screens/StatisticsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatisticsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Màn hình Thống kê</Text>
      <Text>Phần này sẽ hiển thị báo cáo thống kê doanh thu và số lượng khách hàng.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default StatisticsScreen;
