import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './services/firebaseConfig'; // Đảm bảo đường dẫn đúng

const CheckFirebase = () => {
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const testDocRef = doc(collection(db, 'test'), 'testDoc');
        await setDoc(testDocRef, { test: 'Firebase is connected!' });
        console.log('Firebase is connected!');
      } catch (error) {
        console.error('Error connecting to Firebase:', error);
      }
    };

    checkConnection();
  }, []);

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>Checking Firebase Connection...</Text>
    </View>
  );
};

export default CheckFirebase;

