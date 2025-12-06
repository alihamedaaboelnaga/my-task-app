import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from './firebase';
import './App.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        // تسجيل حساب جديد
        await createUserWithEmailAndPassword(auth, email, password);
        alert('🎉 تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setEmail('');
        setPassword('');
        setIsRegistering(false);
      } else {
        // تسجيل الدخول
        await signInWithEmailAndPassword(auth, email, password);
        onLogin(email);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // عرض رسائل خطأ مفهومة
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('البريد الإلكتروني مستخدم بالفعل');
          break;
        case 'auth/invalid-email':
          setError('بريد إلكتروني غير صالح');
          break;
        case 'auth/weak-password':
          setError('كلمة المرور ضعيفة (يجب أن تكون 6 أحرف على الأقل)');
          break;
        case 'auth/user-not-found':
          setError('لا يوجد حساب بهذا البريد الإلكتروني');
          break;
        case 'auth/wrong-password':
          setError('كلمة المرور غير صحيحة');
          break;
        case 'auth/too-many-requests':
          setError('تم تجاوز عدد المحاولات، حاول مرة أخرى لاحقاً');
          break;
        default:
          setError('حدث خطأ، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // محاولة تسجيل الدخول بحساب تجريبي
      await signInWithEmailAndPassword(auth, 'demo@taskapp.com', 'demopassword123');
      onLogin('demo@taskapp.com');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // إنشاء حساب تجريبي إذا لم يكن موجوداً
        try {
          await createUserWithEmailAndPassword(auth, 'demo@taskapp.com', 'demopassword123');
          await signInWithEmailAndPassword(auth, 'demo@taskapp.com', 'demopassword123');
          onLogin('demo@taskapp.com');
        } catch (createError) {
          setError('تعذر إنشاء الحساب التجريبي');
        }
      } else {
        setError('تعذر تسجيل الدخول بالحساب التجريبي');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="auth-header">
          <h1>🔥 TaskFlow</h1>
          <h2>{isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
          <p className="auth-subtitle">
            {isRegistering 
              ? 'أنشئ حسابك لبدء إدارة مهامك' 
              : 'سجل دخولك للوصول إلى مهامك'}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
              disabled={loading}
            />
            {isRegistering && (
              <small className="password-hint">
                يجب أن تكون 6 أحرف على الأقل
              </small>
            )}
          </div>
          
          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">⌛</span>
            ) : (
              isRegistering ? 'إنشاء حساب' : 'تسجيل الدخول'
            )}
          </button>
        </form>

        <div className="divider">
          <span>أو</span>
        </div>

        <div className="quick-actions">
          <button 
            onClick={handleDemoLogin}
            className="demo-btn"
            disabled={loading}
          >
            {loading ? 'جاري التحضير...' : '🚀 تجربة سريعة (ديمو)'}
          </button>
          
          <p className="demo-note">
            سيتم إنشاء حساب تجريبي تلقائياً مع بيانات وهمية
          </p>
        </div>

        <div className="auth-footer">
          <p>
            {isRegistering 
              ? 'لديك حساب بالفعل؟' 
              : 'ليس لديك حساب؟'}
            <button 
              className="toggle-auth-btn"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              disabled={loading}
            >
              {isRegistering ? 'سجل دخول' : 'إنشاء حساب جديد'}
            </button>
          </p>
        </div>

        <div className="features-list">
          <h4>مميزات التطبيق:</h4>
          <ul>
            <li>✅ تسجيل دخول حقيقي باستخدام Firebase</li>
            <li>✅ حفظ مهام كل مستخدم بشكل منفصل</li>
            <li>✅ بيانات آمنة ومشفرة</li>
            <li>✅ إمكانية استعادة كلمة المرور</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;