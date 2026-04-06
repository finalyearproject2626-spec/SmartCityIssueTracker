import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiPlus, FiList, FiUser, FiBell, FiCheckCircle, FiClock, FiLoader, FiMapPin, FiCamera } from 'react-icons/fi'

const Home = () => {
  const navigate = useNavigate()
  const { user, language } = useAuth()
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
      tagline: "Simplifying service requests, resolving citizens' issues",
      raiseComplaint: 'Raise a complaint',
      myComplaints: 'My Complaints',
      totalComplaints: 'Total Complaints',
      resolved: 'Resolved',
      pending: 'Pending',
      inProgress: 'In Progress',
      spot: 'Spot',
      snap: 'Snap',
      solve: 'Solve',
      notifications: 'Notifications',
      profile: 'Profile'
    },
    tamil: {
      welcome: 'வரவேற்கிறோம்',
      tagline: 'சேவை கோரிக்கைகளை எளிதாக்கி, மக்களின் சிக்கல்களைத் தீர்க்கிறோம்',
      raiseComplaint: 'புகார் செய்',
      myComplaints: 'எனது புகார்கள்',
      totalComplaints: 'மொத்த புகார்கள்',
      resolved: 'தீர்க்கப்பட்டது',
      pending: 'நிலுவையில்',
      inProgress: 'செயல்பாட்டில்',
      spot: 'கண்டறி',
      snap: 'படம் எடு',
      solve: 'தீர்க்க',
      notifications: 'அறிவிப்புகள்',
      profile: 'சுயவிவரம்'
    }
  }

  const tr = translations[language] || translations.english

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green hover:shadow-teal transform hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <p className="text-deep-teal text-xs sm:text-sm font-semibold">{label}</p>
        <div className={`w-9 h-9 sm:w-10 sm:h-10 ${color} rounded-full flex items-center justify-center`}>
          <Icon className="text-cream" size={18} />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-deep-teal">{value}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-soft pb-8">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light text-cream p-4 sm:p-6 shadow-teal">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{tr.welcome}, {user?.name}</h1>
            <p className="text-pale-green text-sm sm:text-base">{tr.tagline}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/notifications')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
              title={tr.notifications}
            >
              <FiBell size={22} className="text-cream" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
              title={tr.profile}
            >
              <FiUser size={22} className="text-cream" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* 3-Step reminder */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 py-4 bg-cream rounded-2xl border border-pale-green shadow-soft">
          <div className="flex items-center gap-1 text-deep-teal">
            <FiMapPin size={20} />
            <span className="text-sm font-semibold">{tr.spot}</span>
          </div>
          <span className="text-pale-green text-lg">→</span>
          <div className="flex items-center gap-1 text-deep-teal">
            <FiCamera size={20} />
            <span className="text-sm font-semibold">{tr.snap}</span>
          </div>
          <span className="text-pale-green text-lg">→</span>
          <div className="flex items-center gap-1 text-vibrant-green">
            <FiCheckCircle size={20} />
            <span className="text-sm font-semibold">{tr.solve}</span>
          </div>
        </div>

        {!loading && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard label={tr.totalComplaints} value={stats.total} icon={FiList} color="bg-gradient-teal" />
            <StatCard label={tr.resolved} value={stats.resolved} icon={FiCheckCircle} color="bg-vibrant-green" />
            <StatCard label={tr.pending} value={stats.pending} icon={FiClock} color="bg-yellow-400" />
            <StatCard label={tr.inProgress} value={stats.inProgress} icon={FiLoader} color="bg-orange-400" />
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-medium-teal border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => navigate('/raise-complaint')}
            className="w-full bg-gradient-primary text-cream py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-soft hover:shadow-teal hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <FiPlus size={24} />
            {tr.raiseComplaint}
          </button>

          <button
            onClick={() => navigate('/my-complaints')}
            className="w-full bg-cream text-deep-teal py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-soft border-2 border-medium-teal hover:bg-pale-green hover:border-medium-teal/80 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <FiList size={24} />
            {tr.myComplaints}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
