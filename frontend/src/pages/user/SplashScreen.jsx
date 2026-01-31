import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SplashScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      const language = localStorage.getItem('language')
      if (language) {
        navigate('/login')
      } else {
        navigate('/language')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-primary">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-cream rounded-full flex items-center justify-center mb-6 shadow-soft transform hover:scale-105 transition-transform duration-300">
            <span className="text-6xl">🏙️</span>
          </div>
          <h1 className="text-5xl font-bold text-cream mb-3 drop-shadow-lg">Smart City</h1>
          <p className="text-2xl text-pale-green font-medium">Issue Tracker</p>
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
