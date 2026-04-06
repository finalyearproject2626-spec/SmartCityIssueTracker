import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft } from 'react-icons/fi'
import { complaintCategoryLabel, complaintStatusLabel } from '../../utils/complaintLabels'

const AdminComplaints = () => {
  const navigate = useNavigate()
  const { language } = useAuth()
  const isTa = language === 'tamil'
  const tr = {
    title: isTa ? 'அனைத்துப் புகார்கள்' : 'All complaints',
    allStatus: isTa ? 'அனைத்து நிலைகள்' : 'All status',
    allCategories: isTa ? 'அனைத்து வகைகள்' : 'All categories',
    noComplaints: isTa ? 'புகார்கள் எதுவும் இல்லை' : 'No complaints found',
    complaintId: isTa ? 'புகார் ஐடி' : 'Complaint ID',
    category: isTa ? 'வகை' : 'Category',
    user: isTa ? 'பயனர்' : 'User',
    pending: isTa ? 'நிலுவையில்' : 'Pending',
    inProgress: isTa ? 'செயல்பாட்டில்' : 'In Progress',
    rejected: isTa ? 'நிராகரிக்கப்பட்டது' : 'Rejected',
    resolved: isTa ? 'தீர்க்கப்பட்டது' : 'Resolved'
  }
  const categories = ['Road', 'Water', 'Electricity', 'Waste', 'Drainage', 'Street Light', 'Other']
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
      case 'Rejected':
        return 'bg-red-500 text-cream'
      default:
        return 'bg-yellow-400 text-cream'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-8">
      <div className="bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light text-cream p-4 sm:p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/admin/dashboard')} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">{tr.title}</h1>
      </div>

      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="flex-1 px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal font-semibold"
            >
              <option value="">{tr.allStatus}</option>
              <option value="Pending">{tr.pending}</option>
              <option value="In Progress">{tr.inProgress}</option>
              <option value="Rejected">{tr.rejected}</option>
              <option value="Resolved">{tr.resolved}</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="flex-1 px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal font-semibold"
            >
              <option value="">{tr.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {complaintCategoryLabel(language, cat)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medium-teal"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-cream rounded-2xl shadow-soft border border-pale-green">
            <p className="text-deep-teal text-lg font-semibold">{tr.noComplaints}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                onClick={() => navigate(`/admin/complaints/${complaint._id}`)}
                className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green cursor-pointer hover:shadow-teal hover:border-medium-teal/30 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-medium-teal font-semibold mb-1">{tr.complaintId}</p>
                    <p className="font-bold text-deep-teal text-lg">{complaint.complaintId}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(complaint.status)}`}>
                    {complaintStatusLabel(language, complaint.status)}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-medium-teal font-semibold mb-1">{tr.category}</p>
                  <p className="font-semibold text-deep-teal">{complaintCategoryLabel(language, complaint.category)}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-medium-teal font-semibold mb-1">{tr.user}</p>
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
