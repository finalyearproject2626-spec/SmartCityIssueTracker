import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'english')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const adminToken = localStorage.getItem('adminToken')
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else if (adminToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`
      fetchAdmin()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me')
      setUser(res.data)
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const fetchAdmin = async () => {
    try {
      const res = await axios.get('/api/admin/me')
      setAdmin(res.data)
    } catch (error) {
      localStorage.removeItem('adminToken')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  const adminLogin = (token, adminData) => {
    localStorage.setItem('adminToken', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminToken')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setAdmin(null)
  }

  const updateLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const translations = {
    english: {
      splash: 'Smart City Issue Tracker',
      selectLanguage: 'Select Language',
      login: 'Login',
      register: 'Register',
      home: 'Home',
      raiseComplaint: 'Raise a Complaint',
      myComplaints: 'My Complaints',
      profile: 'Profile',
      logout: 'Logout'
    },
    tamil: {
      splash: 'ஸ்மார்ட் சிட்டி சிக்கல் டிராக்கர்',
      selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
      login: 'உள்நுழை',
      register: 'பதிவு செய்',
      home: 'வீடு',
      raiseComplaint: 'புகாரை உயர்த்தவும்',
      myComplaints: 'எனது புகார்கள்',
      profile: 'சுயவிவரம்',
      logout: 'வெளியேறு'
    }
  }

  const t = (key) => {
    return translations[language]?.[key] || translations.english[key] || key
  }

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      loading,
      language,
      login,
      adminLogin,
      logout,
      updateLanguage,
      t
    }}>
      {children}
    </AuthContext.Provider>
  )
}
