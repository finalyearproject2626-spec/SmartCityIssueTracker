import { useState, useRef, useEffect } from 'react'
import { FiCamera, FiUpload, FiX } from 'react-icons/fi'

/**
 * Upload from device OR capture from camera. Supports both in one UI.
 * @param {Object} props
 * @param {File[]} props.files - Current list of files
 * @param {function(File[])} props.onChange - Called when files change (e.g. setFiles)
 * @param {string} [props.accept='image/*'] - Accept attribute for file input (e.g. 'image/*,video/*')
 * @param {boolean} [props.multiple=true]
 * @param {string} [props.label='Upload or capture']
 */
const ImageUploadWithCamera = ({ files = [], onChange, accept = 'image/*', multiple = true, label = 'Upload or capture' }) => {
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    if (!cameraOpen) {
      stopStream()
      setCameraError(null)
    }
    return () => stopStream()
  }, [cameraOpen])

  useEffect(() => {
    if (!cameraOpen || !videoRef.current) return
    let cancelled = false
    setCameraError(null)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch((err) => {
        if (!cancelled) setCameraError(err.message || 'Camera access denied')
      })
    return () => { cancelled = true }
  }, [cameraOpen])

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return
    if (multiple) {
      onChange([...files, ...selected])
    } else {
      onChange(selected.length ? [selected[0]] : [])
    }
    e.target.value = ''
  }

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video || !streamRef.current || video.readyState !== 4) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
      if (multiple) {
        onChange([...files, file])
      } else {
        onChange([file])
      }
      setCameraOpen(false)
    }, 'image/jpeg', 0.9)
  }

  const removeFile = (index) => {
    const next = files.filter((_, i) => i !== index)
    onChange(next)
  }

  const previewUrlsRef = useRef([])
  const [previewUrls, setPreviewUrls] = useState([])
  useEffect(() => {
    previewUrlsRef.current.forEach(u => URL.revokeObjectURL(u))
    const imageFiles = files.filter(f => f && f.type.startsWith('image/'))
    const newUrls = imageFiles.map(f => URL.createObjectURL(f))
    previewUrlsRef.current = newUrls
    setPreviewUrls(newUrls)
    return () => {
      previewUrlsRef.current.forEach(u => URL.revokeObjectURL(u))
      previewUrlsRef.current = []
    }
  }, [files])

  return (
    <div className="space-y-3">
      <label className="block text-deep-teal font-semibold">{label}</label>

      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-pale-green rounded-xl bg-white text-deep-teal font-semibold cursor-pointer hover:bg-pale-green transition">
          <FiUpload size={20} />
          <span>Choose from device</span>
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <button
          type="button"
          onClick={() => setCameraOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-pale-green rounded-xl bg-white text-deep-teal font-semibold hover:bg-pale-green transition"
        >
          <FiCamera size={20} />
          <span>Capture from camera</span>
        </button>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((file, idx) => {
            const imageFiles = files.filter(f => f && f.type.startsWith('image/'))
            const imageIndex = imageFiles.indexOf(file)
            const previewUrl = file.type.startsWith('image/') && previewUrls[imageIndex]
            return (
            <div key={idx} className="relative group">
              {file.type.startsWith('image/') && previewUrl ? (
                <img
                  src={previewUrl}
                  alt={`Preview ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-pale-green"
                />
              ) : file.type.startsWith('image/') ? (
                <div className="w-20 h-20 rounded-lg border-2 border-pale-green bg-pale-green flex items-center justify-center text-deep-teal text-xs">…</div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-pale-green bg-pale-green flex items-center justify-center text-deep-teal text-xs font-semibold">
                  Video
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove"
              >
                <FiX size={14} />
              </button>
            </div>
          ); })}
          <span className="text-sm text-medium-teal self-center">{files.length} file(s)</span>
        </div>
      )}

      {/* Camera modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-4">
          <div className="bg-cream rounded-2xl shadow-soft border border-pale-green overflow-hidden max-w-lg w-full">
            <div className="p-4 flex justify-between items-center border-b border-pale-green">
              <h3 className="font-bold text-lg text-deep-teal">Capture from camera</h3>
              <button
                type="button"
                onClick={() => setCameraOpen(false)}
                className="p-2 rounded-full hover:bg-pale-green transition"
                aria-label="Close"
              >
                <FiX size={24} className="text-deep-teal" />
              </button>
            </div>
            <div className="p-4">
              {cameraError ? (
                <p className="text-red-600 text-sm py-4">{cameraError}</p>
              ) : (
                <>
                  <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-4 bg-gradient-primary text-cream rounded-xl font-bold hover:shadow-teal transition"
                  >
                    <FiCamera size={22} />
                    Take photo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploadWithCamera
