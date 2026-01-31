import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiClock, FiCheckCircle, FiLoader } from 'react-icons/fi'

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
      default:
        return 'bg-yellow-400 text-cream'
    }
  }

  const translations = {
    english: {
      title: 'My Complaints',
      noComplaints: 'No complaints yet',
      raiseComplaint: 'Raise a Complaint',
      complaintId: 'Complaint ID',
      category: 'Category',
      status: 'Status',
      date: 'Date'
    },
    tamil: {
      title: 'எனது புகார்கள்',
      noComplaints: 'இன்னும் புகார்கள் இல்லை',
      raiseComplaint: 'புகாரை உயர்த்தவும்',
      complaintId: 'புகார் ஐடி',
      category: 'வகை',
      status: 'நிலை',
      date: 'தேதி'
    }
  }

  const tr = translations[language] || translations.english

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/home')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-2xl font-bold">{tr.title}</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medium-teal"></div>
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
        <div className="p-6 space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              onClick={() => navigate(`/complaint-details/${complaint._id}`)}
              className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green cursor-pointer hover:shadow-teal transform hover:scale-105 transition-all"
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
                <p className="font-semibold text-deep-teal">{complaint.category}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
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
