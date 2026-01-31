import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiLogOut, FiList, FiCheckCircle, FiClock, FiLoader } from 'react-icons/fi'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { admin, logout } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 shadow-teal">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-pale-green text-lg">Welcome, {admin?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md hover:shadow-lg"
          >
            <FiLogOut size={22} className="text-cream" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {!loading && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">Total</p>
                <div className="w-10 h-10 bg-gradient-teal rounded-full flex items-center justify-center">
                  <FiList className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-deep-teal">{stats.total}</p>
            </div>
            <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">Pending</p>
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <FiClock className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">In Progress</p>
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                  <FiLoader className="text-cream" size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
            </div>
            <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-deep-teal text-sm font-semibold">Resolved</p>
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
          className="w-full bg-gradient-primary text-cream py-5 rounded-2xl font-bold text-lg shadow-soft hover:shadow-teal transform hover:scale-105 transition-all"
        >
          View All Complaints
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
