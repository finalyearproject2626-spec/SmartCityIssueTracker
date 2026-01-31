import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiArrowLeft, FiThumbsUp, FiThumbsDown } from 'react-icons/fi'

const Feedback = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { language } = useAuth()
  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const translations = {
    english: {
      title: 'Feedback',
      satisfied: 'Satisfied',
      notSatisfied: 'Not Satisfied',
      comment: 'Comment (Optional)',
      submit: 'Submit Feedback',
      thankYou: 'Thank you for your feedback!'
    },
    tamil: {
      title: 'கருத்து',
      satisfied: 'திருப்தி',
      notSatisfied: 'திருப்தி இல்லை',
      comment: 'கருத்து (விருப்பமானது)',
      submit: 'கருத்தை சமர்ப்பிக்கவும்',
      thankYou: 'உங்கள் கருத்துக்கு நன்றி!'
    }
  }

  const tr = translations[language] || translations.english

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return

    setLoading(true)
    try {
      await api.post(`/complaints/${id}/feedback`, { rating, comment })
      alert(tr.thankYou)
      navigate(`/complaint-details/${id}`)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="bg-gradient-teal text-cream p-6 flex items-center gap-4 shadow-teal">
        <button onClick={() => navigate(-1)} className="p-3 bg-medium-teal hover:bg-teal-light rounded-full transition-all shadow-md">
          <FiArrowLeft size={22} className="text-cream" />
        </button>
        <h1 className="text-2xl font-bold">{tr.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <p className="text-xl font-bold text-deep-teal mb-5">How satisfied are you with the resolution?</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRating('Satisfied')}
              className={`flex-1 py-5 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 ${
                rating === 'Satisfied'
                  ? 'bg-vibrant-green text-cream shadow-md'
                  : 'bg-pale-green text-deep-teal border-2 border-medium-teal'
              }`}
            >
              <FiThumbsUp size={26} />
              {tr.satisfied}
            </button>
            <button
              type="button"
              onClick={() => setRating('Not Satisfied')}
              className={`flex-1 py-5 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 ${
                rating === 'Not Satisfied'
                  ? 'bg-red-500 text-cream shadow-md'
                  : 'bg-pale-green text-deep-teal border-2 border-medium-teal'
              }`}
            >
              <FiThumbsDown size={26} />
              {tr.notSatisfied}
            </button>
          </div>
        </div>

        <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
          <label className="block text-deep-teal font-semibold mb-3">{tr.comment}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border-2 border-pale-green rounded-xl focus:outline-none focus:ring-2 focus:ring-medium-teal focus:border-medium-teal bg-white text-deep-teal"
            placeholder="Your comments..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !rating}
          className="w-full bg-gradient-primary text-cream py-5 rounded-2xl font-bold text-lg hover:shadow-teal transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none shadow-md"
        >
          {loading ? 'Submitting...' : tr.submit}
        </button>
      </form>
    </div>
  )
}

export default Feedback
