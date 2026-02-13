import { BookingDetails } from '@/components/booking-details'

async function getBooking(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/bookings/${id}`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Booking not found')
    return res.json()
  } catch (error) {
    console.error('[v0] Error fetching booking:', error)
    throw new Error('فشل تحميل تفاصيل الحجز')
  }
}

export default async function BookingDetailsPage({ params }: any) {
  const { id } = await params
  const booking = await getBooking(id)
  return <BookingDetails booking={booking} onBack={() => {}} onReschedule={() => {}} />
}
