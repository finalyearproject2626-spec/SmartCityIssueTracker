import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import logo from '../../assets/logo.png'

const ForgotPassword = () => {
  const { language } = useAuth()
  const isTamil = language === 'tamil'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const tr = {
    back: isTamil ? 'உள்நுழைவுக்கு திரும்பு' : 'Back to login',
    title: isTamil ? 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?' : 'Forgot password?',
    subtitle: isTamil ? 'உங்கள் மின்னஞ்சலை உள்ளிடுங்கள். மீட்டமைப்பு இணைப்பை அனுப்புகிறோம்.' : 'Enter your email and we will send a reset link.',
    email: isTamil ? 'மின்னஞ்சல்' : 'Email',
    placeholder: isTamil ? 'உங்கள் மின்னஞ்சலை உள்ளிடவும்' : 'Enter your email',
    sendLink: isTamil ? 'மீட்டமைப்பு இணைப்பை அனுப்பு' : 'Send reset link',
    loading: isTamil ? 'அனுப்புகிறது...' : 'Sending...',
    required: isTamil ? 'மின்னஞ்சல் அவசியம்' : 'Email is required'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError(tr.required)
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setSuccess(res.data?.message || (isTamil ? 'மீட்டமைப்பு இணைப்பு அனுப்பப்பட்டது.' : 'Reset link sent.'))
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light flex items-center justify-center p-4 py-8 sm:py-12">
      <div className="bg-cream rounded-3xl shadow-soft p-6 sm:p-8 w-full max-w-md border border-pale-green">
        <Link to="/login" className="inline-flex items-center gap-2 text-medium-teal hover:text-deep-teal mb-4 text-sm transition">
          <FiArrowLeft size={16} />
          {tr.back}
        </Link>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="SCIT Logo" className="w-12 h-12 rounded-full object-cover bg-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-deep-teal mb-2">{tr.title}</h2>
          <p className="text-medium-teal text-sm">{tr.subtitle}</p>
        </div>

        {success && (
          <div className="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-deep-teal font-semibold mb-2 text-sm">{tr.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tr.placeholder}
              className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-cream py-4 rounded-xl font-bold text-lg hover:shadow-teal transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:transform-none shadow-md"
          >
            {loading ? tr.loading : tr.sendLink}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
