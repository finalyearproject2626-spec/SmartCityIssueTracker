import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// User Pages
import LandingPage from './pages/user/LandingPage'
import SplashScreen from './pages/user/SplashScreen'
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
        <div className="min-h-screen flex flex-col bg-gradient-soft">
          <Navbar />
          <main className="flex-1">
            <Routes>
          {/* User Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/splash" element={<SplashScreen />} />
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
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
