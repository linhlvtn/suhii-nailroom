import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CreateReportScreen from './src/screens/CreateReportScreen';

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          title: 'Đăng Ký',
          headerBackTitle: 'Quay lại'
        }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateReport" 
        component={CreateReportScreen}
        options={{ 
          title: 'Tạo Báo Cáo',
          headerBackTitle: 'Quay lại',
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;