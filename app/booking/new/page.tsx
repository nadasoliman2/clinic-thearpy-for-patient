'use client' 
import { BookingForm } from '@/components/booking-form'

export default function Bookingform() {

  return (
    <>
        <section id="booking" className="py-20 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
          {/* Header - Changes based on current view */}
          {/* <div className="bg-gradient-to-r from-[#09b6ab] to-[#07a89d] p-8 md:p-8 text-white">
                <h2 className=" font-bold mb-3 text-balance" dir='rtl'>حجز موعد جديد</h2>
                <p className="text-white/90 text-lg"dir='rtl'>اختر التاريخ أولاً لعرض الأوقات المتاحة</p>
          </div> */}
           <BookingForm/>
</div>
    </div>
</section>
</>
  )
}
