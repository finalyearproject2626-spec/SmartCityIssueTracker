import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LanguageSelection = () => {
  const navigate = useNavigate()
  const { updateLanguage } = useAuth()

  const handleLanguageSelect = (lang) => {
    updateLanguage(lang)
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-primary">
      <div className="bg-cream rounded-3xl shadow-soft p-8 w-full max-w-md border border-pale-green">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🌐</span>
          </div>
          <h2 className="text-2xl font-bold text-deep-teal mb-2">
            Select Language
          </h2>
          <p className="text-medium-teal text-sm">மொழியைத் தேர்ந்தெடுக்கவும்</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => handleLanguageSelect('english')}
            className="w-full py-5 px-6 bg-gradient-primary text-cream rounded-2xl font-bold text-lg hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
          >
            English
          </button>
          <button
            onClick={() => handleLanguageSelect('tamil')}
            className="w-full py-5 px-6 bg-gradient-primary text-cream rounded-2xl font-bold text-lg hover:shadow-teal transform hover:scale-105 transition-all shadow-md"
          >
            தமிழ் (Tamil)
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelection
