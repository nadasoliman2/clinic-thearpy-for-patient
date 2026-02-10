'use client'

import { useState } from 'react'
import { AlertCircle, Loader2, Search, ArrowRight } from 'lucide-react'

const API_BASE_URL = "http://localhost:3000"

interface LookupBookingProps {
  onBookingFound: (booking: any) => void
  onBack: () => void
}

export function LookupBooking({ onBookingFound, onBack }: LookupBookingProps) {
  const [bookingId, setBookingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async () => {
    if (!bookingId.trim()) {
      setError('رقم الحجز مطلوب')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) {
        if (res.status === 404) {
          setError('رقم الحجز غير موجود')
        } else {
          setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى')
        }
        return
      }

      const data = await res.json()
      if (data.success) {
        onBookingFound(data.booking)
      } else {
        setError(data.message || 'فشل البحث عن الحجز')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال. يرجى التحقق من الإنترنت')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup()
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2" dir="rtl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Search className="w-8 h-8 text-[#09b6ab]" />
          <h2 className="text-3xl font-bold text-gray-900">البحث عن حجزك</h2>
        </div>
        <p className="text-gray-600">أدخل رقم الحجز لعرض تفاصيل موعدك</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
          <p className="text-red-700 font-semibold mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            حدث خطأ
          </p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ direction: 'rtl' }}>
          رقم الحجز
        </label>
        <input
          type="text"
          placeholder="BK-XYZ123"
          value={bookingId}
          onChange={(e) => {
            setBookingId(e.target.value)
            setError(null)
          }}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10 transition text-right disabled:opacity-50"
        />
        <p className="text-gray-500 text-xs mt-2">تجد رقم الحجز في بريدك الإلكتروني أو رسالة التأكيد</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
        >
          رجوع
        </button>
        <button
          onClick={handleLookup}
          disabled={loading || !bookingId.trim()}
          className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري البحث...
            </>
          ) : (
            <>
              البحث
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
