import { useState, useEffect, useRef } from 'react'

export function useCounter(target, duration = 1800, shouldStart = false) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!shouldStart || target === 0) return
    let startTime = null
    const startVal = 0

    function step(timestamp) {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease-out quad
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(startVal + eased * (target - startVal)))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, shouldStart])

  return count
}
