import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(options = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px' } = options
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, isVisible]
}
