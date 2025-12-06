import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// ⚠️ TODO: انسخ إعدادات Firebase الحقيقية هنا من الموقع
// اتبع الخطوات في التعليقات أدناه للحصول على الإعدادات

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// أو استخدم هذه الإعدادات المؤقتة للاختبار (قد لا تعمل)
const demoFirebaseConfig = {
  apiKey: "demo-key-for-testing",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project-123",
  storageBucket: "demo-project-123.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// استخدم هذا للاختبار أولاً
const app = initializeApp(demoFirebaseConfig);
const auth = getAuth(app);

export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
};

// للحصول على إعدادات Firebase الحقيقية:
// 1. اذهب إلى console.firebase.google.com
// 2. اختر مشروعك
// 3. ⚙️ → Project settings
// 4. انسخ الكود من "Your apps"