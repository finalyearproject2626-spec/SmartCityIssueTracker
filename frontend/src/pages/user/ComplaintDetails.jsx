import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiClock, FiCheckCircle, FiLoader, FiMapPin } from 'react-icons/fi'

const ComplaintDetails = () => {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <FiCheckCircle className="text-green-600" size={24} />
      case 'In Progress':
        return <FiLoader className="text-orange-600" size={24} />
      default:
        return <FiClock className="text-yellow-600" size={24} />
    }
  }

  const translations = {
    english: {
      complaintDetails: 'Complaint Details',
      complaintId: 'Complaint ID',
      category: 'Category',
      description: 'Description',
      status: 'Status',
      location: 'Location',
      submitted: 'Submitted on',
      officerRemarks: 'Officer Remarks',
      resolutionProof: 'Resolution Proof',
      noRemarks: 'No remarks yet',
      noProof: 'No resolution proof yet',
      giveFeedback: 'Give Feedback',
      images: 'Images'
    },
    tamil: {
      complaintDetails: 'புகார் விவரங்கள்',
      complaintId: 'புகார் ஐடி',
      category: 'வகை',
      description: 'விளக்கம்',
      status: 'நிலை',
      location: 'இடம்',
      submitted: 'சமர்ப்பிக்கப்பட்ட தேதி',
      officerRemarks: 'அதிகாரி கருத்துகள்',
      resolutionProof: 'தீர்வு ஆதாரம்',
      noRemarks: 'இன்னும் கருத்துகள் இல்லை',
      noProof: 'இன்னும் தீர்வு ஆதாரம் இல்லை',
      giveFeedback: 'கருத்து தெரிவிக்கவும்',
      images: 'படங்கள்'
    }
  }

  const tr = translations[language] || translations.english

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Complaint not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/my-complaints')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-2xl font-bold">{tr.complaintDetails}</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.complaintId}</p>
              <p className="font-bold text-deep-teal text-lg">{complaint.complaintId}</p>
            </div>
            {getStatusIcon(complaint.status)}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.category}</p>
              <p className="font-semibold text-deep-teal">{complaint.category}</p>
            </div>

            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.description}</p>
              <p className="font-semibold text-deep-teal">{complaint.description}</p>
            </div>

            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.status}</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                complaint.status === 'Resolved' ? 'bg-vibrant-green text-cream' :
                complaint.status === 'In Progress' ? 'bg-orange-400 text-cream' :
                'bg-yellow-400 text-cream'
              }`}>
                {complaint.status}
              </span>
            </div>

            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.submitted}</p>
              <p className="font-semibold text-deep-teal">{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>

            {complaint.location && (
              <div>
                <p className="text-sm text-medium-teal font-semibold mb-1">{tr.location}</p>
                <p className="font-semibold text-deep-teal flex items-center gap-2">
                  <FiMapPin size={18} className="text-medium-teal" />
                  {complaint.location.address || `${complaint.location.latitude}, ${complaint.location.longitude}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {complaint.images && complaint.images.length > 0 && (
          <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
            <p className="font-bold text-xl mb-4 text-deep-teal">{tr.images}</p>
            <div className="grid grid-cols-2 gap-2">
              {complaint.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.startsWith('http') ? img : `http://localhost:5001/uploads/${img}`}
                  alt={`Complaint ${idx + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        {complaint.officerRemarks && (
          <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
            <p className="font-bold text-xl mb-3 text-deep-teal">{tr.officerRemarks}</p>
            <p className="text-deep-teal bg-pale-green p-4 rounded-xl">{complaint.officerRemarks}</p>
          </div>
        )}

        {complaint.resolutionProof && complaint.resolutionProof.length > 0 && (
          <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
            <p className="font-bold text-xl mb-4 text-deep-teal">{tr.resolutionProof}</p>
            <div className="grid grid-cols-2 gap-2">
              {complaint.resolutionProof.map((proof, idx) => (
                <img
                  key={idx}
                  src={proof.startsWith('http') ? proof : `http://localhost:5001/uploads/${proof}`}
                  alt={`Proof ${idx + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        {complaint.status === 'Resolved' && !complaint.feedback && (
          <button
            onClick={() => navigate(`/feedback/${id}`)}
            className="w-full bg-gradient-primary text-cream py-5 rounded-2xl font-bold text-lg hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
          >
            {tr.giveFeedback}
          </button>
        )}
      </div>
    </div>
  )
}

export default ComplaintDetails
