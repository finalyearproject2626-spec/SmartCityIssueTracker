import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiUpload } from 'react-icons/fi'
import ImageViewer from '../../components/ImageViewer'
import ImageUploadWithCamera from '../../components/ImageUploadWithCamera'
import { complaintCategoryLabel, complaintStatusLabel } from '../../utils/complaintLabels'

const AdminComplaintDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { language } = useAuth()
  const isTa = language === 'tamil'
  const tr = {
    complaintDetails: isTa ? 'புகார் விவரங்கள்' : 'Complaint details',
    errorLoading: isTa ? 'புகாரை ஏற்ற முடியவில்லை' : 'Error loading complaint',
    retry: isTa ? 'மீண்டும் முயற்சி' : 'Retry',
    complaintNotFound: isTa ? 'புகார் கிடைக்கவில்லை' : 'Complaint not found',
    backToComplaints: isTa ? 'புகார்களுக்குத் திரும்பு' : 'Back to complaints',
    complaintInfo: isTa ? 'புகார் தகவல்' : 'Complaint information',
    complaintId: isTa ? 'புகார் ஐடி' : 'Complaint ID',
    category: isTa ? 'வகை' : 'Category',
    description: isTa ? 'விளக்கம்' : 'Description',
    noDescription: isTa ? 'விளக்கம் இல்லை' : 'No description',
    user: isTa ? 'பயனர்' : 'User',
    na: isTa ? 'இல்லை' : 'N/A',
    submitted: isTa ? 'சமர்ப்பிக்கப்பட்டது' : 'Submitted',
    status: isTa ? 'நிலை' : 'Status',
    resolvedOn: isTa ? 'தீர்க்கப்பட்ட தேதி' : 'Resolved on',
    location: isTa ? 'இடம்' : 'Location',
    complaintImages: isTa ? 'புகார் படங்கள்' : 'Complaint images',
    updateStatus: isTa ? 'நிலையைப் புதுப்பி' : 'Update status',
    officerRemarks: isTa ? 'அதிகாரி கருத்துகள்' : 'Officer remarks',
    enterRemarksPlaceholder: isTa ? 'கருத்துகளை உள்ளிடவும்...' : 'Enter remarks...',
    updating: isTa ? 'புதுப்பிக்கிறது...' : 'Updating...',
    uploadResolutionProof: isTa ? 'தீர்வு ஆதாரத்தைப் பதிவேற்று' : 'Upload resolution proof',
    uploadProofHint: isTa ? 'செயல்முறை முடிந்தது. சாதனத்திலிருந்து அல்லது கேமராவில் பிடிக்கவும்.' : 'Process is complete. Upload from device or capture from camera.',
    addProofImages: isTa ? 'ஆதார படங்களைச் சேர்' : 'Add proof images',
    uploading: isTa ? 'பதிவேற்றுகிறது...' : 'Uploading...',
    uploadProof: isTa ? 'ஆதாரத்தைப் பதிவேற்று' : 'Upload proof',
    resolutionProof: isTa ? 'தீர்வு ஆதாரம்' : 'Resolution proof',
    noProofYet: isTa ? 'இன்னும் தீர்வு ஆதாரம் பதிவேற்றப்படவில்லை' : 'No resolution proof uploaded yet',
    userFeedback: isTa ? 'பயனர் கருத்து' : 'User feedback',
    rating: isTa ? 'மதிப்பீடு' : 'Rating',
    alertStatusOk: isTa ? 'நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது' : 'Status updated successfully',
    alertStatusFail: isTa ? 'நிலையைப் புதுப்பிக்க முடியவில்லை' : 'Failed to update status',
    alertProofOk: isTa ? 'தீர்வு ஆதாரம் வெற்றிகரமாக பதிவேற்றப்பட்டது' : 'Resolution proof uploaded successfully',
    alertProofFail: isTa ? 'ஆதாரத்தைப் பதிவேற்ற முடியவில்லை' : 'Failed to upload proof',
    errorEmpty: isTa ? 'புகார் தகவல் காலியாக உள்ளது' : 'Complaint data is empty',
    errorLoad: isTa ? 'புகாரை ஏற்ற முடியவில்லை' : 'Failed to load complaint',
    pending: isTa ? 'நிலுவையில்' : 'Pending',
    inProgress: isTa ? 'செயல்பாட்டில்' : 'In Progress',
    rejected: isTa ? 'நிராகரிக்கப்பட்டது' : 'Rejected',
    resolved: isTa ? 'தீர்க்கப்பட்டது' : 'Resolved'
  }
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')
  const [remarks, setRemarks] = useState('')
  const [proofFiles, setProofFiles] = useState([])
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (id) {
      fetchComplaint()
    }
  }, [id])

  const fetchComplaint = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get(`/admin/complaints/${id}`)
      if (res.data) {
        setComplaint(res.data)
        setStatus(res.data.status || 'Pending')
        setRemarks(res.data.officerRemarks || '')
      } else {
        setError(tr.errorEmpty)
      }
    } catch (error) {
      console.error('Failed to fetch complaint:', error)
      setError(error.response?.data?.message || error.message || tr.errorLoad)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    setUpdating(true)
    try {
      await api.put(`/admin/complaints/${id}/status`, { status, officerRemarks: remarks })
      await fetchComplaint()
      alert(tr.alertStatusOk)
    } catch (error) {
      console.error('Failed to update status:', error)
      alert(tr.alertStatusFail)
    } finally {
      setUpdating(false)
    }
  }

  const handleProofUpload = async (e) => {
    e.preventDefault()
    if (proofFiles.length === 0) return

    setUpdating(true)
    try {
      const formData = new FormData()
      proofFiles.forEach((file) => {
        formData.append('proof', file)
      })

      await api.post(`/admin/complaints/${id}/resolution-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      await fetchComplaint()
      setProofFiles([])
      alert(tr.alertProofOk)
    } catch (error) {
      console.error('Failed to upload proof:', error)
      alert(tr.alertProofFail)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-soft">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medium-teal"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <div className="bg-gradient-teal text-cream p-6 flex items-center gap-4 shadow-teal">
          <button onClick={() => navigate('/admin/complaints')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
            <FiArrowLeft size={22} className="text-cream" />
          </button>
          <h1 className="text-2xl font-bold">{tr.complaintDetails}</h1>
        </div>
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="bg-cream border-2 border-red-300 text-red-700 px-8 py-6 rounded-2xl max-w-md shadow-soft">
            <h2 className="font-bold text-xl mb-3 text-deep-teal">{tr.errorLoading}</h2>
            <p className="mb-6 text-medium-teal">{error}</p>
            <button
              onClick={fetchComplaint}
              className="bg-gradient-primary text-cream px-6 py-3 rounded-xl font-bold hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
            >
              {tr.retry}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <div className="bg-gradient-teal text-cream p-6 flex items-center gap-4 shadow-teal">
          <button onClick={() => navigate('/admin/complaints')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
            <FiArrowLeft size={22} className="text-cream" />
          </button>
          <h1 className="text-2xl font-bold">{tr.complaintDetails}</h1>
        </div>
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="bg-cream p-8 rounded-2xl shadow-soft border border-pale-green text-center">
            <p className="text-deep-teal text-lg mb-6 font-semibold">{tr.complaintNotFound}</p>
            <button
              onClick={() => navigate('/admin/complaints')}
              className="bg-gradient-primary text-cream px-6 py-3 rounded-xl font-bold hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
            >
              {tr.backToComplaints}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/admin/complaints')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-2xl font-bold">{tr.complaintDetails}</h1>
      </div>

      <div className="relative z-10 p-6 space-y-6 pb-10">
        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <h2 className="font-bold text-xl mb-5 text-deep-teal">{tr.complaintInfo}</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.complaintId}</p>
              <p className="font-bold text-deep-teal text-lg">{complaint.complaintId || tr.na}</p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.category}</p>
              <p className="font-bold text-deep-teal">{complaintCategoryLabel(language, complaint.category) || tr.na}</p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.description}</p>
              <p className="font-semibold text-deep-teal">{complaint.description || tr.noDescription}</p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.user}</p>
              <p className="font-semibold text-deep-teal">
                {complaint.userId?.name || tr.na} ({complaint.userId?.email || tr.na})
              </p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.submitted}</p>
              <p className="font-semibold text-deep-teal">{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">{tr.status}</p>
              <p className="font-semibold">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  complaint.status === 'Resolved' ? 'bg-vibrant-green text-cream' :
                  complaint.status === 'In Progress' ? 'bg-orange-400 text-cream' :
                  complaint.status === 'Rejected' ? 'bg-red-500 text-cream' :
                  'bg-yellow-400 text-cream'
                }`}>
                  {complaintStatusLabel(language, complaint.status)}
                </span>
              </p>
            </div>
            {complaint.resolvedAt && (
              <div>
                <p className="text-sm text-medium-teal font-semibold mb-1">{tr.resolvedOn}</p>
                <p className="font-semibold text-deep-teal">{new Date(complaint.resolvedAt).toLocaleString()}</p>
              </div>
            )}
            {complaint.location && (
              <div>
                <p className="text-sm text-medium-teal font-semibold mb-1">{tr.location}</p>
                <p className="font-semibold text-deep-teal">
                  {complaint.location.address || `${complaint.location.latitude}, ${complaint.location.longitude}`}
                </p>
              </div>
            )}
          </div>
        </div>

        <ImageViewer images={complaint.images || []} title={tr.complaintImages} altPrefix="Complaint" />

        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <h3 className="font-bold text-xl mb-5 text-deep-teal">{tr.updateStatus}</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-deep-teal font-semibold mb-2">{tr.status}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal font-semibold"
              >
                <option value="Pending">{tr.pending}</option>
                <option value="In Progress">{tr.inProgress}</option>
                <option value="Rejected">{tr.rejected}</option>
                <option value="Resolved">{tr.resolved}</option>
              </select>
            </div>
            <div>
              <label className="block text-deep-teal font-semibold mb-2">{tr.officerRemarks}</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
                placeholder={tr.enterRemarksPlaceholder}
              />
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className="w-full bg-gradient-primary text-cream py-4 rounded-xl font-bold text-lg hover:shadow-teal transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none shadow-md"
            >
              {updating ? tr.updating : tr.updateStatus}
            </button>
          </div>
        </div>

        {/* Only show proof upload when process is complete (status = Resolved) */}
        {status === 'Resolved' && (
          <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
            <h3 className="font-bold text-xl mb-5 text-deep-teal">{tr.uploadResolutionProof}</h3>
            <p className="text-sm text-medium-teal mb-4">{tr.uploadProofHint}</p>
            <form onSubmit={handleProofUpload} className="space-y-5">
              <ImageUploadWithCamera
                files={proofFiles}
                onChange={setProofFiles}
                accept="image/*"
                multiple
                label={tr.addProofImages}
              />
              <button
                type="submit"
                disabled={updating || proofFiles.length === 0}
                className="w-full bg-vibrant-green text-cream py-4 rounded-xl font-bold text-lg hover:bg-green-dark disabled:opacity-50 flex items-center justify-center gap-2 shadow-md transform hover:scale-105 transition-all disabled:transform-none"
              >
                <FiUpload size={22} />
                {updating ? tr.uploading : tr.uploadProof}
              </button>
            </form>
          </div>
        )}

        {/* Resolution Proof - fully viewable */}
        {complaint.resolutionProof && Array.isArray(complaint.resolutionProof) && complaint.resolutionProof.filter(p => p && typeof p === 'string').length > 0 ? (
          <ImageViewer images={complaint.resolutionProof} title={tr.resolutionProof} altPrefix="Proof" />
        ) : (
          <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
            <h3 className="font-bold text-xl mb-4 text-deep-teal">{tr.resolutionProof}</h3>
            <p className="text-gray-500 text-sm">{tr.noProofYet}</p>
          </div>
        )}

        {complaint.feedback && (
          <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
            <h3 className="font-bold text-xl mb-3 text-deep-teal">{tr.userFeedback}</h3>
            <p className="text-deep-teal font-semibold mb-2">{tr.rating}: <span className="text-vibrant-green">{complaint.feedback.rating}</span></p>
            {complaint.feedback.comment && (
              <p className="text-deep-teal mt-3 bg-pale-green p-3 rounded-xl">{complaint.feedback.comment}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminComplaintDetails
