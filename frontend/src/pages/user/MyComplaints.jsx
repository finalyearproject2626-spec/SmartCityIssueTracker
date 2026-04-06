import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiClock, FiCheckCircle, FiLoader } from 'react-icons/fi'
import { complaintCategoryLabel, complaintStatusLabel } from '../../utils/complaintLabels'

const MyComplaints = () => {
  const navigate = useNavigate()
  const { language } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints/my-complaints')
      setComplaints(res.data)
    } catch (error) {
      console.error('Failed to fetch complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <FiCheckCircle className="text-vibrant-green" size={24} />
      case 'In Progress':
        return <FiLoader className="text-orange-500" size={24} />
      case 'Rejected':
        return <FiClock className="text-red-500" size={24} />
      default:
        return <FiClock className="text-yellow-500" size={24} />
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

  const translations = {
    english: {
      title: 'My Complaints',
      noComplaints: 'No complaints yet',
      raiseComplaint: 'Raise a complaint',
      complaintId: 'Complaint ID',
      category: 'Category',
      status: 'Status',
      date: 'Date'
    },
    tamil: {
      title: 'எனது புகார்கள்',
      noComplaints: 'இன்னும் புகார்கள் இல்லை',
      raiseComplaint: 'புகார் செய்',
      complaintId: 'புகார் ஐடி',
      category: 'வகை',
      status: 'நிலை',
      date: 'தேதி'
    }
  }

  const tr = translations[language] || translations.english

  return (
    <div className="min-h-screen bg-gradient-soft pb-8">
      <div className="bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light text-cream p-4 sm:p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/home')} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">{tr.title}</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-medium-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <div className="bg-cream p-8 rounded-2xl shadow-soft border border-pale-green text-center">
            <p className="text-deep-teal text-lg mb-6 font-semibold">{tr.noComplaints}</p>
            <button
              onClick={() => navigate('/raise-complaint')}
              className="bg-gradient-primary text-cream px-8 py-4 rounded-2xl font-bold hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
            >
              {tr.raiseComplaint}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              onClick={() => navigate(`/complaint-details/${complaint._id}`)}
              className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green cursor-pointer hover:shadow-teal hover:border-medium-teal/30 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-medium-teal font-semibold mb-1">{tr.complaintId}</p>
                  <p className="font-bold text-deep-teal text-lg">{complaint.complaintId}</p>
                </div>
                {getStatusIcon(complaint.status)}
              </div>
              <div className="mt-3">
                <p className="text-sm text-medium-teal font-semibold mb-1">{tr.category}</p>
                <p className="font-semibold text-deep-teal">{complaintCategoryLabel(language, complaint.category)}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(complaint.status)}`}>
                  {complaintStatusLabel(language, complaint.status)}
                </span>
                <span className="text-sm text-medium-teal font-semibold">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyComplaints
