import { Outlet }      from 'react-router-dom'
import Sidebar         from './Sidebar'
import Navbar          from './Navbar'
import LandingFooter   from '@/components/landing/Footer'
import LandingNavbar   from '@/components/landing/Navbar'
import { useUIStore }  from '@/store'
import '@/styles/landing.css'

// ── Heights ───────────────────────────────────────────────────
// Landing navbar : 68px  (lnd-nav class)
// Dashboard navbar: 64px  (Navbar component)
// Total top offset for content: 132px

export default function AppLayout() {
  const { sidebarOpen } = useUIStore()

  return (
    <div style={{ backgroundColor: '#e8f7fb', minHeight: '100vh' }}>

      {/* 1. Landing-style navbar — fixed, z-index 50, full width */}
      <div className="landing-root" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <LandingNavbar />
      </div>

      {/* 2. Sidebar — fixed, starts at 68px (below landing navbar) */}
      <Sidebar />

      {/* 3. Dashboard top bar — fixed, starts at 68px, sits right of sidebar */}
      <Navbar />

      {/* 4. Scrollable content column */}
      <div
        className={`transition-all duration-200 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}
        style={{
          paddingTop: 132,     // 68 (landing nav) + 64 (dashboard nav)
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Page content */}
        <main style={{ flex: 1, padding: '24px' }}>
          <Outlet />
        </main>

        {/* Landing-style footer */}
        <div className="landing-root">
          <LandingFooter />
        </div>
      </div>
    </div>
  )
}
