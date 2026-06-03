import PublicLayout from '@/components/landing/PublicLayout'
import HeroSection  from '@/components/landing/HeroSection'
import StatsSection from '@/components/landing/StatsSection'
import CTABanner    from '@/components/landing/CTABanner'
import Footer       from '@/components/landing/Footer'
import '@/styles/landing.css'

export default function Landing() {
  return (
    <PublicLayout>
      <HeroSection />
      <StatsSection />
      <CTABanner />
      <Footer />
    </PublicLayout>
  )
}
