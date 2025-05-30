// src/screens/CreateReportScreen.js
import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  Snackbar, 
  Card,
  Chip,
  IconButton,
  ActivityIndicator
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebaseConfig';

const SERVICES = [
  { id: 'nail', label: 'Nail', color: '#e91e63' },
  { id: 'mi', label: 'Mi', color: '#9c27b0' },
  { id: 'goi', label: 'Gội', color: '#2196f3' },
  { id: 'khac', label: 'Khác', color: '#ff9800' }
];

const CreateReportScreen = () => {
  const [price, setPrice] = useState('');
  const [selectedService, setSelectedService] = useState('nail');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);

  const navigation = useNavigation();

  const showMessage = (message, isError = false) => {
    setSnackbarText(message);
    setSnackbarError(isError);
    setSnackbarVisible(true);
  };

  // Format số tiền VNĐ
  const formatPrice = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue === '') return '';
    
    const formattedValue = new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
    return formattedValue;
  };

  const handlePriceChange = (text) => {
    const formatted = formatPrice(text);
    setPrice(formatted);
  };

  // Chọn/chụp ảnh
  const pickImage = () => {
    Alert.alert(
      'Chọn ảnh',
      'Bạn muốn chụp ảnh mới hay chọn từ thư viện?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Chụp ảnh', onPress: takePhoto },
        { text: 'Thư viện', onPress: chooseFromLibrary }
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showMessage('Cần quyền truy cập camera để chụp ảnh', true);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      showMessage('Lỗi khi chụp ảnh', true);
    }
  };

  const chooseFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showMessage('Cần quyền truy cập thư viện ảnh', true);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      showMessage('Lỗi khi chọn ảnh', true);
    }
  };

  // Upload ảnh lên Firebase Storage
  const uploadImage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const fileName = `reports/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const imageRef = ref(storage, fileName);
      
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      
      return downloadURL;
    } catch (error) {
      throw new Error('Lỗi khi tải ảnh lên: ' + error.message);
    }
  };

  // Tạo báo cáo
  const handleCreateReport = async () => {
    // Validate
    if (!price.trim()) {
      showMessage('Vui lòng nhập giá tiền', true);
      return;
    }

    if (!selectedService) {
      showMessage('Vui lòng chọn dịch vụ', true);
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      
      // Upload ảnh nếu có
      if (image) {
        imageUrl = await uploadImage(image.uri);
      }

      // Tạo báo cáo trong Firestore
      const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
      const reportData = {
        price: numericPrice,
        service: selectedService,
        note: note.trim() || '',
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        createdDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD cho thống kê
      };

      await addDoc(collection(db, 'reports'), reportData);
      
      showMessage('Tạo báo cáo thành công!');
      
      // Reset form
      setTimeout(() => {
        setPrice('');
        setSelectedService('nail');
        setNote('');
        setImage(null);
        navigation.goBack();
      }, 1500);

    } catch (error) {
      showMessage('Lỗi khi tạo báo cáo: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Tạo Báo Cáo Mới</Text>

        {/* Giá tiền */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Giá tiền *</Text>
            <TextInput
              value={price}
              onChangeText={handlePriceChange}
              placeholder="Nhập giá tiền"
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              right={<TextInput.Affix text="VNĐ" />}
            />
          </Card.Content>
        </Card>

        {/* Dịch vụ */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Dịch vụ *</Text>
            <View style={styles.serviceContainer}>
              {SERVICES.map(service => (
                <Chip
                  key={service.id}
                  selected={selectedService === service.id}
                  onPress={() => setSelectedService(service.id)}
                  style={[
                    styles.serviceChip,
                    selectedService === service.id && { backgroundColor: service.color }
                  ]}
                  textStyle={[
                    selectedService === service.id && { color: 'white' }
                  ]}
                >
                  {service.label}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Ghi chú */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Nhập ghi chú (tùy chọn)"
              multiline
              numberOfLines={3}
              style={styles.input}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Hình ảnh */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Hình ảnh</Text>
            
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                <IconButton
                  icon="close-circle"
                  size={30}
                  iconColor="#f44336"
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
                <IconButton icon="camera-plus" size={40} />
                <Text style={styles.imagePlaceholderText}>
                  Chụp ảnh hoặc chọn từ thư viện
                </Text>
              </TouchableOpacity>
            )}
            
            {image && (
              <Button mode="outlined" onPress={pickImage} style={styles.changeImageButton}>
                Thay đổi ảnh
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={[styles.button, styles.cancelButton]}
            disabled={loading}
          >
            Hủy
          </Button>
          
          <Button
            mode="contained"
            onPress={handleCreateReport}
            style={[styles.button, styles.createButton]}
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo báo cáo'}
          </Button>
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={snackbarError ? styles.snackbarError : styles.snackbarSuccess}
      >
        {snackbarText}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    marginBottom: 8,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    margin: 2,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  imagePlaceholder: {
    height: 150,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  imagePlaceholderText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  changeImageButton: {
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
  },
  cancelButton: {
    borderColor: '#666',
  },
  createButton: {
    backgroundColor: '#e91e63',
  },
  snackbarError: {
    backgroundColor: '#d32f2f',
  },
  snackbarSuccess: {
    backgroundColor: '#388e3c',
  },
});

export default CreateReportScreen;