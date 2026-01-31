import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiUpload, FiLogOut } from 'react-icons/fi'

const AdminComplaintDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { logout, admin } = useAuth()
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
      console.log('Complaint data:', res.data)
      console.log('Resolution Proof:', res.data?.resolutionProof)
      if (res.data) {
        setComplaint(res.data)
        setStatus(res.data.status || 'Pending')
        setRemarks(res.data.officerRemarks || '')
      } else {
        setError('Complaint data is empty')
      }
    } catch (error) {
      console.error('Failed to fetch complaint:', error)
      setError(error.response?.data?.message || error.message || 'Failed to load complaint')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    setUpdating(true)
    try {
      await api.put(`/admin/complaints/${id}/status`, { status, officerRemarks: remarks })
      await fetchComplaint()
      alert('Status updated successfully')
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
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
      alert('Resolution proof uploaded successfully')
    } catch (error) {
      console.error('Failed to upload proof:', error)
      alert('Failed to upload proof')
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
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
        <div className="bg-gradient-teal text-cream p-6 flex items-center justify-between shadow-teal">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/complaints')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
              <FiArrowLeft size={22} className="text-cream" />
            </button>
            <h1 className="text-2xl font-bold">Complaint Details</h1>
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
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="bg-cream border-2 border-red-300 text-red-700 px-8 py-6 rounded-2xl max-w-md shadow-soft">
            <h2 className="font-bold text-xl mb-3 text-deep-teal">Error Loading Complaint</h2>
            <p className="mb-6 text-medium-teal">{error}</p>
            <button
              onClick={fetchComplaint}
              className="bg-gradient-primary text-cream px-6 py-3 rounded-xl font-bold hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-soft">
        <div className="bg-gradient-teal text-cream p-6 flex items-center justify-between shadow-teal">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/complaints')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
              <FiArrowLeft size={22} className="text-cream" />
            </button>
            <h1 className="text-2xl font-bold">Complaint Details</h1>
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
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="bg-cream p-8 rounded-2xl shadow-soft border border-pale-green text-center">
            <p className="text-deep-teal text-lg mb-6 font-semibold">Complaint not found</p>
            <button
              onClick={() => navigate('/admin/complaints')}
              className="bg-gradient-primary text-cream px-6 py-3 rounded-xl font-bold hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
            >
              Back to Complaints
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 flex items-center justify-between shadow-teal">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/complaints')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
            <FiArrowLeft size={22} className="text-cream" />
          </button>
          <h1 className="text-2xl font-bold">Complaint Details</h1>
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

      <div className="p-6 space-y-6">
        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <h2 className="font-bold text-xl mb-5 text-deep-teal">Complaint Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">Complaint ID</p>
              <p className="font-bold text-deep-teal text-lg">{complaint.complaintId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">Category</p>
              <p className="font-bold text-deep-teal">{complaint.category || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">Description</p>
              <p className="font-semibold text-deep-teal">{complaint.description || 'No description'}</p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">User</p>
              <p className="font-semibold text-deep-teal">
                {complaint.userId?.name || 'N/A'} ({complaint.userId?.email || 'N/A'})
              </p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">Submitted</p>
              <p className="font-semibold text-deep-teal">{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-medium-teal font-semibold mb-1">Status</p>
              <p className="font-semibold">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  complaint.status === 'Resolved' ? 'bg-vibrant-green text-cream' :
                  complaint.status === 'In Progress' ? 'bg-orange-400 text-cream' :
                  'bg-yellow-400 text-cream'
                }`}>
                  {complaint.status}
                </span>
              </p>
            </div>
            {complaint.resolvedAt && (
              <div>
                <p className="text-sm text-medium-teal font-semibold mb-1">Resolved On</p>
                <p className="font-semibold text-deep-teal">{new Date(complaint.resolvedAt).toLocaleString()}</p>
              </div>
            )}
            {complaint.location && (
              <div>
                <p className="text-sm text-medium-teal font-semibold mb-1">Location</p>
                <p className="font-semibold text-deep-teal">
                  {complaint.location.address || `${complaint.location.latitude}, ${complaint.location.longitude}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {complaint.images && complaint.images.length > 0 && (
          <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
            <h3 className="font-bold text-xl mb-4 text-deep-teal">Images</h3>
            <div className="grid grid-cols-2 gap-2">
              {complaint.images
                .filter(img => img) // Filter out null/undefined values
                .map((img, idx) => (
                  <img
                    key={idx}
                    src={img && typeof img === 'string' && img.startsWith('http') ? img : `http://localhost:5001/uploads/${img}`}
                    alt={`Complaint ${idx + 1}`}
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ))}
            </div>
          </div>
        )}

        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <h3 className="font-bold text-xl mb-5 text-deep-teal">Update Status</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-deep-teal font-semibold mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal font-semibold"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-deep-teal font-semibold mb-2">Officer Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
                placeholder="Enter remarks..."
              />
            </div>
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className="w-full bg-gradient-primary text-cream py-4 rounded-xl font-bold text-lg hover:shadow-teal transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none shadow-md"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>

        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <h3 className="font-bold text-xl mb-5 text-deep-teal">Upload Resolution Proof</h3>
          <form onSubmit={handleProofUpload} className="space-y-5">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setProofFiles(Array.from(e.target.files))}
              className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
            />
            <button
              type="submit"
              disabled={updating || proofFiles.length === 0}
              className="w-full bg-vibrant-green text-cream py-4 rounded-xl font-bold text-lg hover:bg-green-dark disabled:opacity-50 flex items-center justify-center gap-2 shadow-md transform hover:scale-105 transition-all disabled:transform-none"
            >
              <FiUpload size={22} />
              {updating ? 'Uploading...' : 'Upload Proof'}
            </button>
          </form>
        </div>

        {/* Resolution Proof Section */}
        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <h3 className="font-bold text-xl mb-4 text-deep-teal">Resolution Proof</h3>
          {complaint.resolutionProof && Array.isArray(complaint.resolutionProof) && complaint.resolutionProof.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {complaint.resolutionProof
                .filter(proof => proof && typeof proof === 'string') // Filter out null/undefined values and ensure it's a string
                .map((proof, idx) => {
                  const imageUrl = proof.startsWith('http') ? proof : `http://localhost:5001/uploads/${proof}`;
                  console.log(`Resolution proof ${idx}:`, proof, '→', imageUrl);
                  return (
                    <div key={idx} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Proof ${idx + 1}`}
                        className="w-full h-32 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          console.error('Failed to load resolution proof image:', imageUrl);
                          e.target.style.display = 'none'
                          // Show error message
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'text-red-500 text-xs p-2';
                          errorDiv.textContent = 'Failed to load image';
                          e.target.parentElement.appendChild(errorDiv);
                        }}
                        onLoad={() => {
                          console.log('Successfully loaded resolution proof:', imageUrl);
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No resolution proof uploaded yet</p>
          )}
          {complaint.resolutionProof && Array.isArray(complaint.resolutionProof) && complaint.resolutionProof.length > 0 && 
           complaint.resolutionProof.filter(proof => proof && typeof proof === 'string').length === 0 && (
            <p className="text-gray-500 text-sm mt-2">Resolution proof data exists but contains invalid URLs</p>
          )}
        </div>

        {complaint.feedback && (
          <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
            <h3 className="font-bold text-xl mb-3 text-deep-teal">User Feedback</h3>
            <p className="text-deep-teal font-semibold mb-2">Rating: <span className="text-vibrant-green">{complaint.feedback.rating}</span></p>
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
