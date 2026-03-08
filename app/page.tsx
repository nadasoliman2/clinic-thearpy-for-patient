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
<section className="px-4 py-16 md:py-24 bg-gradient-to-b from-secondary to-white font-sans" dir="rtl">
  <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
    <div className="space-y-6 text-right">
      <div>
        {/* تصغير الخط العلوي */}
        <span className="text-xs font-bold text-[#09b6ab] tracking-widest uppercase">
          علاج طبيعي متميز
        </span>
        {/* تعديل حجم العنوان الرئيسي ليصبح متناسقاً */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mt-3 leading-[1.3]">
          استعد عافيتك. طور أداءك. <br/>
          <span className="text-[#09b6ab]">انطلق بثقة.</span>
        </h1>
      </div>
      
      {/* تحسين قراءة النص الوصفي */}
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg font-medium">
        استمتع بتجربة علاج طبيعي مخصصة مصممة للوصول إلى ذروة الأداء. من التعافي من الإصابات إلى التميز الرياضي.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link href='/booking'>
          <Button size="lg" className="bg-[#09b6ab] text-white hover:bg-[#09b6ab]/90 rounded-full font-bold px-10 py-6 text-lg transition-transform hover:scale-105">
            احجز موعدك الآن
          </Button>
        </Link>
      </div>
    </div>

     <div className="relative h-96 md:h-full md:min-h-[500px] hidden md:block">
  <div className="absolute inset-0 bg-gradient-to-br from-[#09b6ab]/30 via-[#09b6ab]/10 to-transparent rounded-3xl"></div>

  <Image
    src="/hero-therapy.jpg"
    alt="جلسة علاج طبيعي في إيليت كير"
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
