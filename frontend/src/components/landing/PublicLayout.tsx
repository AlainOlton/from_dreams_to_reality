import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'

interface Props {
  children: React.ReactNode
}

/**
 * Shared shell for all public-facing pages.
 * - Navbar is rendered once, fixed at the top.
 * - Content scrolls inside .lnd-page-content (not the body).
 * - Scroll position resets to top on every route change.
 * - Scroll-reveal IntersectionObserver is re-initialised on each page.
 */
const PublicLayout: React.FC<Props> = ({ children }) => {
  const location  = useLocation()
  const contentRef = useRef<HTMLDivElement>(null)

  // Reset scroll to top on page change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  // Re-run scroll-reveal on every page mount
  useEffect(() => {
    const el  = contentRef.current
    if (!el) return

    // Reset any previously visible reveals so they animate in fresh
    el.querySelectorAll('.reveal').forEach((node) => node.classList.remove('visible'))

    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px', root: el }
    )
    // Small delay so DOM has painted before we observe
    const t = setTimeout(() => {
      el.querySelectorAll('.reveal').forEach((node) => obs.observe(node))
    }, 50)

    return () => { clearTimeout(t); obs.disconnect() }
  }, [location.pathname])

  return (
    <div className="landing-root lnd-shell">
      <Navbar />
      {/* key= forces React to remount children on route change → fresh animations */}
      <main
        ref={contentRef}
        className="lnd-page-content lnd-page-enter"
        key={location.pathname}
      >
        {children}
      </main>
    </div>
  )
}

export default PublicLayout
