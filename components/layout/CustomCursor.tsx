'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Touch devices — hide cursor elements and return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let rafId: number
    let visible = false

    // Show cursor on first move
    const show = () => {
      if (!visible) {
        visible = true
        ring.style.opacity = '1'
        dot.style.opacity = '1'
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      show()

      // Dot follows instantly
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`

      // Check hover state
      const target = e.target as HTMLElement
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer'

      if (isClickable) {
        ring.style.width = '48px'
        ring.style.height = '48px'
        ring.style.borderColor = 'var(--accent)'
        ring.style.backgroundColor = 'rgba(var(--accent-rgb), 0.1)'
        dot.style.opacity = '0'
      } else {
        ring.style.width = '28px'
        ring.style.height = '28px'
        ring.style.borderColor = 'var(--accent)'
        ring.style.backgroundColor = 'transparent'
        dot.style.opacity = '1'
      }
    }

    const onMouseLeave = () => {
      ring.style.opacity = '0'
      dot.style.opacity = '0'
    }

    const onMouseEnter = () => {
      if (visible) {
        ring.style.opacity = '1'
        dot.style.opacity = '1'
      }
    }

    const onMouseDown = () => {
      ring.style.transform = ring.style.transform + ' scale(0.85)'
      ring.style.transition = 'width 0.15s, height 0.15s, transform 0.1s, border-color 0.2s, background-color 0.2s, opacity 0.2s'
    }

    const onMouseUp = () => {
      ring.style.transition = 'width 0.2s, height 0.2s, transform 0.15s, border-color 0.2s, background-color 0.2s, opacity 0.2s'
    }

    // Lerp loop for ring
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)

      const w = parseFloat(ring.style.width) || 28
      const h = parseFloat(ring.style.height) || 28
      ring.style.transform = `translate(${ringX - w / 2}px, ${ringY - h / 2}px)`

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <>
      {/* Ring — follows with lag */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '2px solid var(--accent)',
          pointerEvents: 'none',
          zIndex: 999999,
          opacity: 0,
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s, opacity 0.2s',
          willChange: 'transform',
        }}
      />
      {/* Dot — follows instantly */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 999999,
          opacity: 0,
          transition: 'opacity 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
