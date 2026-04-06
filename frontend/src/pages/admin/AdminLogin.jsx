import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiX } from 'react-icons/fi'
import logo from '../../assets/logo.png'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../../constants/adminDefaults'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { adminLogin, language } = useAuth()
  const isTamil = language === 'tamil'
  const [formData, setFormData] = useState({ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const tr = {
    close: isTamil ? 'மூடு / முகப்புக்கு திரும்பு' : 'Close / Back to home',
    adminLogin: isTamil ? 'நிர்வாக உள்நுழைவு' : 'Admin Login',
    adminPortal: isTamil ? 'ஸ்மார்ட் சிட்டி நிர்வாக தளம்' : 'Smart City Admin Portal',
    loginFailed: isTamil ? 'உள்நுழைவு தோல்வி' : 'Login failed',
    email: isTamil ? 'மின்னஞ்சல்' : 'Email',
    password: isTamil ? 'கடவுச்சொல்' : 'Password',
    loading: isTamil ? 'ஏற்றுகிறது...' : 'Loading...',
    login: isTamil ? 'உள்நுழை' : 'Login',
    defaultCreds: isTamil
      ? `இயல்புநிலை: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`
      : `Default: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/admin/login', formData)
      adminLogin(res.data.token, res.data.admin)
      navigate('/admin/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || tr.loginFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light flex items-center justify-center p-4 pt-24 relative">
      <div className="bg-cream rounded-3xl shadow-soft p-8 w-full max-w-md border border-pale-green relative">
        <Link
          to="/"
          className="absolute top-6 right-6 p-2 rounded-full bg-pale-green/20 hover:bg-pale-green/40 text-deep-teal transition-colors flex items-center justify-center"
          aria-label="Close"
          title={tr.close}
        >
          <FiX size={24} strokeWidth={2.5} />
        </Link>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="SCIT Logo" className="w-12 h-12 rounded-full object-cover bg-white" />
          </div>
          <h2 className="text-3xl font-bold text-deep-teal mb-2">{tr.adminLogin}</h2>
          <p className="text-medium-teal text-sm">{tr.adminPortal}</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-deep-teal font-semibold mb-2">{tr.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-deep-teal font-semibold mb-2">{tr.password}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-cream py-4 rounded-xl font-bold text-lg hover:shadow-teal transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none shadow-md"
          >
            {loading ? tr.loading : tr.login}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-medium-teal">
          {tr.defaultCreds}
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
