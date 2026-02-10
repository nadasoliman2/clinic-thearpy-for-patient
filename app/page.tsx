import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, MapPin, Phone, Mail, Check, Star, Clock, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Services from './_components/services'
import DoctorsSlider from './_components/DoctorsSlider'
import Expertise from './_components/expertise'
export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
    

      {/* Hero Section */}
      <section className=" px-4 py-16 md:py-24 bg-gradient-to-b from-secondary to-white">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto ">
          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold text-[#09b6ab] tracking-wider">PREMIUM PHYSICAL THERAPY</span>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mt-3 leading-tight">
                Recover. Perform. <span className="text-[#09b6ab]">Thrive.</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Experience personalized physical therapy designed for peak performance. From injury recovery to athletic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href='/booking'>
              <Button   size="lg"   className="bg-[#09b6ab] text-[#09b6ab]-foreground hover:bg-[#09b6ab]/90 rounded-full">
                Book Your Appointment
              </Button>
              </Link>
           
            </div>
          </div>

          <div className="relative h-96 md:h-full md:min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#09b6ab]/30 via-[#09b6ab]/10 to-transparent rounded-3xl"></div>
            <Image
              src="/hero-therapy.jpg"
              alt="Physical therapy session at EliteCare"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </div>
        </div>
      </section>
      <Services/>
      <Expertise/>
<DoctorsSlider/>

      {/* Quick Booking Section - FEATURED */}


      {/* Clinical Excellence Section */}
    

    </div>
  )
}
