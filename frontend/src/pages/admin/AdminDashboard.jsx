import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiList, FiCheckCircle, FiClock, FiLoader, FiXCircle } from 'react-icons/fi'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { admin, language } = useAuth()
  const isTa = language === 'tamil'
  const tr = {
    title: isTa ? 'நிர்வாக டாஷ்போர்ட்' : 'Admin Dashboard',
    welcome: isTa ? 'வரவேற்கிறோம்' : 'Welcome',
    total: isTa ? 'மொத்தம்' : 'Total',
    pending: isTa ? 'நிலுவையில்' : 'Pending',
    inProgress: isTa ? 'செயல்பாட்டில்' : 'In Progress',
    rejected: isTa ? 'நிராகரிக்கப்பட்டது' : 'Rejected',
    resolved: isTa ? 'தீர்க்கப்பட்டது' : 'Resolved',
    viewAll: isTa ? 'அனைத்துப் புகார்களையும் காண்க' : 'View all complaints'
  }
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    rejected: 0,
    resolved: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard/stats')
      setStats(res.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-8">
      <div className="bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light text-cream p-4 sm:p-6 shadow-teal">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{tr.title}</h1>
          <p className="text-pale-green">{tr.welcome}, {admin?.name}</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green hover:shadow-teal transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">{tr.total}</p>
                <div className="w-10 h-10 bg-gradient-teal rounded-full flex items-center justify-center">
                  <FiList className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-deep-teal">{stats.total}</p>
            </div>
            <div className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green hover:shadow-teal transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">{tr.pending}</p>
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <FiClock className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green hover:shadow-teal transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">{tr.inProgress}</p>
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                  <FiLoader className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
            </div>
            <div className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green hover:shadow-teal transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">{tr.rejected}</p>
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <FiXCircle className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.rejected ?? 0}</p>
            </div>
            <div className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green hover:shadow-teal transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">{tr.resolved}</p>
                <div className="w-10 h-10 bg-vibrant-green rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-vibrant-green">{stats.resolved}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/admin/complaints')}
          className="w-full bg-gradient-primary text-cream py-4 sm:py-5 rounded-2xl font-bold text-lg shadow-soft hover:shadow-teal transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          {tr.viewAll}
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
