import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiGlobe, FiLogOut } from 'react-icons/fi'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, language, updateLanguage } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' })
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put('/user/profile', formData)
      setEditing(false)
      window.location.reload()
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const translations = {
    english: {
      title: 'Profile',
      name: 'Name',
      email: 'Email',
      mobile: 'Mobile',
      language: 'Language',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      logout: 'Logout',
      appInfo: 'App Info',
      help: 'Help & Support'
    },
    tamil: {
      title: 'சுயவிவரம்',
      name: 'பெயர்',
      email: 'மின்னஞ்சல்',
      mobile: 'மொபைல்',
      language: 'மொழி',
      edit: 'திருத்து',
      save: 'சேமி',
      cancel: 'ரத்துசெய்',
      logout: 'வெளியேறு',
      appInfo: 'ஆப் தகவல்',
      help: 'உதவி & ஆதரவு'
    }
  }

  const tr = translations[language] || translations.english

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/home')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-2xl font-bold">{tr.title}</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <div className="flex items-center justify-between mb-6">
            <div className="w-24 h-24 bg-gradient-teal rounded-full flex items-center justify-center shadow-md">
              <FiUser size={40} className="text-cream" />
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 bg-gradient-primary text-cream rounded-xl font-bold hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
              >
                {tr.edit}
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-deep-teal font-semibold mb-2">{tr.name}</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
                />
              ) : (
                <p className="font-bold text-deep-teal text-lg">{formData.name || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-deep-teal font-semibold mb-2">{tr.email}</label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
                />
              ) : (
                <p className="font-bold text-deep-teal text-lg">{formData.email || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-deep-teal font-semibold mb-2">{tr.mobile}</label>
              {editing ? (
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
                />
              ) : (
                <p className="font-bold text-deep-teal text-lg">{formData.mobile || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-deep-teal font-semibold mb-2">{tr.language}</label>
              <select
                value={language}
                onChange={(e) => updateLanguage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal font-semibold"
              >
                <option value="english">English</option>
                <option value="tamil">தமிழ் (Tamil)</option>
              </select>
            </div>

            {editing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-gradient-primary text-cream py-4 rounded-xl font-bold hover:shadow-teal transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none shadow-md"
                >
                  {tr.save}
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      mobile: user?.mobile || ''
                    })
                  }}
                  className="flex-1 bg-pale-green text-deep-teal py-4 rounded-xl font-bold hover:bg-medium-teal hover:text-cream transform hover:scale-105 transition-all border-2 border-medium-teal"
                >
                  {tr.cancel}
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-cream py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-red-600 transform hover:scale-105 transition-all shadow-md"
        >
          <FiLogOut size={22} />
          {tr.logout}
        </button>
      </div>
    </div>
  )
}

export default Profile
