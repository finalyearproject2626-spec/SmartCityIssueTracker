import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiCamera, FiMapPin, FiCheckCircle, FiAlertCircle, FiFileText, FiBell, FiShield, FiNavigation, FiAward, FiUsers } from 'react-icons/fi'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useAuth } from '../../context/AuthContext'
import heroCityImage from '../../assets/hero-city.jpg'
import aboutCityImage from '../../assets/about-city.jpg'
import workflowCityImage from '../../assets/workflow-city.jpg'
import featuresCityImage from '../../assets/features-city.jpg'
import benefitsCityImage from '../../assets/benefits-city.jpg'
import testimonialsCityImage from '../../assets/testimonials-city.jpg'
import ctaCityImage from '../../assets/cta-city.jpg'
import stepSpotImage from '../../assets/about-city.jpg'
import stepSnapImage from '../../assets/workflow-city.jpg'
import stepSolveImage from '../../assets/features-city.jpg'

const ScrollSection = ({ id, children, className = '', revealClass = 'reveal-up' }) => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 })
  return (
    <section id={id} ref={ref} className={`${className} ${revealClass} ${isVisible ? 'revealed' : ''}`}>
      {children}
    </section>
  )
}

const LandingPage = () => {
  const { hash } = useLocation()
  const { language } = useAuth()
  const isTamil = language === 'tamil'
  const hasRegistered = sessionStorage.getItem('scit_registered') === 'true'
  const heroImage = heroCityImage
  const aboutImage = aboutCityImage
  const workflowImage = workflowCityImage
  const featuresImage = featuresCityImage
  const benefitsImage = benefitsCityImage
  const testimonialsImage = testimonialsCityImage
  const ctaImage = ctaCityImage
  const tr = {
    heroTag: isTamil ? 'மக்களுக்கான நகராட்சி சேவை தளம்' : 'Civic Issue Reporting for Citizens',
    heroTitle1: isTamil ? 'சேவைகளை எளிமைப்படுத்தி,' : 'Simplifying The',
    heroTitle2a: isTamil ? 'குடிமக்கள் சேவை கோரிக்கைகள்,' : 'Service Requests,',
    heroTitle2b: isTamil ? 'சிக்கல்களை விரைவில் தீர்ப்போம்' : "Resolving Citizen's Issues",
    heroDesc: isTamil ? 'அவசரமற்ற அரசு சேவைகளுக்கான நம்பகமான தளம். புகாரளித்து, நிலையை கண்காணித்து, நகரத்தை சிறப்பாக்குங்கள்.' : 'SmartCity 311 is a robust application for availing non-emergency government services. Report civic issues, track resolution, and make your city more livable.',
    getStarted: isTamil ? 'தொடங்கு' : 'Get Started',
    login: isTamil ? 'உள்நுழை' : 'Login',
    register: isTamil ? 'பதிவு' : 'Register',
    citizens: isTamil ? 'மக்கள்' : 'Citizens',
    states: isTamil ? 'இந்திய மாநிலங்கள்' : 'Indian States',
    bodies: isTamil ? 'மாநகர நிர்வாகங்கள்' : 'Municipal Bodies',
    officers: isTamil ? 'அரசு அதிகாரிகள்' : 'Government Officers',
    aboutUs: isTamil ? 'எங்களை பற்றி' : 'About Us',
    civicSolutions: isTamil ? 'சிவிக் சால்யூஷன்ஸ்' : 'Civic Solutions',
    aboutP1: isTamil ? 'ஸ்மார்ட் சிட்டி 311 என்பது அவசரமற்ற நகராட்சி சேவை புகார்களை பதிவு செய்து விரைவாக தீர்க்க உதவும் தளம்.' : 'SmartCity 311 is a flagship civic application for lodging complaints for non-emergency civic services and resolving them quickly. It bridges the gap between civilians and government authorities.',
    aboutP2: isTamil ? 'மக்கள் தங்கள் புகார்களை கண்காணித்து, புதுப்பிப்புகளை பெற்று, தெளிவான தீர்வைப் பெறலாம்.' : 'Citizens can monitor their complaints, resolve issues, and get updates conveniently. Our app ensures accountability and transparency in government operations.',
    achievement: isTamil ? 'சாதனை' : 'Achievement',
    howTag: isTamil ? 'செயல்திறன் மிக்க ஸ்மார்ட் நகர தீர்வு' : 'Effective Smart City Solution',
    howTitle: isTamil ? '3 கட்டங்களில் புகார் தீர்வு முறை' : '3-Step Citizen Complaints Resolution System',
    howDesc: isTamil ? 'சிக்கலை கண்டறிந்து, புகைப்படம் எடுத்து, நாங்கள் தீர்க்கிறோம்.' : "Spot the issue, snap a photo, and we'll solve it. Simple and effective.",
    spot: isTamil ? 'கண்டறி' : 'Spot',
    snap: isTamil ? 'படமெடு' : 'Snap',
    solve: isTamil ? 'தீர்வு' : 'Solve',
    spotDesc: isTamil ? 'சாலை, தண்ணீர், குப்பை, தெருவிளக்கு போன்ற நகர பிரச்சினைகளை கண்டறியவும்.' : 'Find a civic issue-roads, water, waste, street lights, and more.',
    snapDesc: isTamil ? 'இடத்துடன் புகைப்படம் பிடித்து பதிவேற்றவும்.' : 'Capture with location. Upload from device or use camera directly.',
    solveDesc: isTamil ? 'நிலையை கண்காணித்து, தீர்வு ஆதாரங்களைப் பெறுங்கள்.' : 'Track status, get updates, receive resolution proof when fixed.',
    featureTag: isTamil ? 'மக்களுக்கான அவசரமற்ற சேவை தளம்' : 'Your Citizen Non-Emergency Service Application',
    featureTitle: isTamil ? 'ஸ்மார்ட் நகர சேவைகளின் முக்கிய கூறுகள்' : 'Key Modules for Smart City Services',
    featureDesc: isTamil ? 'புகாரளிக்கவும் கண்காணிக்கவும் தேவையான அனைத்தும்' : 'Everything you need to report and track civic issues',
    complaints: isTamil ? 'புகார்கள்' : 'Complaints',
    complaintsDesc: isTamil ? 'சாலை, தண்ணீர், மின்சாரம், குப்பை, வடிகால், தெருவிளக்கு உள்ளிட்டவை.' : 'Road, Water, Electricity, Waste, Drainage, Street Light & more.',
    realtime: isTamil ? 'நேரடி புதுப்பிப்புகள்' : 'Real-time Updates',
    realtimeDesc: isTamil ? 'Pending, In Progress, Resolved நிலைமாற்றங்களை உடனே அறியுங்கள்.' : 'Get notified when status changes-Pending, In Progress, Resolved.',
    proof: isTamil ? 'தீர்வு ஆதாரம்' : 'Resolution Proof',
    proofDesc: isTamil ? 'சரிசெய்த பிறகு ஆதாரப் படங்களைப் பெறுங்கள்.' : 'Receive proof images when fixed. Track everything in one place.',
    secure: isTamil ? 'பாதுகாப்பான & நம்பகமான' : 'Secure & Reliable',
    secureDesc: isTamil ? 'உங்கள் தரவு பாதுகாப்பாகும். அரசு தர நம்பகத்தன்மை.' : 'Your data is secure. Government-grade reliability.',
    benefitsTitle: isTamil ? 'சிவிக் சால்யூஷன்ஸ் முக்கிய நன்மைகள்' : 'Top Benefits of Civic Solutions',
    forCitizens: isTamil ? 'மக்களுக்கு' : 'For Citizens',
    forOfficials: isTamil ? 'நகர நிர்வாகிகளுக்கு' : 'For City Officials',
    testimonialsTag: isTamil ? 'மக்கள் கருத்துகள்' : 'What Citizens Say',
    testimonialsTitle: isTamil ? 'நம்பகமான மின்நிர்வாக தீர்வு' : 'Robust & Reliable E-Governance Solution',
    quote: isTamil ? 'கடந்த ஒரு ஆண்டாக எங்கள் துறை இந்த பயன்பாட்டை புகார்களை ஆன்லைனில் பதிவு செய்ய பயன்படுத்துகிறது. இது விரைவான தீர்வுக்கு உதவுகிறது.' : '"From last one year, our Department is using this app for marking complaints online that helps make real-time entry. It helps maintain discipline and quick resolution in our city."',
    officerRole: isTamil ? 'துணை சுகாதார அதிகாரி, தெற்கு மண்டலம்' : 'Deputy Health Officer, South Zone',
    ctaTag: isTamil ? 'எளிமையான மற்றும் நெகிழ்வான' : 'Simple and Seamless',
    ctaTitle: isTamil ? 'தொடங்க தயாரா?' : 'Ready to Get Started?',
    ctaDesc: isTamil ? 'உங்கள் நகரத்தை மேம்படுத்தும் மக்களுடன் இணையுங்கள். பயன்படுத்த எளிதான இடைமுகம்.' : 'Join citizens making their cities smarter. Intuitive interface, no training required.',
    ctaButton: isTamil ? 'இப்போது தொடங்கவும்' : 'Get Started Now',
    citizenBenefits: isTamil
      ? ['சுலப அணுகல் - புகார் அளிக்க எளிய தளம்', 'கண்காணிப்பு - நிலை மற்றும் முன்னேற்றம் தெரியும்', 'பங்கேற்பு - உங்கள் குரல் நகராட்சியிடம் சேரும்', 'வேகமான பதில் - மக்கள் மற்றும் அதிகாரிகள் இணைப்பு']
      : ['Improved Access - Convenient platform for reporting issues', 'Enhanced Accountability - Track status and progress', 'Increased Engagement - Voice concerns and participate', 'Quicker Response - Bridge between citizens and authorities'],
    officialBenefits: isTamil
      ? ['வேலைப்பாசறை எளிமை - காகிதப்பணிகள் குறைவு', 'தரவின் அடிப்படையிலான முடிவுகள்', 'துறைகள் இடையேயான ஒத்துழைப்பு அதிகரிப்பு']
      : ['Streamlined Workflow - Reduce paperwork', 'Data-driven Decisions - Valuable insights', 'Enhanced Collaboration - Between departments']
  }

  useEffect(() => {
    const id = hash?.slice(1)
    if (id) {
      const el = document.getElementById(id)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    }
  }, [hash])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] sm:min-h-[95vh] flex items-center bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light text-cream overflow-hidden">
        <img
          src={heroImage}
          alt="Smart city skyline"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-20 left-10 w-80 h-80 bg-vibrant-green rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pale-green rounded-full blur-3xl animate-float animate-delay-200" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-light rounded-full blur-3xl animate-float-slow animate-delay-300" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-pale-green font-semibold text-sm sm:text-base uppercase tracking-[0.2em] mb-4 opacity-0 animate-fade-in-up">
              {tr.heroTag}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[1.1] opacity-0 animate-fade-in-up animate-delay-100">
              {tr.heroTitle1}
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight opacity-0 animate-fade-in-up animate-delay-150">
              <span className="text-vibrant-green">{tr.heroTitle2a}</span>
              <br />
              <span>{tr.heroTitle2b}</span>
            </h1>
            <p className="text-lg sm:text-xl text-pale-green/95 mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up animate-delay-200">
              {tr.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up animate-delay-300">
              <Link
                to={hasRegistered ? '/login' : '/login?mode=register'}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-vibrant-green text-deep-teal font-bold rounded-xl hover:bg-green-light hover:shadow-glow transform hover:scale-105 active:scale-100 transition-all duration-300 shadow-lg animate-pulse-soft"
              >
                {tr.getStarted}
              </Link>
              <Link
                to={hasRegistered ? '/login' : '/login?mode=register'}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/10 text-cream font-bold rounded-xl border-2 border-cream/50 hover:bg-white/20 hover:border-cream transition-all duration-300"
              >
                {hasRegistered ? tr.login : tr.register}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar - SmartCity 311 style */}
      <section className="py-10 sm:py-12 bg-deep-teal text-cream -mt-1">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center stagger-children">
            <div className="animate-fade-in-up">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-vibrant-green">2.5M+</p>
              <p className="text-pale-green text-sm sm:text-base mt-1">{tr.citizens}</p>
            </div>
            <div className="animate-fade-in-up animate-delay-100">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-vibrant-green">12+</p>
              <p className="text-pale-green text-sm sm:text-base mt-1">{tr.states}</p>
            </div>
            <div className="animate-fade-in-up animate-delay-200">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-vibrant-green">38</p>
              <p className="text-pale-green text-sm sm:text-base mt-1">{tr.bodies}</p>
            </div>
            <div className="animate-fade-in-up animate-delay-300 col-span-2 md:col-span-1">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-vibrant-green">89K+</p>
              <p className="text-pale-green text-sm sm:text-base mt-1">{tr.officers}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About / Civic Solutions */}
      <ScrollSection id="about" className="py-16 sm:py-24 bg-gradient-soft">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-medium-teal font-semibold uppercase tracking-wider mb-3">{tr.aboutUs}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-deep-teal mb-6">{tr.civicSolutions}</h2>
              <p className="text-medium-teal leading-relaxed mb-4">
                {tr.aboutP1}
              </p>
              <p className="text-medium-teal leading-relaxed mb-6">
                {tr.aboutP2}
              </p>
              <Link to={hasRegistered ? '/login' : '/login?mode=register'} className="inline-flex items-center gap-2 px-6 py-3 bg-deep-teal text-cream font-semibold rounded-xl hover:bg-medium-teal transition-all duration-300">
                {tr.getStarted}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl overflow-hidden border border-pale-green shadow-soft">
                <img src={aboutImage} alt="Urban governance" className="w-full h-56 object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green text-center hover:shadow-teal hover:border-medium-teal/30 transition-all duration-300 hover:scale-[1.02]">
                  <FiAward className="mx-auto text-deep-teal mb-3" size={32} />
                  <p className="text-2xl font-bold text-deep-teal">{i}</p>
                  <p className="text-sm text-medium-teal mt-1">{tr.achievement}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* 3-Step Process - How It Works */}
      <ScrollSection id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-medium-teal font-semibold uppercase tracking-wider text-center mb-3">{tr.howTag}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-deep-teal text-center mb-4">
            {tr.howTitle}
          </h2>
          <p className="text-medium-teal text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            {tr.howDesc}
          </p>
          <div className="relative">
            <div className="hidden md:block absolute left-0 right-0 top-20 h-px border-t-2 border-dashed border-medium-teal/30" />
            <div className="grid md:grid-cols-3 gap-8 sm:gap-10 relative">
              {[
                { num: 1, title: tr.spot, desc: tr.spotDesc, image: stepSpotImage, icon: FiMapPin },
                { num: 2, title: tr.snap, desc: tr.snapDesc, image: stepSnapImage, icon: FiCamera },
                { num: 3, title: tr.solve, desc: tr.solveDesc, image: stepSolveImage, icon: FiCheckCircle }
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full mx-auto overflow-hidden border-[5px] border-sky-400 shadow-soft">
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-deep-teal/15" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-cream flex items-center justify-center">
                      <step.icon className="text-deep-teal" size={16} />
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-deep-teal mt-5">{step.num}</p>
                  <h3 className="text-xl font-bold text-medium-teal mt-1">{step.title}</h3>
                  <p className="text-medium-teal text-sm sm:text-base mt-3 max-w-xs mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to={hasRegistered ? '/login' : '/login?mode=register'} className="inline-flex items-center gap-2 px-8 py-4 bg-vibrant-green text-deep-teal font-bold rounded-xl hover:bg-green-light hover:shadow-glow transform hover:scale-105 transition-all duration-300">
              {tr.getStarted}
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* Key Features */}
      <ScrollSection id="features" className="py-16 sm:py-24 bg-gradient-soft">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl overflow-hidden border border-pale-green shadow-soft mb-12">
            <img src={featuresImage} alt="Smart city feature overview" className="w-full h-60 sm:h-72 object-cover" />
          </div>
          <p className="text-medium-teal font-semibold uppercase tracking-wider text-center mb-3">{tr.featureTag}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-deep-teal text-center mb-4">
            {tr.featureTitle}
          </h2>
          <p className="text-medium-teal text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            {tr.featureDesc}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex gap-4 p-5 sm:p-6 rounded-2xl border-2 border-pale-green hover:border-medium-teal hover:shadow-soft transition-all duration-300 group bg-cream hover:scale-[1.02]">
              <div className="w-14 h-14 bg-pale-green rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-medium-teal/20 group-hover:scale-110 transition">
                <FiAlertCircle className="text-deep-teal" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-deep-teal text-lg mb-2">{tr.complaints}</h3>
                <p className="text-medium-teal text-sm">{tr.complaintsDesc}</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 sm:p-6 rounded-2xl border-2 border-pale-green hover:border-medium-teal hover:shadow-soft transition-all duration-300 group bg-cream hover:scale-[1.02]">
              <div className="w-14 h-14 bg-pale-green rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-medium-teal/20 group-hover:scale-110 transition">
                <FiBell className="text-deep-teal" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-deep-teal text-lg mb-2">{tr.realtime}</h3>
                <p className="text-medium-teal text-sm">{tr.realtimeDesc}</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 sm:p-6 rounded-2xl border-2 border-pale-green hover:border-medium-teal hover:shadow-soft transition-all duration-300 group bg-cream hover:scale-[1.02]">
              <div className="w-14 h-14 bg-pale-green rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-medium-teal/20 group-hover:scale-110 transition">
                <FiFileText className="text-deep-teal" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-deep-teal text-lg mb-2">{tr.proof}</h3>
                <p className="text-medium-teal text-sm">{tr.proofDesc}</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 sm:p-6 rounded-2xl border-2 border-pale-green hover:border-medium-teal hover:shadow-soft transition-all duration-300 group bg-cream hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-pale-green rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-medium-teal/20 group-hover:scale-110 transition">
                <FiShield className="text-deep-teal" size={28} />
              </div>
              <div>
                <h3 className="font-bold text-deep-teal text-lg mb-2">{tr.secure}</h3>
                <p className="text-medium-teal text-sm">{tr.secureDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Benefits - Citizens vs Officials */}
      <ScrollSection id="benefits" className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl overflow-hidden border border-pale-green shadow-soft mb-12">
            <img src={benefitsImage} alt="Citizens and officials collaboration" className="w-full h-60 sm:h-72 object-cover" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-deep-teal text-center mb-12">
            {tr.benefitsTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-cream p-6 sm:p-8 rounded-2xl border-2 border-pale-green hover:border-medium-teal/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <FiUsers className="text-deep-teal" size={32} />
                <h3 className="text-xl font-bold text-deep-teal">{tr.forCitizens}</h3>
              </div>
              <ul className="space-y-4">
                {tr.citizenBenefits.map((item, i) => (
                  <li key={i} className="flex gap-2 text-medium-teal">
                    <FiCheckCircle className="text-vibrant-green flex-shrink-0 mt-0.5" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-cream p-6 sm:p-8 rounded-2xl border-2 border-pale-green hover:border-medium-teal/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <FiNavigation className="text-deep-teal" size={32} />
                <h3 className="text-xl font-bold text-deep-teal">{tr.forOfficials}</h3>
              </div>
              <ul className="space-y-4">
                {tr.officialBenefits.map((item, i) => (
                  <li key={i} className="flex gap-2 text-medium-teal">
                    <FiCheckCircle className="text-vibrant-green flex-shrink-0 mt-0.5" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Testimonials */}
      <ScrollSection id="testimonials" className="py-16 sm:py-24 bg-gradient-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl overflow-hidden border border-pale-green shadow-soft mb-10">
            <img src={testimonialsImage} alt="Citizens sharing feedback" className="w-full h-56 sm:h-64 object-cover" />
          </div>
          <p className="text-medium-teal font-semibold uppercase tracking-wider text-center mb-3">{tr.testimonialsTag}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-deep-teal text-center mb-12">
            {tr.testimonialsTitle}
          </h2>
          <div className="bg-cream p-6 sm:p-10 rounded-2xl shadow-soft border border-pale-green">
            <p className="text-medium-teal text-lg sm:text-xl italic mb-6">
              {tr.quote}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-teal rounded-full flex items-center justify-center text-cream font-bold text-xl">
                GM
              </div>
              <div>
                <p className="font-bold text-deep-teal">Govind Makwana</p>
                <p className="text-sm text-medium-teal">{tr.officerRole}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* CTA Section */}
      <ScrollSection id="get-started" className="py-16 sm:py-24 bg-gradient-primary text-cream">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden border border-cream/20 shadow-soft">
            <img src={ctaImage} alt="Modern smart city skyline" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-deep-teal/65" />
            <div className="relative text-center px-6 py-16 sm:py-20">
          <p className="text-pale-green font-semibold uppercase tracking-wider mb-3">{tr.ctaTag}</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">{tr.ctaTitle}</h2>
          <p className="text-pale-green text-lg mb-8">{tr.ctaDesc}</p>
          <Link
            to={hasRegistered ? '/login' : '/login?mode=register'}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-vibrant-green text-deep-teal font-bold rounded-xl hover:bg-green-light hover:shadow-glow transform hover:scale-105 active:scale-100 transition-all duration-300 shadow-lg"
          >
            {tr.ctaButton}
          </Link>
            </div>
          </div>
        </div>
      </ScrollSection>
    </div>
  )
}

export default LandingPage
