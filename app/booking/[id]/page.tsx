import{ BookingDetails } from '@/components/booking-details'

async function getBooking(id: string) {
  const res = await fetch(`http://localhost:3000/api/bookings/${id}`, {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Booking not found')
  return res.json()
}

export default async function BookingDetailsPage({ params }: any) {
  const booking = await getBooking(params.id)
  return <BookingDetails booking={booking} onBack={() => {}} onReschedule={() => {}} />
}
