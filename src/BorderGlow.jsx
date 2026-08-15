import { useEffect } from 'react'

export default function BorderGlowEffects({ rootRef, edgeSensitivity = 28 }) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const cards = [...root.querySelectorAll('[data-border-glow]')]
    const cleanups = cards.map(card => {
      card.style.setProperty('--edge-sensitivity', String(edgeSensitivity))
      const edge = document.createElement('span')
      const fill = document.createElement('span')
      edge.className = 'border-glow-edge'
      fill.className = 'border-glow-fill'
      edge.setAttribute('aria-hidden', 'true')
      fill.setAttribute('aria-hidden', 'true')
      card.append(edge, fill)

      const move = event => {
        const rect = card.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        const cx = rect.width / 2
        const cy = rect.height / 2
        const dx = x - cx
        const dy = y - cy
        const kx = dx === 0 ? Infinity : cx / Math.abs(dx)
        const ky = dy === 0 ? Infinity : cy / Math.abs(dy)
        const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1) * 100
        const intensity = Math.max(0, Math.min(1, (proximity - edgeSensitivity) / (100 - edgeSensitivity)))
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
        if (angle < 0) angle += 360
        card.style.setProperty('--edge-proximity', proximity.toFixed(3))
        card.style.setProperty('--edge-intensity', intensity.toFixed(3))
        card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
        card.style.setProperty('--glow-x', `${((x / rect.width) * 100).toFixed(2)}%`)
        card.style.setProperty('--glow-y', `${((y / rect.height) * 100).toFixed(2)}%`)
      }
      const leave = () => card.style.setProperty('--edge-intensity', '0')
      card.addEventListener('pointermove', move, { passive: true })
      card.addEventListener('pointerleave', leave)
      return () => {
        card.removeEventListener('pointermove', move)
        card.removeEventListener('pointerleave', leave)
        edge.remove()
        fill.remove()
      }
    })

    return () => cleanups.forEach(cleanup => cleanup())
  }, [rootRef, edgeSensitivity])

  return null
}
