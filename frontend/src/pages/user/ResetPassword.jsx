import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import logo from '../../assets/logo.png'

const ResetPassword = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { language } = useAuth()
  const isTamil = language === 'tamil'
  const token = params.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const tr = {
    back: isTamil ? 'உள்நுழைவுக்கு திரும்பு' : 'Back to login',
    title: isTamil ? 'கடவுச்சொல்லை மீட்டமை' : 'Reset password',
    subtitle: isTamil ? 'புதிய கடவுச்சொல்லை உள்ளிடவும்' : 'Enter your new password',
    password: isTamil ? 'புதிய கடவுச்சொல்' : 'New password',
    confirmPassword: isTamil ? 'கடவுச்சொல்லை உறுதிப்படுத்து' : 'Confirm password',
    reset: isTamil ? 'கடவுச்சொல்லை மாற்று' : 'Reset password',
    loading: isTamil ? 'மாற்றுகிறது...' : 'Resetting...',
    missingToken: isTamil ? 'தவறான அல்லது காலாவதியான இணைப்பு.' : 'Invalid or expired reset link.',
    mismatch: isTamil ? 'கடவுச்சொற்கள் பொருந்தவில்லை.' : 'Passwords do not match.',
    minLength: isTamil ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.' : 'Password must be at least 6 characters.',
    successDefault: isTamil ? 'கடவுச்சொல் மாற்றம் வெற்றி. உள்நுழையவும்.' : 'Password reset successful. Please login.'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError(tr.missingToken)
      return
    }
    if (password.length < 6) {
      setError(tr.minLength)
      return
    }
    if (password !== confirmPassword) {
      setError(tr.mismatch)
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/reset-password', { token, password })
      setSuccess(res.data?.message || tr.successDefault)
      setTimeout(() => navigate('/login'), 1200)
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
            <label className="block text-deep-teal font-semibold mb-2 text-sm">{tr.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal transition"
              required
            />
          </div>
          <div>
            <label className="block text-deep-teal font-semibold mb-2 text-sm">{tr.confirmPassword}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-cream py-4 rounded-xl font-bold text-lg hover:shadow-teal transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:transform-none shadow-md"
          >
            {loading ? tr.loading : tr.reset}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
