import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function GET(_: Request, { params }: any) {
  const { id } = params

  try {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Booking not found')
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 })
  }
}

export async function DELETE(_: Request, { params }: any) {
  const { id } = params

  try {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!res.ok) throw new Error('Failed to delete booking')
    const data = await res.json()
    return NextResponse.json({ success: true, ...data })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
