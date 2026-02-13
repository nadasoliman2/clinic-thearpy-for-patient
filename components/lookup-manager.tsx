'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { AlertCircle, Loader2, Search, ArrowRight } from 'lucide-react'

const API_BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'http://localhost:3000'

interface LookupFormData {
  bookingId: string
}

interface LookupBookingProps {
  onBookingFound: (booking: any) => void
  onBack: () => void
}

export function LookupBooking({ onBookingFound, onBack }: LookupBookingProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, setFocus } = useForm<LookupFormData>({
    defaultValues: {
      bookingId: ''
    },
    mode: 'onChange'
  })

  const onSubmit = async (data: LookupFormData) => {
    setLoading(true)
    setServerError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${data.bookingId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) {
        if (res.status === 404) {
          setServerError('رقم الحجز غير موجود')
        } else {
          setServerError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى')
        }
        return
      }

      const data_res = await res.json()
      console.log('[v0] API Response:', data_res)
      if (data_res.success || data_res.booking) {
        console.log('[v0] Booking found, navigating to:', data.bookingId)
        console.log('[v0] Router push starting to:', `/booking/${data.bookingId}`)
        // توجيه مباشر إلى صفحة التفاصيل مع ID في الـ URL
        router.push(`/booking/${data.bookingId}`)
        console.log('[v0] Router push completed')
      } else {
        setServerError(data_res.message || 'فشل البحث عن الحجز')
      }
    } catch (err) {
      console.log('[v0] Error searching for booking:', err)
      setServerError('حدث خطأ في الاتصال. يرجى التحقق من الإنترنت')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2" dir="rtl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">

        </div>
        <p className="text-gray-600">أدخل رقم الحجز لعرض تفاصيل موعدك</p>
      </div>

      {serverError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
          <p className="text-red-700 font-semibold mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            حدث خطأ
          </p>
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ direction: 'rtl' }}>
            رقم الحجز
          </label>
          <input
            type="text"
            placeholder="BK-XYZ123"
            disabled={loading}
            {...register('bookingId', {
              required: 'رقم الحجز مطلوب',
              minLength: {
                value: 3,
                message: 'رقم الحجز يجب أن يكون 3 أحرف على الأقل'
              },
              maxLength: {
                value: 50,
                message: 'رقم الحجز طويل جداً'
              }
            })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right disabled:opacity-50 ${
              errors.bookingId
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50'
                : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
            }`}
          />
          {errors.bookingId && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.bookingId.message}
            </p>
          )}
          <p className="text-gray-500 text-xs mt-2">تجد رقم الحجز في بريدك الإلكتروني أو رسالة التأكيد</p>
        </div>

        <div className="flex gap-3 pt-4">
        
          <button
            type="submit"
            disabled={loading}
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
               
              </>
            )}
          </button>
                   <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            رجوع
          </button>
        </div>
      </form>
    </div>
  )
}
