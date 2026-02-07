import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Footer = () => {
  const { user, admin } = useAuth()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-deep-teal text-cream mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏙️</span>
            <span className="font-semibold">Smart City Issue Tracker</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-pale-green">
            {!admin && (
              <>
                <Link to={user ? '/home' : '/login'} className="hover:text-cream transition">
                  Home
                </Link>
                {user && (
                  <>
                    <Link to="/raise-complaint" className="hover:text-cream transition">
                      Raise Complaint
                    </Link>
                    <Link to="/my-complaints" className="hover:text-cream transition">
                      My Complaints
                    </Link>
                  </>
                )}
                <Link to="/login" className="hover:text-cream transition">
                  Login
                </Link>
              </>
            )}
            {admin && (
              <>
                <Link to="/admin/dashboard" className="hover:text-cream transition">
                  Admin Dashboard
                </Link>
                <Link to="/admin/complaints" className="hover:text-cream transition">
                  Complaints
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-medium-teal/50 text-center text-sm text-pale-green">
          <p>Report city issues and track resolution. Making our city smarter together.</p>
          <p className="mt-1">© {currentYear} Smart City Issue Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
