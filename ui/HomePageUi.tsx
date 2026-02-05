import HeroSection from '@/components/home/HeroSection'
import ServicesSections from '@/components/home/ServicesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ContactSection from '@/components/home/ContactSection'
import ValuesSection from '@/components/home/ValueSection'
import LegacySection from '@/components/home/LegacySection'

export default function HomePageUi() {
  return (
    <div>
      <HeroSection />
      <ServicesSections/>
      <ValuesSection />
      <LegacySection />
      <TestimonialsSection />
    </div>
  )
}