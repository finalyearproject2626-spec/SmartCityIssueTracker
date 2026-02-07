import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiPlusCircle, FiList, FiBell, FiUser, FiLogOut, FiGrid } from 'react-icons/fi'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, admin, logout } = useAuth()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const handleLogout = () => {
    logout()
    navigate(admin ? '/admin/login' : '/login')
  }

  if (admin) {
    return (
      <nav className="bg-gradient-teal text-cream shadow-teal sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
              <FiGrid size={24} />
              <span>Smart City Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-lg transition ${isActive('/admin/dashboard') ? 'bg-medium-teal' : 'hover:bg-medium-teal/80'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/complaints"
                className={`px-3 py-2 rounded-lg transition ${isActive('/admin/complaints') ? 'bg-medium-teal' : 'hover:bg-medium-teal/80'}`}
              >
                Complaints
              </Link>
              <span className="text-pale-green text-sm hidden sm:inline">{admin?.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-medium-teal/80 transition flex items-center gap-2"
                title="Logout"
              >
                <FiLogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gradient-teal text-cream shadow-teal sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={user ? '/home' : '/login'} className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🏙️</span>
            <span>Smart City Issue Tracker</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            {user ? (
              <>
                <Link
                  to="/home"
                  className={`p-2 sm:px-3 sm:py-2 rounded-lg transition flex items-center gap-1 ${isActive('/home') ? 'bg-medium-teal' : 'hover:bg-medium-teal/80'}`}
                  title="Home"
                >
                  <FiHome size={20} />
                  <span className="hidden sm:inline">Home</span>
                </Link>
                <Link
                  to="/raise-complaint"
                  className={`p-2 sm:px-3 sm:py-2 rounded-lg transition flex items-center gap-1 ${isActive('/raise-complaint') ? 'bg-medium-teal' : 'hover:bg-medium-teal/80'}`}
                  title="Raise Complaint"
                >
                  <FiPlusCircle size={20} />
                  <span className="hidden sm:inline">Raise Complaint</span>
                </Link>
                <Link
                  to="/my-complaints"
                  className={`p-2 sm:px-3 sm:py-2 rounded-lg transition flex items-center gap-1 ${isActive('/my-complaints') ? 'bg-medium-teal' : 'hover:bg-medium-teal/80'}`}
                  title="My Complaints"
                >
                  <FiList size={20} />
                  <span className="hidden sm:inline">My Complaints</span>
                </Link>
                <Link
                  to="/notifications"
                  className={`p-2 sm:px-3 sm:py-2 rounded-lg transition flex items-center gap-1 ${isActive('/notifications') ? 'bg-medium-teal' : 'hover:bg-medium-teal/80'}`}
                  title="Notifications"
                >
                  <FiBell size={20} />
                  <span className="hidden sm:inline">Notifications</span>
                </Link>
                <Link
                  to="/profile"
                  className={`p-2 sm:px-3 sm:py-2 rounded-lg transition flex items-center gap-1 ${isActive('/profile') ? 'bg-medium-teal' : 'hover:bg-medium-teal/80'}`}
                  title="Profile"
                >
                  <FiUser size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-medium-teal/80 transition flex items-center gap-1"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-lg transition ${isActive('/login') ? 'bg-medium-teal' : 'hover:bg-medium-teal/80'}`}
                >
                  Login
                </Link>
                <Link to="/language" className="px-3 py-2 rounded-lg hover:bg-medium-teal/80 transition">
                  Language
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
