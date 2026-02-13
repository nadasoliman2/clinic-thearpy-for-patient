import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: any) {
  const { id } = params

  try {
    const res = await fetch(`http://localhost:3000/bookings/${id}`) // الباك الحقيقي
    if (!res.ok) throw new Error('Booking not found')
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 })
  }
}
