import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.png'

const SplashScreen = () => {
  const navigate = useNavigate()
  const { language } = useAuth()
  const isTa = language === 'tamil'

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasRegistered = sessionStorage.getItem('scit_registered') === 'true'
      navigate(hasRegistered ? '/login' : '/login?mode=register')
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-primary">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-cream rounded-full flex items-center justify-center mb-6 shadow-soft transform hover:scale-105 transition-transform duration-300">
            <img src={logo} alt="SCIT Logo" className="w-24 h-24 rounded-full object-cover" />
          </div>
          <h1 className="text-5xl font-bold text-cream mb-3 drop-shadow-lg">
            {isTa ? 'ஸ்மார்ட் சிட்டி' : 'Smart City'}
          </h1>
          <p className="text-2xl text-pale-green font-medium">
            {isTa ? 'சிக்கல் டிராக்கர்' : 'Issue Tracker'}
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-vibrant-green rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-vibrant-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-vibrant-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
