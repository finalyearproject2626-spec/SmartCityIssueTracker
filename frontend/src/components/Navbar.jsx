import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiPlusCircle, FiList, FiBell, FiUser, FiLogOut, FiGrid, FiMenu, FiX, FiInfo, FiZap, FiTarget, FiArrowRight } from 'react-icons/fi'
import logo from '../assets/logo.png'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, admin, logout, language, updateLanguage } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hasRegistered, setHasRegistered] = useState(false)

  const isLanding = location.pathname === '/'
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  const isTamil = language === 'tamil'

  const tr = {
    brand: isTamil ? 'ஸ்மார்ட் சிட்டி சிக்கல் டிராக்கர்' : 'Smart City Issue Tracker',
    shortBrand: isTamil ? 'ஸ்மார்ட் சிட்டி' : 'Smart City',
    adminBrand: isTamil ? 'ஸ்மார்ட் சிட்டி நிர்வாகம்' : 'Smart City Admin',
    dashboard: isTamil ? 'டாஷ்போர்ட்' : 'Dashboard',
    complaints: isTamil ? 'புகார்கள்' : 'Complaints',
    logout: isTamil ? 'வெளியேறு' : 'Logout',
    home: isTamil ? 'முகப்பு' : 'Home',
    about: isTamil ? 'எங்களை பற்றி' : 'About',
    features: isTamil ? 'அம்சங்கள்' : 'Features',
    howItWorks: isTamil ? 'எப்படி செயல்படும்' : 'How It Works',
    getStarted: isTamil ? 'தொடங்கு' : 'Get Started',
    login: isTamil ? 'உள்நுழை' : 'Login',
    register: isTamil ? 'பதிவு' : 'Register',
    raise: isTamil ? 'புகார் செய்' : 'Raise',
    alerts: isTamil ? 'அறிவிப்புகள்' : 'Alerts',
    profile: isTamil ? 'சுயவிவரம்' : 'Profile',
    raiseComplaint: isTamil ? 'புகார் செய்' : 'Raise complaint',
    myComplaints: isTamil ? 'என் புகார்கள்' : 'My Complaints',
    notifications: isTamil ? 'அறிவிப்புகள்' : 'Notifications',
    benefits: isTamil ? 'நன்மைகள்' : 'Benefits',
    testimonials: isTamil ? 'கருத்துகள்' : 'Testimonials'
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setHasRegistered(sessionStorage.getItem('scit_registered') === 'true')
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate(admin ? '/admin/login' : '/login')
  }

  const scrollToSection = (id) => {
    setMobileOpen(false)
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const NavLink = ({ to, children, icon: Icon, exact }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
        (exact ? location.pathname === to : isActive(to))
          ? 'bg-white/20 text-cream'
          : 'hover:bg-white/10 text-cream/90 hover:text-cream'
      }`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </Link>
  )

  const LanguageSwitcher = ({ mobile = false }) => (
    <div className={`inline-flex items-center rounded-lg border border-white/30 overflow-hidden ${mobile ? 'mx-4 my-2' : 'ml-2'}`}>
      <button
        onClick={() => updateLanguage('english')}
        className={`px-3 py-1.5 text-xs font-bold transition ${language === 'english' ? 'bg-white text-deep-teal' : 'text-cream hover:bg-white/10'}`}
      >
        EN
      </button>
      <button
        onClick={() => updateLanguage('tamil')}
        className={`px-3 py-1.5 text-xs font-bold transition ${language === 'tamil' ? 'bg-white text-deep-teal' : 'text-cream hover:bg-white/10'}`}
      >
        TA
      </button>
    </div>
  )

  if (admin) {
    return (
      <nav className={`bg-gradient-to-r from-deep-teal via-medium-teal to-teal-light text-cream shadow-lg sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg hover:opacity-90 transition">
              <FiGrid size={24} className="animate-pulse" />
              <span className="hidden xs:inline">{tr.adminBrand}</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/admin/dashboard" icon={FiGrid}>{tr.dashboard}</NavLink>
              <NavLink to="/admin/complaints" icon={FiList}>{tr.complaints}</NavLink>
              <LanguageSwitcher />
              <span className="text-pale-green/80 text-sm px-3">{admin?.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition" title={tr.logout}>
                <FiLogOut size={20} />
                <span>{tr.logout}</span>
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/10 transition active:scale-95"
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden py-4 animate-slide-down border-t border-white/20">
              <div className="flex flex-col gap-1">
                <NavLink to="/admin/dashboard" icon={FiGrid}>{tr.dashboard}</NavLink>
                <NavLink to="/admin/complaints" icon={FiList}>{tr.complaints}</NavLink>
                <LanguageSwitcher mobile />
                <p className="px-4 py-2 text-pale-green/80 text-sm">{admin?.name}</p>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/10 text-left">
                  <FiLogOut size={20} /> {tr.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    )
  }

  return (
    <nav className={`bg-gradient-to-r from-deep-teal via-medium-teal to-teal-light text-cream shadow-lg sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? '/home' : '/'} className="flex items-center gap-2 font-bold text-lg hover:opacity-90 transition">
            <img src={logo} alt="SCIT Logo" className="w-9 h-9 rounded-md object-cover bg-white" />
            <span className="hidden sm:inline">{tr.brand}</span>
            <span className="sm:hidden">{tr.shortBrand}</span>
          </Link>

          {/* Desktop - Logged in */}
          {user && (
            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/home" icon={FiHome} exact>{tr.home}</NavLink>
              <NavLink to="/raise-complaint" icon={FiPlusCircle}>{tr.raise}</NavLink>
              <NavLink to="/my-complaints" icon={FiList}>{tr.complaints}</NavLink>
              <NavLink to="/notifications" icon={FiBell}>{tr.alerts}</NavLink>
              <NavLink to="/profile" icon={FiUser}>{tr.profile}</NavLink>
              <LanguageSwitcher />
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition" title={tr.logout}>
                <FiLogOut size={20} />
                <span>{tr.logout}</span>
              </button>
            </div>
          )}

          {/* Desktop - Guest on landing: full nav */}
          {!user && isLanding && (
            <div className="hidden lg:flex items-center gap-1">
              <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition">
                <FiHome size={18} /> {tr.home}
              </button>
              <button onClick={() => scrollToSection('about')} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition">
                <FiInfo size={18} /> {tr.about}
              </button>
              <button onClick={() => scrollToSection('features')} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition">
                <FiZap size={18} /> {tr.features}
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition">
                <FiTarget size={18} /> {tr.howItWorks}
              </button>
              <Link
                to={hasRegistered ? '/login' : '/login?mode=register'}
                className="flex items-center gap-2 px-5 py-2.5 bg-vibrant-green text-deep-teal font-bold rounded-xl hover:bg-green-light hover:shadow-glow transform hover:scale-105 active:scale-100 transition-all duration-300"
              >
                {tr.getStarted} <FiArrowRight size={16} />
              </Link>
              <Link to={hasRegistered ? '/login' : '/login?mode=register'} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition">
                {hasRegistered ? tr.login : tr.register}
              </Link>
              <LanguageSwitcher />
            </div>
          )}

          {/* Desktop - Guest not on landing */}
          {!user && !isLanding && (
            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/" icon={FiHome} exact>{tr.home}</NavLink>
              <Link to={hasRegistered ? '/login' : '/login?mode=register'} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-5 py-2.5 bg-vibrant-green text-deep-teal font-bold rounded-xl hover:bg-green-light transition">
                {tr.getStarted}
              </Link>
              <LanguageSwitcher />
              <NavLink to="/login">{tr.login}</NavLink>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-white/10 transition active:scale-95"
            aria-label="Menu"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 animate-slide-down border-t border-white/20 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {user ? (
                <>
                  <NavLink to="/home" icon={FiHome} exact>{tr.home}</NavLink>
                  <NavLink to="/raise-complaint" icon={FiPlusCircle}>{tr.raiseComplaint}</NavLink>
                  <NavLink to="/my-complaints" icon={FiList}>{tr.myComplaints}</NavLink>
                  <NavLink to="/notifications" icon={FiBell}>{tr.notifications}</NavLink>
                  <NavLink to="/profile" icon={FiUser}>{tr.profile}</NavLink>
                  <LanguageSwitcher mobile />
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/10 text-left">
                    <FiLogOut size={20} /> {tr.logout}
                  </button>
                </>
              ) : isLanding ? (
                <>
                  <button onClick={() => scrollToSection('hero')} className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/10 text-left">
                    <FiHome size={20} /> {tr.home}
                  </button>
                  <button onClick={() => scrollToSection('about')} className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/10 text-left">
                    <FiInfo size={20} /> {tr.about}
                  </button>
                  <button onClick={() => scrollToSection('features')} className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/10 text-left">
                    <FiZap size={20} /> {tr.features}
                  </button>
                  <button onClick={() => scrollToSection('how-it-works')} className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/10 text-left">
                    <FiTarget size={20} /> {tr.howItWorks}
                  </button>
                  <button onClick={() => scrollToSection('benefits')} className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/10 text-left">
                    {tr.benefits}
                  </button>
                  <button onClick={() => scrollToSection('testimonials')} className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/10 text-left">
                    {tr.testimonials}
                  </button>
                  <LanguageSwitcher mobile />
                  <Link to={hasRegistered ? '/login' : '/login?mode=register'} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-vibrant-green/20 text-vibrant-green font-bold border border-vibrant-green/50">
                    {tr.getStarted} <FiArrowRight size={18} />
                  </Link>
                  <NavLink to={hasRegistered ? '/login' : '/login?mode=register'}>
                    {hasRegistered ? tr.login : tr.register}
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/" icon={FiHome} exact>{tr.home}</NavLink>
                  <LanguageSwitcher mobile />
                  <Link to={hasRegistered ? '/login' : '/login?mode=register'} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-vibrant-green/20 text-vibrant-green font-bold">
                    {tr.getStarted}
                  </Link>
                  <NavLink to="/login">{tr.login}</NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
