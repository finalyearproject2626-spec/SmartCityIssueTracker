import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const Login = () => {
  const navigate = useNavigate()
  const { login, adminLogin, language } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isRegister) {
        const res = await api.post('/auth/register', {
          ...formData,
          language
        })
        login(res.data.token, res.data.user)
        navigate('/home')
      } else {
        const res = await api.post('/auth/login', formData)
        
        // Check if admin login
        if (res.data.isAdmin && res.data.admin) {
          adminLogin(res.data.token, res.data.admin)
          navigate('/admin/dashboard')
        } else {
          login(res.data.token, res.data.user)
          navigate('/home')
        }
      }
    } catch (error) {
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
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="bg-cream rounded-3xl shadow-soft p-8 w-full max-w-md border border-pale-green">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏙️</span>
          </div>
          <h2 className="text-3xl font-bold text-deep-teal mb-2">
            {isRegister ? 'Register' : 'Login'}
          </h2>
          <p className="text-medium-teal text-sm">Smart City Issue Tracker</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-4">
              <label className="block text-deep-teal font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-deep-teal font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-deep-teal font-semibold mb-2">
              Password
            </label>
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
            {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
          </button>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-medium-teal hover:text-deep-teal font-semibold"
            >
              {isRegister
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
