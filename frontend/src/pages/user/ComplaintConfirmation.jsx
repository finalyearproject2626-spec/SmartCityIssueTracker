import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi'

const ComplaintConfirmation = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { language } = useAuth()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplaint()
  }, [id])

  const fetchComplaint = async () => {
    try {
      const res = await api.get(`/complaints/${id}`)
      setComplaint(res.data)
    } catch (error) {
      console.error('Failed to fetch complaint:', error)
    } finally {
      setLoading(false)
    }
  }

  const translations = {
    english: {
      success: 'Complaint Registered Successfully!',
      complaintId: 'Complaint ID',
      submitted: 'Submitted on',
      category: 'Category',
      status: 'Status',
      trackComplaint: 'Track Complaint',
      backToHome: 'Back to Home'
    },
    tamil: {
      success: 'புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!',
      complaintId: 'புகார் ஐடி',
      submitted: 'சமர்ப்பிக்கப்பட்ட தேதி',
      category: 'வகை',
      status: 'நிலை',
      trackComplaint: 'புகாரைக் கண்காணி',
      backToHome: 'வீட்டிற்குத் திரும்பு'
    }
  }

  const tr = translations[language] || translations.english

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-soft">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medium-teal"></div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-soft">
        <p className="text-deep-teal">Complaint not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="bg-cream rounded-3xl shadow-soft p-8 w-full max-w-md text-center border border-pale-green">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-vibrant-green rounded-full flex items-center justify-center shadow-md">
            <FiCheckCircle className="text-cream" size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-deep-teal mb-6">{tr.success}</h2>

        <div className="text-left space-y-4 mb-8 bg-pale-green p-5 rounded-2xl">
          <div>
            <p className="text-medium-teal text-sm font-semibold mb-1">{tr.complaintId}</p>
            <p className="text-xl font-bold text-deep-teal">{complaint.complaintId}</p>
          </div>
          <div>
            <p className="text-medium-teal text-sm font-semibold mb-1">{tr.submitted}</p>
            <p className="text-lg font-semibold text-deep-teal">
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-medium-teal text-sm font-semibold mb-1">{tr.category}</p>
            <p className="text-lg font-semibold text-deep-teal">{complaint.category}</p>
          </div>
          <div>
            <p className="text-medium-teal text-sm font-semibold mb-1">{tr.status}</p>
            <span className="inline-block px-4 py-2 bg-yellow-400 text-cream rounded-full text-sm font-bold">
              {complaint.status}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/complaint-details/${id}`)}
            className="w-full bg-gradient-primary text-cream py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
          >
            {tr.trackComplaint}
            <FiArrowRight size={22} />
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-pale-green text-deep-teal py-4 rounded-2xl font-bold text-lg hover:bg-medium-teal hover:text-cream transform hover:scale-105 transition-all border-2 border-medium-teal"
          >
            {tr.backToHome}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComplaintConfirmation
