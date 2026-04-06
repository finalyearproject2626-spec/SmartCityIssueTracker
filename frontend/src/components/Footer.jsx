import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiPhone, FiMapPin, FiHome } from 'react-icons/fi'
import logo from '../assets/logo.png'

const Footer = () => {
  const { user, admin, language } = useAuth()
  const location = useLocation()
  const currentYear = new Date().getFullYear()
  const isLanding = location.pathname === '/'
  const isTamil = language === 'tamil'

  const tr = {
    brand: isTamil ? 'ஸ்மார்ட் சிட்டி சிக்கல் டிராக்கர்' : 'Smart City Issue Tracker',
    desc: isTamil
      ? 'மக்களுக்கான நகராட்சி சேவை புகார் தளம். புகாரளி, நிலையை கண்காணி, தீர்வைப் பெறு.'
      : 'Civic issue reporting for citizens. Report, track, and resolve non-emergency government services. Spot, Snap, Solve.',
    quickLinks: isTamil ? 'விரைவு இணைப்புகள்' : 'Quick Links',
    home: isTamil ? 'முகப்பு' : 'Home',
    about: isTamil ? 'எங்களை பற்றி' : 'About',
    features: isTamil ? 'அம்சங்கள்' : 'Features',
    howItWorks: isTamil ? 'எப்படி செயல்படும்' : 'How It Works',
    getStarted: isTamil ? 'தொடங்கு' : 'Get Started',
    raiseComplaint: isTamil ? 'புகார் செய்' : 'Raise complaint',
    myComplaints: isTamil ? 'என் புகார்கள்' : 'My Complaints',
    notifications: isTamil ? 'அறிவிப்புகள்' : 'Notifications',
    login: isTamil ? 'உள்நுழை' : 'Login',
    adminDashboard: isTamil ? 'நிர்வாக டாஷ்போர்ட்' : 'Admin Dashboard',
    complaints: isTamil ? 'புகார்கள்' : 'Complaints',
    featureListTitle: isTamil ? 'அம்சங்கள்' : 'Features',
    f1: isTamil ? 'ஸ்பாட், ஸ்னாப், சால்வ்' : 'Spot, Snap, Solve',
    f2: isTamil ? 'நேரடி நிலை புதுப்பிப்புகள்' : 'Real-time Status Updates',
    f3: isTamil ? 'தீர்வு ஆதாரம்' : 'Resolution Proof',
    f4: isTamil ? 'இருமொழி ஆதரவு' : 'Multi-language Support',
    contact: isTamil ? 'தொடர்பு' : 'Contact',
    helpline: isTamil ? '24x7 உதவி எண்' : '24x7 Helpline',
    copyright: isTamil
      ? `© ${currentYear} ஸ்மார்ட் சிட்டி சிக்கல் டிராக்கர். நம் நகரைச் சிறப்பாக மாற்றுவோம்.`
      : `© ${currentYear} Smart City Issue Tracker. Making our city smarter together.`,
    poweredBy: isTamil ? 'சிவிக் சால்யூஷன்ஸ் வழங்குகிறது' : 'Powered by Civic Solutions'
  }

  const scrollTo = (id) => {
    if (!isLanding) return
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="bg-deep-teal text-cream mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SCIT Logo" className="w-10 h-10 rounded-md object-cover bg-white" />
              <span className="font-bold text-lg">{tr.brand}</span>
            </div>
            <p className="text-pale-green text-sm leading-relaxed">
              {tr.desc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-cream mb-4 text-base">{tr.quickLinks}</h4>
            <div className="flex flex-col gap-3 text-sm text-pale-green">
              {isLanding && !user ? (
                <>
                  <button onClick={() => scrollTo('hero')} className="text-left hover:text-cream transition flex items-center gap-2">
                    <FiHome size={16} /> {tr.home}
                  </button>
                  <button onClick={() => scrollTo('about')} className="text-left hover:text-cream transition">{tr.about}</button>
                  <button onClick={() => scrollTo('features')} className="text-left hover:text-cream transition">{tr.features}</button>
                  <button onClick={() => scrollTo('how-it-works')} className="text-left hover:text-cream transition">{tr.howItWorks}</button>
                  <button onClick={() => scrollTo('get-started')} className="text-left hover:text-cream transition">{tr.getStarted}</button>
                </>
              ) : (
                <>
                  <Link to={user ? '/home' : '/'} className="hover:text-cream transition flex items-center gap-2">
                    <FiHome size={16} /> {tr.home}
                  </Link>
                  {user && (
                    <>
                      <Link to="/raise-complaint" className="hover:text-cream transition">{tr.raiseComplaint}</Link>
                      <Link to="/my-complaints" className="hover:text-cream transition">{tr.myComplaints}</Link>
                      <Link to="/notifications" className="hover:text-cream transition">{tr.notifications}</Link>
                    </>
                  )}
                  {!user && <Link to="/login" className="hover:text-cream transition">{tr.login}</Link>}
                  {admin && (
                    <>
                      <Link to="/admin/dashboard" className="hover:text-cream transition">{tr.adminDashboard}</Link>
                      <Link to="/admin/complaints" className="hover:text-cream transition">{tr.complaints}</Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-cream mb-4 text-base">{tr.featureListTitle}</h4>
            <ul className="text-sm text-pale-green space-y-3">
              <li className="flex items-center gap-2">• {tr.f1}</li>
              <li className="flex items-center gap-2">• {tr.f2}</li>
              <li className="flex items-center gap-2">• {tr.f3}</li>
              <li className="flex items-center gap-2">• {tr.f4}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-cream mb-4 text-base">{tr.contact}</h4>
            <div className="text-sm text-pale-green space-y-3">
              <p className="flex items-center gap-2 hover:text-cream transition">
                <FiMail size={16} className="flex-shrink-0" />
                info@smartcity.gov
              </p>
              <p className="flex items-center gap-2 hover:text-cream transition">
                <FiPhone size={16} className="flex-shrink-0" />
                {tr.helpline}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-medium-teal/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-pale-green">
          <p>{tr.copyright}</p>
          <p className="font-medium">{tr.poweredBy}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
