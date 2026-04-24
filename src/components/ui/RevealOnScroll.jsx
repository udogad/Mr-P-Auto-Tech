import { useInView } from '../../hooks/useInView'

/**
 * Wraps children and adds a scroll-triggered reveal animation.
 * direction: 'up' | 'left' | 'right' | 'scale'
 */
export default function RevealOnScroll({ children, direction = 'up', delay = 0, className = '', threshold = 0.12, style, ...rest }) {
  const { ref, isInView } = useInView({ threshold })

  const classMap = {
    up: 'reveal',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  }

  const animClass = classMap[direction] || 'reveal'

  const mergedStyle = {
    ...(style || {}),
    ...(delay ? { transitionDelay: `${delay}ms` } : {}),
  }

  return (
    <div
      ref={ref}
      className={`${animClass} ${isInView ? 'is-visible' : ''} ${className}`}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </div>
  )
}
