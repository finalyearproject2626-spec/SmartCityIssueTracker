import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiPlus, FiList, FiUser, FiBell, FiCheckCircle, FiClock, FiLoader } from 'react-icons/fi'

const Home = () => {
  const navigate = useNavigate()
  const { user, logout, language, t } = useAuth()
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, inProgress: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/complaints/stats/summary')
      setStats(res.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const translations = {
    english: {
      welcome: 'Welcome',
      raiseComplaint: 'Raise a Complaint',
      myComplaints: 'My Complaints',
      profile: 'Profile',
      notifications: 'Notifications',
      totalComplaints: 'Total Complaints',
      resolved: 'Resolved',
      pending: 'Pending',
      inProgress: 'In Progress',
      logout: 'Logout'
    },
    tamil: {
      welcome: 'வரவேற்கிறோம்',
      raiseComplaint: 'புகாரை உயர்த்தவும்',
      myComplaints: 'எனது புகார்கள்',
      profile: 'சுயவிவரம்',
      notifications: 'அறிவிப்புகள்',
      totalComplaints: 'மொத்த புகார்கள்',
      resolved: 'தீர்க்கப்பட்டது',
      pending: 'நிலுவையில்',
      inProgress: 'செயல்பாட்டில்',
      logout: 'வெளியேறு'
    }
  }

  const tr = translations[language] || translations.english

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 shadow-teal">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">{tr.welcome}</h1>
            <p className="text-pale-green text-lg">{user?.name}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/notifications')}
              className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <FiBell size={22} className="text-cream" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <FiUser size={22} className="text-cream" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!loading && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">{tr.totalComplaints}</p>
                <div className="w-10 h-10 bg-gradient-teal rounded-full flex items-center justify-center">
                  <FiList className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-deep-teal">{stats.total}</p>
            </div>
            <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">{tr.resolved}</p>
                <div className="w-10 h-10 bg-vibrant-green rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-vibrant-green">{stats.resolved}</p>
            </div>
            <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">{tr.pending}</p>
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <FiClock className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">{tr.inProgress}</p>
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                  <FiLoader className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => navigate('/raise-complaint')}
            className="w-full bg-gradient-primary text-cream py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-soft hover:shadow-teal transform hover:scale-105 transition-all"
          >
            <FiPlus size={26} />
            {tr.raiseComplaint}
          </button>

          <button
            onClick={() => navigate('/my-complaints')}
            className="w-full bg-cream text-deep-teal py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-soft border-2 border-medium-teal hover:bg-pale-green transform hover:scale-105 transition-all"
          >
            <FiList size={26} />
            {tr.myComplaints}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
