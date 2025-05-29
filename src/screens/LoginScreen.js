import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebaseConfig'; // Import auth từ firebaseConfig
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import hàm đăng nhập

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);

  const navigation = useNavigation();

  const showMessage = (message, isError = false) => {
    setSnackbarText(message);
    setSnackbarError(isError);
    setSnackbarVisible(true);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showMessage('Vui lòng điền đầy đủ thông tin!', true);
      return;
    }

    try {
      // Chuyển đổi số điện thoại thành email tạm thời
      await signInWithEmailAndPassword(auth, username.trim() + '@suhii.com', password);
      showMessage('Đăng nhập thành công!');
      navigation.navigate('Home'); // Chuyển hướng đến trang Home
    } catch (error) {
      showMessage(`Lỗi: ${error.message}`, true);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Đăng Nhập</Text>
        <TextInput
          label="Số điện thoại"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          mode="outlined"
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Đăng Nhập
        </Button>
        <Button onPress={goToRegister} style={styles.registerButton}>
          Bạn chưa có tài khoản? Đăng Ký
        </Button>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={snackbarError ? styles.snackbarError : styles.snackbarSuccess}
        >
          {snackbarText}
        </Snackbar>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  registerButton: {
    marginTop: 12,
  },
  snackbarError: {
    backgroundColor: '#d32f2f',
  },
  snackbarSuccess: {
    backgroundColor: '#388e3c',
  },
});

export default LoginScreen;