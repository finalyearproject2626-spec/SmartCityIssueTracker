import { useState } from 'react'
import { FiX } from 'react-icons/fi'

/**
 * Displays images fully viewable (no crop). Click to open full-size overlay.
 * Use for complaint images and resolution proof so nothing is hidden.
 */
const ImageViewer = ({ images = [], title = 'Images', altPrefix = 'Image' }) => {
  const [fullscreenUrl, setFullscreenUrl] = useState(null)

  const validImages = images.filter(img => img && typeof img === 'string')

  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '')
  const getImageUrl = (img) => {
    if (img.startsWith('http')) return img
    return `${apiBase}/uploads/${img}`
  }

  if (validImages.length === 0) return null

  return (
    <>
      <div className="bg-cream p-6 rounded-2xl shadow-soft border border-pale-green">
        <h3 className="font-bold text-xl mb-4 text-deep-teal">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {validImages.map((img, idx) => {
            const src = getImageUrl(img)
            return (
              <div
                key={idx}
                className="rounded-xl border-2 border-pale-green overflow-hidden bg-white"
              >
                <button
                  type="button"
                  onClick={() => setFullscreenUrl(src)}
                  className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-medium-teal focus:ring-inset"
                >
                  <img
                    src={src}
                    alt={`${altPrefix} ${idx + 1}`}
                    className="w-full min-h-[200px] max-h-[400px] object-contain"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23d1fae5" width="200" height="200"/%3E%3Ctext fill="%231a4d4d" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </button>
                <p className="text-center text-sm text-medium-teal py-2">Click to view full size</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Fullscreen overlay - full image, nothing hidden */}
      {fullscreenUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setFullscreenUrl(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && setFullscreenUrl(null)}
          aria-label="Close"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setFullscreenUrl(null) }}
            className="absolute top-4 right-4 p-3 rounded-full bg-white text-deep-teal hover:bg-cream shadow-lg z-[101] border-2 border-pale-green"
            aria-label="Close image"
            title="Close"
          >
            <FiX size={28} strokeWidth={2.5} />
          </button>
          <img
            src={fullscreenUrl}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export default ImageViewer
