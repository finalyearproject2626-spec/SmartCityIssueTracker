import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiBell } from 'react-icons/fi'

const Notifications = () => {
  const navigate = useNavigate()
  const { language } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/complaints/my-complaints')
      const complaints = res.data
      
      const notifs = complaints
        .filter(c => c.status !== 'Pending' || c.officerRemarks)
        .map(c => ({
          id: c._id,
          title: `Complaint ${c.complaintId} - ${c.status}`,
          message: c.officerRemarks || `Your complaint status has been updated to ${c.status}`,
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
      <div className="bg-gradient-teal text-cream p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate('/home')} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-2xl font-bold">{tr.title}</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-cream p-12 rounded-2xl shadow-soft border border-pale-green text-center">
            <FiBell size={64} className="text-medium-teal mx-auto mb-4" />
            <p className="text-deep-teal text-lg font-semibold">{tr.noNotifications}</p>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => navigate(`/complaint-details/${notif.complaintId}`)}
              className="bg-cream p-5 rounded-2xl shadow-soft border border-pale-green cursor-pointer hover:shadow-teal transform hover:scale-105 transition-all"
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
