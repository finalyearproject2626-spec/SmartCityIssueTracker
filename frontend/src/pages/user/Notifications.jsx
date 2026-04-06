import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiBell } from 'react-icons/fi'
import { complaintStatusLabel } from '../../utils/complaintLabels'

const Notifications = () => {
  const navigate = useNavigate()
  const { language } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [language])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/complaints/my-complaints')
      const complaints = res.data
      
      const isTa = language === 'tamil'
      const label = (s) => complaintStatusLabel(language, s)
      const notifs = complaints
        .filter(c => c.status !== 'Pending' || c.officerRemarks)
        .map(c => ({
          id: c._id,
          title: isTa
            ? `புகார் ${c.complaintId} - ${label(c.status)}`
            : `Complaint ${c.complaintId} - ${c.status}`,
          message: c.officerRemarks || (isTa
            ? `உங்கள் புகார் நிலை ${label(c.status)} என புதுப்பிக்கப்பட்டது`
            : `Your complaint status has been updated to ${c.status}`),
          date: c.updatedAt || c.createdAt,
          complaintId: c._id
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      
      setNotifications(notifs)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const translations = {
    english: {
      title: 'Notifications',
      noNotifications: 'No notifications yet'
    },
    tamil: {
      title: 'அறிவிப்புகள்',
      noNotifications: 'இன்னும் அறிவிப்புகள் இல்லை'
    }
  }

  const tr = translations[language] || translations.english

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-to-br from-deep-teal via-medium-teal to-teal-light text-cream p-4 sm:p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/home')} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">{tr.title}</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-cream p-12 rounded-2xl shadow-soft border border-pale-green text-center">
            <FiBell size={64} className="text-medium-teal mx-auto mb-4" />
            <p className="text-deep-teal text-lg font-semibold">{tr.noNotifications}</p>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => navigate(`/complaint-details/${notif.complaintId}`)}
              className="bg-cream p-4 sm:p-5 rounded-2xl shadow-soft border border-pale-green cursor-pointer hover:shadow-teal hover:border-medium-teal/30 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              <h3 className="font-bold text-deep-teal text-lg mb-2">{notif.title}</h3>
              <p className="text-medium-teal mb-3">{notif.message}</p>
              <p className="text-xs text-medium-teal">
                {new Date(notif.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
