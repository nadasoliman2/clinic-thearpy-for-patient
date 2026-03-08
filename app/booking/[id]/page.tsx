'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BookingDetails } from '@/components/booking-details'
import { Loader2 } from 'lucide-react'

export default function BookingPage() {
  const params = useParams() // هنا تجيب الـparams من ال URL
  const bookingId = params?.id
  const router = useRouter()

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookingId) return

    async function fetchBooking() {
      try {
        const res = await fetch(`http://localhost:3000/api/bookings/${bookingId}`)
        if (!res.ok) throw new Error('الحجز غير موجود')
        const data = await res.json()
        if (data.success) setBooking(data.booking)
        else throw new Error(data.message)
      } catch (err: any) {
        setError(err.message || 'حدث خطأ')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (loading)
    return <div className="text-center py-12"><Loader2 className="animate-spin mx-auto" /></div>

  if (error)
    return <div className="text-red-600 text-center py-12">{error}</div>

  if (!booking)
    return <div className="text-center py-12">لا يوجد حجز</div>

  return(
    
        <>
        <section id="booking" className="py-20 md:py-24">
    <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
          {/* Header - Changes based on current view */}
          <div className="p-10 md:p-0">
  <div className="p-6 md:p-12">
  <BookingDetails booking={booking} onReschedule={(booking) => router.push(`/booking/${booking.bookingId}/reschedule`)} onBack={() => router.push('/booking')} />
   </div>
   </div>
   </div>
   </div>
   </section> 
    
    </>)
}
