import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // تحميل بيانات المستخدم عند بدء التطبيق
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setIsLoggedIn(true);
      loadUserTasks(savedUser);
    }
  }, []);

  const loadUserTasks = (userEmail) => {
    const savedTasks = localStorage.getItem(`tasks_${userEmail}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (isRegistering) {
      // تسجيل حساب جديد
      localStorage.setItem('user_' + email, password);
      localStorage.setItem('currentUser', email);
      setIsLoggedIn(true);
      alert('تم إنشاء حسابك بنجاح!');
    } else {
      // تسجيل الدخول
      const savedPassword = localStorage.getItem('user_' + email);
      if (savedPassword === password) {
        localStorage.setItem('currentUser', email);
        setIsLoggedIn(true);
        loadUserTasks(email);
      } else if (email === 'demo@test.com' && password === '123456') {
        // حساب تجريبي
        localStorage.setItem('currentUser', email);
        setIsLoggedIn(true);
      } else {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    localStorage.removeItem('currentUser');
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const updatedTasks = [...tasks, { 
        id: Date.now(), 
        text: newTask,
        completed: false 
      }];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
    saveTasks(filteredTasks);
  };

  const saveTasks = (tasksArray) => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasksArray));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>🔐 تسجيل الدخول</h1>
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                required
              />
            </div>
            
            <button type="submit" className="auth-btn">
              {isRegistering ? 'إنشاء حساب' : 'تسجيل الدخول'}
            </button>
          </form>
          
          <div className="demo-section">
            <button 
              onClick={() => {
                setEmail('demo@test.com');
                setPassword('123456');
                setTimeout(() => {
                  localStorage.setItem('currentUser', 'demo@test.com');
                  setIsLoggedIn(true);
                }, 100);
              }}
              className="demo-btn"
            >
              دخول تجريبي سريع
            </button>
            <p className="demo-info">البريد: demo@test.com | كلمة المرور: 123456</p>
          </div>
          
          <button 
            className="toggle-btn"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'لديك حساب؟ سجل دخول' : 'إنشاء حساب جديد'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="user-info">
          <span className="user-avatar">
            {localStorage.getItem('currentUser')?.charAt(0).toUpperCase() || 'U'}
          </span>
          <span className="user-email">{localStorage.getItem('currentUser')}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          تسجيل الخروج
        </button>
      </div>
      
      <h1>📝 مدير المهام</h1>
      
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="أضف مهمة جديدة..."
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>إضافة</button>
      </div>
      
      <div className="tasks">
        {tasks.length === 0 ? (
          <p className="no-tasks">لا توجد مهام بعد. أضف أول مهمة!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span>{task.text}</span>
              <button onClick={() => deleteTask(task.id)} className="delete-btn">
                حذف
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="stats">
        <p>المهام الكلية: {tasks.length}</p>
        <p>المكتملة: {tasks.filter(t => t.completed).length}</p>
        <p>المتبقية: {tasks.filter(t => !t.completed).length}</p>
      </div>
    </div>
  );
}

export default App;