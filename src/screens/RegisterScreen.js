import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/firebaseConfig'; // Đảm bảo import auth từ firebaseConfig
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterScreen = () => {
  const [username, setUsername] = useState(''); // Thêm state cho tên người dùng
  const [phone, setPhone] = useState(''); // Thay đổi state cho số điện thoại
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);

  const navigation = useNavigation();

  const showMessage = (message, isError = false) => {
    setSnackbarText(message);
    setSnackbarError(isError);
    setSnackbarVisible(true);
  };

  const handleRegister = async () => {
    if (!username || !phone || !password || !confirmPassword) {
      showMessage('Vui lòng điền đầy đủ thông tin', true);
      return;
    }
    if (password !== confirmPassword) {
      showMessage('Mật khẩu xác nhận không khớp', true);
      return;
    }

    try {
      // Sử dụng số điện thoại để đăng ký
      await createUserWithEmailAndPassword(auth, phone.trim() + '@suhii.com', password); // Chuyển đổi số điện thoại thành email tạm thời
      showMessage('Đăng ký thành công!');
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      showMessage(`Lỗi: ${error.message}`, true);
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Đăng Ký Tài Khoản Nhân Viên</Text>
        <TextInput
          label="Tên người dùng"
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Số điện thoại"
          value={phone}
          onChangeText={text => setPhone(text)}
          style={styles.input}
          keyboardType="phone-pad"
          autoCapitalize="none"
          mode="outlined"
        />
        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
          mode="outlined"
        />
        <TextInput
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          style={styles.input}
          secureTextEntry
          mode="outlined"
        />
        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Đăng Ký
        </Button>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={snackbarError ? styles.snackbarError : styles.snackbarSuccess}
        >
          {snackbarText}
        </Snackbar>
      </KeyboardAvoidingView>
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
  snackbarError: {
    backgroundColor: '#d32f2f',
  },
  snackbarSuccess: {
    backgroundColor: '#388e3c',
  },
});

export default RegisterScreen;
