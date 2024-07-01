import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
// import axios from 'axios';
import Login from './components/auth/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import UserDashboard from './components/user/UserDashboard';
import Register from './components/auth/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from './components/middleware/axiosInstance';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance.get('/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setUserRole(response.data.role); 
        setIsLoggedIn(true);
      })
      .catch(error => {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false); 
        setUserRole(''); 
      });
    } else {
      setIsLoggedIn(false); 
      setUserRole(''); 
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const role = localStorage.getItem('role');
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole('');
    toast.info('Logged out successfully');
  };

  return (
    <Router>
      <div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <nav className="bg-gray-800 p-4 text-white">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">To-Do App</Link>
            {isLoggedIn && (
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                Logout
              </button>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to={`/${userRole.toLowerCase()}`} /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to={`/${userRole.toLowerCase()}`} />} />
          <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to={`/${userRole.toLowerCase()}`} />} />
          <Route path="/admin" element={isLoggedIn  ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/manager" element={isLoggedIn ? <ManagerDashboard /> : <Navigate to="/login" />} />
          <Route path="/user" element={isLoggedIn ? <UserDashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
