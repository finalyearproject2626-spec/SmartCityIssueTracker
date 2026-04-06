import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft } from 'react-icons/fi'
import logo from '../../assets/logo.png'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, adminLogin, language } = useAuth()
  const isTamil = language === 'tamil'
  const hasRegistered = sessionStorage.getItem('scit_registered') === 'true'
  const initialRegisterMode = searchParams.get('mode') === 'register' || !hasRegistered
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [isRegister, setIsRegister] = useState(initialRegisterMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const tr = {
    back: isTamil ? 'முகப்புக்கு திரும்பு' : 'Back to Home',
    register: isTamil ? 'பதிவு' : 'Register',
    login: isTamil ? 'உள்நுழை' : 'Login',
    title: isTamil ? 'மக்களுக்கான சேவை புகார் தளம்' : 'Civic Issue Reporting for Citizens',
    registrationSuccess: isTamil ? 'பதிவு வெற்றி. தொடர உள்நுழையவும்.' : 'Registration successful. Please login to continue.',
    loginFailed: isTamil ? 'உள்நுழைவு தோல்வி' : 'Login failed',
    name: isTamil ? 'பெயர்' : 'Name',
    email: isTamil ? 'மின்னஞ்சல்' : 'Email',
    password: isTamil ? 'கடவுச்சொல்' : 'Password',
    loading: isTamil ? 'ஏற்றுகிறது...' : 'Loading...',
    forgotPassword: isTamil ? 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?' : 'Forgot password?',
    alreadyAccount: isTamil ? 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழை' : 'Already have an account? Login',
    noAccount: isTamil ? 'கணக்கு இல்லையா? பதிவு செய்யவும்' : "Don't have an account? Register"
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await api.post('/auth/register', { ...formData, language })
        sessionStorage.setItem('scit_registered', 'true')
        setSuccessMessage(tr.registrationSuccess)
        setIsRegister(false)
        setFormData({ email: formData.email, password: '', name: '' })
      } else {
        const res = await api.post('/auth/login', formData)
        if (res.data.isAdmin && res.data.admin) {
          adminLogin(res.data.token, res.data.admin)
          navigate('/admin/dashboard')
        } else {
          login(res.data.token, res.data.user)
          navigate('/home')
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || tr.loginFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light flex items-center justify-center p-4 py-8 sm:py-12">
      <div className="bg-cream rounded-3xl shadow-soft p-6 sm:p-8 w-full max-w-md border border-pale-green animate-scale-in">
        <Link to="/" className="inline-flex items-center gap-2 text-medium-teal hover:text-deep-teal mb-4 text-sm transition">
          <FiArrowLeft size={16} />
          {tr.back}
        </Link>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="SCIT Logo" className="w-12 h-12 rounded-full object-cover bg-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-deep-teal mb-2">
            {isRegister ? tr.register : tr.login}
          </h2>
          <p className="text-medium-teal text-sm">{tr.title}</p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm animate-fade-in">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-deep-teal font-semibold mb-2 text-sm">{tr.name}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal transition"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-deep-teal font-semibold mb-2 text-sm">{tr.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal transition"
              required
            />
          </div>
          <div>
            <label className="block text-deep-teal font-semibold mb-2 text-sm">{tr.password}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-cream py-4 rounded-xl font-bold text-lg hover:shadow-teal transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:transform-none shadow-md"
          >
            {loading ? tr.loading : isRegister ? tr.register : tr.login}
          </button>
          {!isRegister && (
            <div className="text-right">
              <Link to="/forgot-password" className="text-medium-teal hover:text-deep-teal font-semibold text-sm transition">
                {tr.forgotPassword}
              </Link>
            </div>
          )}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-medium-teal hover:text-deep-teal font-semibold text-sm transition"
            >
              {isRegister ? tr.alreadyAccount : tr.noAccount}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
