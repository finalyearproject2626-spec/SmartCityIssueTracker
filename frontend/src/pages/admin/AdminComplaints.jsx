import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiFilter, FiLogOut } from 'react-icons/fi'

const AdminComplaints = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', category: '' })

  useEffect(() => {
    fetchComplaints()
  }, [filters])

  const fetchComplaints = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.category) params.append('category', filters.category)

      const res = await api.get(`/admin/complaints?${params.toString()}`)
      setComplaints(res.data.complaints)
    } catch (error) {
      console.error('Failed to fetch complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-vibrant-green text-cream'
      case 'In Progress':
        return 'bg-orange-400 text-cream'
      default:
        return 'bg-yellow-400 text-cream'
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 flex items-center justify-between shadow-teal">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/dashboard')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
            <FiArrowLeft size={22} className="text-cream" />
          </button>
          <h1 className="text-2xl font-bold">All Complaints</h1>
        </div>
        <button
          onClick={handleLogout}
          className="p-3 bg-medium-teal hover:bg-teal-light rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          title="Logout"
        >
          <FiLogOut size={20} className="text-cream" />
          <span className="hidden sm:inline text-cream font-semibold">Logout</span>
        </button>
      </div>

      <div className="p-6">
        <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green mb-6">
          <div className="flex gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="flex-1 px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal font-semibold"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="flex-1 px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal font-semibold"
            >
              <option value="">All Categories</option>
              <option value="Road">Road</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Waste">Waste</option>
              <option value="Drainage">Drainage</option>
              <option value="Street Light">Street Light</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medium-teal"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-cream rounded-2xl shadow-soft border border-pale-green">
            <p className="text-deep-teal text-lg font-semibold">No complaints found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                onClick={() => navigate(`/admin/complaints/${complaint._id}`)}
                className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green cursor-pointer hover:shadow-teal transform hover:scale-105 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-medium-teal font-semibold mb-1">Complaint ID</p>
                    <p className="font-bold text-deep-teal text-lg">{complaint.complaintId}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-medium-teal font-semibold mb-1">Category</p>
                  <p className="font-semibold text-deep-teal">{complaint.category}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-medium-teal font-semibold mb-1">User</p>
                  <p className="font-semibold text-deep-teal">{complaint.userId?.name || 'N/A'}</p>
                </div>
                <p className="text-xs text-medium-teal mt-3">
                  {new Date(complaint.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminComplaints
