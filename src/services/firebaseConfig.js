import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Thông tin cấu hình Firebase bạn lấy trong Firebase Console
const firebaseConfig = {
 apiKey: "AIzaSyDGfe3AO839u9-2Esm4xBu9_vR_guS5qHo",
  authDomain: "suhii-ef849.firebaseapp.com",
  projectId: "suhii-ef849",
  storageBucket: "suhii-ef849.firebasestorage.app",
  messagingSenderId: "444753173579",
  appId: "1:444753173579:web:2db658f708e93bafe181ce"
};

// Khởi tạo app Firebase nếu chưa được khởi tạo
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };