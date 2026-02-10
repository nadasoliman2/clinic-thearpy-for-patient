import {BookingForm }from '@/components/booking-form'
export default function Booking(){
    return(
        <>
            <section id="booking" className=" py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
            {/* Header */}
            <div className="bg-[#09b6ab] p-8 md:p-12 text-white">
              <h2 className="text-4xl font-bold mb-3">Book Your Session</h2>
              <p className="text-white/90 text-lg">Select your date first to see available times</p>
            </div>

            {/* Booking Form */}
            <div className="p-8 md:p-12">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
        </>
    )
}