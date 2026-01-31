import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiCamera, FiMapPin } from 'react-icons/fi'

const RaiseComplaint = () => {
  const navigate = useNavigate()
  const { language } = useAuth()
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    latitude: '',
    longitude: '',
    address: ''
  })
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = ['Road', 'Water', 'Electricity', 'Waste', 'Drainage', 'Street Light', 'Other']

  const translations = {
    english: {
      title: 'Raise a Complaint',
      category: 'Category',
      description: 'Description',
      location: 'Location',
      uploadMedia: 'Upload Photo/Video',
      getLocation: 'Get Current Location',
      submit: 'Submit',
      selectCategory: 'Select Category',
      enterDescription: 'Enter complaint description...',
      locationDetected: 'Location detected'
    },
    tamil: {
      title: 'புகாரை உயர்த்தவும்',
      category: 'வகை',
      description: 'விளக்கம்',
      location: 'இடம்',
      uploadMedia: 'புகைப்படம்/வீடியோவை பதிவேற்றவும்',
      getLocation: 'தற்போதைய இடத்தைப் பெறவும்',
      submit: 'சமர்ப்பிக்க',
      selectCategory: 'வகையைத் தேர்ந்தெடுக்கவும்',
      enterDescription: 'புகார் விளக்கத்தை உள்ளிடவும்...',
      locationDetected: 'இடம் கண்டறியப்பட்டது'
    }
  }

  const tr = translations[language] || translations.english

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles([...files, ...selectedFiles])
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          setError('Failed to get location')
        }
      )
    } else {
      setError('Geolocation is not supported')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.category || !formData.description || !formData.latitude) {
      setError('Please fill all required fields and get your location')
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('category', formData.category)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('latitude', formData.latitude)
      formDataToSend.append('longitude', formData.longitude)
      formDataToSend.append('address', formData.address)

      files.forEach((file) => {
        formDataToSend.append('media', file)
      })

      const res = await api.post('/complaints', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      navigate(`/complaint-confirmation/${res.data._id}`)
    } catch (error) {
      console.error('Complaint submission error:', error)
      let errorMessage = 'Failed to submit complaint'
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || 
                       error.response.data.error || 
                       error.response.data.toString() ||
                       `Server error: ${error.response.status}`
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/home')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-2xl font-bold">{tr.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-5 py-4 rounded-2xl">
            {error}
          </div>
        )}

        <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green">
          <label className="block text-deep-teal font-semibold mb-3">{tr.category}</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal font-semibold"
            required
          >
            <option value="">{tr.selectCategory}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green">
          <label className="block text-deep-teal font-semibold mb-3">{tr.description}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
            placeholder={tr.enterDescription}
            required
          />
        </div>

        <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green">
          <label className="block text-deep-teal font-semibold mb-3">{tr.location}</label>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="w-full py-4 px-4 bg-vibrant-green text-cream rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-dark transform hover:scale-105 transition-all shadow-md"
          >
            <FiMapPin size={22} />
            {tr.getLocation}
          </button>
          {formData.latitude && (
            <p className="mt-3 text-sm text-vibrant-green font-semibold bg-pale-green px-3 py-2 rounded-xl">{tr.locationDetected}</p>
          )}
        </div>

        <div className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green">
          <label className="block text-deep-teal font-semibold mb-3">{tr.uploadMedia}</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
          />
          {files.length > 0 && (
            <p className="mt-3 text-sm text-medium-teal font-semibold bg-pale-green px-3 py-2 rounded-xl">{files.length} file(s) selected</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-primary text-cream py-5 rounded-2xl font-bold text-lg hover:shadow-teal transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none shadow-md"
        >
          {loading ? 'Submitting...' : tr.submit}
        </button>
      </form>
    </div>
  )
}

export default RaiseComplaint
