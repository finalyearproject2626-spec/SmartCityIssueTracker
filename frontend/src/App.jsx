import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'

// User Pages
import SplashScreen from './pages/user/SplashScreen'
import LanguageSelection from './pages/user/LanguageSelection'
import Login from './pages/user/Login'
import Home from './pages/user/Home'
import RaiseComplaint from './pages/user/RaiseComplaint'
import ComplaintConfirmation from './pages/user/ComplaintConfirmation'
import MyComplaints from './pages/user/MyComplaints'
import ComplaintDetails from './pages/user/ComplaintDetails'
import Notifications from './pages/user/Notifications'
import Feedback from './pages/user/Feedback'
import Profile from './pages/user/Profile'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminComplaintDetails from './pages/admin/AdminComplaintDetails'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/language" element={<LanguageSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/raise-complaint" element={<PrivateRoute><RaiseComplaint /></PrivateRoute>} />
          <Route path="/complaint-confirmation/:id" element={<PrivateRoute><ComplaintConfirmation /></PrivateRoute>} />
          <Route path="/my-complaints" element={<PrivateRoute><MyComplaints /></PrivateRoute>} />
          <Route path="/complaint-details/:id" element={<PrivateRoute><ComplaintDetails /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/feedback/:id" element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
          <Route path="/admin/complaints" element={<AdminPrivateRoute><AdminComplaints /></AdminPrivateRoute>} />
          <Route path="/admin/complaints/:id" element={<AdminPrivateRoute><AdminComplaintDetails /></AdminPrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
