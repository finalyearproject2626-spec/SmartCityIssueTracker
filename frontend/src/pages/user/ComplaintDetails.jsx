import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiClock, FiCheckCircle, FiLoader, FiMapPin } from 'react-icons/fi'
import ImageViewer from '../../components/ImageViewer'
import { complaintCategoryLabel, complaintStatusLabel } from '../../utils/complaintLabels'

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
      case 'Rejected':
        return 'bg-red-100 text-red-800'
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
      case 'Rejected':
        return <FiClock className="text-red-600" size={24} />
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
      images: 'Images',
      notFound: 'Complaint not found'
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
      images: 'படங்கள்',
      notFound: 'புகார் கிடைக்கவில்லை'
    }
  }

  const tr = translations[language] || translations.english

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-medium-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-deep-teal font-semibold">{tr.notFound}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-8">
      <div className="bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light text-cream p-4 sm:p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/my-complaints')} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">{tr.complaintDetails}</h1>
      </div>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
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
              <p className="font-semibold text-deep-teal">{complaintCategoryLabel(language, complaint.category)}</p>
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
                complaint.status === 'Rejected' ? 'bg-red-500 text-cream' :
                'bg-yellow-400 text-cream'
              }`}>
                {complaintStatusLabel(language, complaint.status)}
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

        <ImageViewer images={complaint.images || []} title={tr.images} altPrefix="Complaint" />

        {complaint.officerRemarks && (
          <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
            <p className="font-bold text-xl mb-3 text-deep-teal">{tr.officerRemarks}</p>
            <p className="text-deep-teal bg-pale-green p-4 rounded-xl">{complaint.officerRemarks}</p>
          </div>
        )}

        {complaint.resolutionProof && complaint.resolutionProof.length > 0 && (
          <ImageViewer images={complaint.resolutionProof} title={tr.resolutionProof} altPrefix="Proof" />
        )}

        {complaint.status === 'Resolved' && !complaint.feedback && (
          <button
            onClick={() => navigate(`/feedback/${id}`)}
            className="w-full bg-gradient-primary text-cream py-4 sm:py-5 rounded-2xl font-bold text-lg hover:shadow-teal transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md"
          >
            {tr.giveFeedback}
          </button>
        )}
      </div>
    </div>
  )
}

export default ComplaintDetails
