import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './MagicBento.css'

const MOBILE_BREAKPOINT = 768

export default function MagicBentoEffects({ rootRef, spotlightRadius = 280, glowColor = '109, 169, 255' }) {
  const spotlightRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const disableMotion = reduceMotion || window.innerWidth <= MOBILE_BREAKPOINT
    const cards = [...root.querySelectorAll('[data-magic-bento]')]
    const cleanups = []
    const spotlight = document.createElement('div')
    spotlight.className = 'magic-bento-spotlight'
    spotlight.style.setProperty('--bento-glow-color', glowColor)
    document.body.appendChild(spotlight)
    spotlightRef.current = spotlight

    const updateGlow = event => {
      const rootRect = root.getBoundingClientRect()
      const inside = event.clientX >= rootRect.left && event.clientX <= rootRect.right && event.clientY >= rootRect.top && event.clientY <= rootRect.bottom

      if (!inside) {
        cards.forEach(card => card.style.setProperty('--bento-glow-intensity', '0'))
        gsap.to(spotlight, { opacity: 0, duration: 0.24, overwrite: true })
        return
      }

      let nearest = Infinity
      cards.forEach(card => {
        const rect = card.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 100
        const y = ((event.clientY - rect.top) / rect.height) * 100
        const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right)
        const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom)
        const distance = Math.hypot(dx, dy)
        const intensity = Math.max(0, 1 - distance / spotlightRadius)
        nearest = Math.min(nearest, distance)
        card.style.setProperty('--bento-glow-x', `${x}%`)
        card.style.setProperty('--bento-glow-y', `${y}%`)
        card.style.setProperty('--bento-glow-intensity', intensity.toFixed(3))
      })

      gsap.to(spotlight, {
        left: event.clientX,
        top: event.clientY,
        opacity: Math.max(0, 0.55 * (1 - nearest / spotlightRadius)),
        duration: 0.12,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const leaveRoot = () => {
      cards.forEach(card => card.style.setProperty('--bento-glow-intensity', '0'))
      gsap.to(spotlight, { opacity: 0, duration: 0.28, overwrite: true })
    }

    const createRipple = event => {
      if (disableMotion) return
      const card = event.target.closest?.('[data-magic-bento]')
      if (!card || !root.contains(card)) return
      const rect = card.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const radius = Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y),
      )
      const ripple = document.createElement('span')
      ripple.className = 'magic-bento-ripple'
      ripple.style.cssText = `left:${x - radius}px;top:${y - radius}px;width:${radius * 2}px;height:${radius * 2}px;`
      card.appendChild(ripple)
      gsap.fromTo(ripple, { scale: 0, opacity: 0.5 }, {
        scale: 1,
        opacity: 0,
        duration: 0.72,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      })
    }

    document.addEventListener('pointermove', updateGlow, { passive: true })
    document.addEventListener('pointerleave', leaveRoot)
    root.addEventListener('click', createRipple)

    if (!disableMotion) {
      cards.filter(card => card.dataset.magicMotion === 'true').forEach(card => {
        const move = event => {
          const rect = card.getBoundingClientRect()
          const px = (event.clientX - rect.left) / rect.width - 0.5
          const py = (event.clientY - rect.top) / rect.height - 0.5
          gsap.to(card, {
            rotateX: py * -2.4,
            rotateY: px * 2.4,
            x: px * 2,
            y: py * 2,
            transformPerspective: 1000,
            duration: 0.22,
            ease: 'power2.out',
            overwrite: true,
          })
        }
        const reset = () => gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.28, ease: 'power2.out', overwrite: true })
        card.addEventListener('pointermove', move, { passive: true })
        card.addEventListener('pointerleave', reset)
        cleanups.push(() => {
          card.removeEventListener('pointermove', move)
          card.removeEventListener('pointerleave', reset)
          gsap.killTweensOf(card)
        })
      })
    }

    return () => {
      document.removeEventListener('pointermove', updateGlow)
      document.removeEventListener('pointerleave', leaveRoot)
      root.removeEventListener('click', createRipple)
      cleanups.forEach(cleanup => cleanup())
      gsap.killTweensOf(spotlight)
      spotlight.remove()
      spotlightRef.current = null
    }
  }, [rootRef, spotlightRadius, glowColor])

  return null
}
