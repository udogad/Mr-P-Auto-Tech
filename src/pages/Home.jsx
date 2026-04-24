import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import Hero from '../sections/Hero'
import Services from '../sections/Services'
import About from '../sections/About'
import StatsStrip from '../sections/StatsStrip'
import Gallery from '../sections/Gallery'
import Booking from '../sections/Booking'
import Testimonials from '../sections/Testimonials'
import Contact from '../sections/Contact'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <StatsStrip />
        <Gallery />
        <Booking />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
