'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Calendar, Clock, User, Phone, Mail } from 'lucide-react'

const API_BASE_URL = "http://localhost:3000"

interface BookingDetailsProps {
  booking: any
  onReschedule: (booking: any) => void
  onBack: () => void
}

export function BookingDetails({ booking, onReschedule, onBack }: BookingDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cancelConfirm, setCancelConfirm] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const handleCancel = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${booking.bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await res.json()

      if (data.success) {
        setCancelled(true)
      } else {
        setError(data.message || 'فشل إلغاء الحجز')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  if (cancelled) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 text-center py-12" dir="rtl">
        <div className="bg-gradient-to-br from-red-100 to-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <AlertCircle className="w-14 h-14 text-red-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">تم إلغاء الحجز</h2>
          <p className="text-gray-600">تم إلغاء موعدك بنجاح</p>
        </div>
        <button
          onClick={onBack}
          className="w-full max-w-md mx-auto bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold py-3 rounded-lg transition"
        >
          العودة للرئيسية
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">تفاصيل حجزك</h2>
        <p className="text-gray-600">معلومات موعدك وخيارات الإدارة</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-semibold mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            خطأ
          </p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Booking Details Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-6 space-y-4">
        {/* Header with Booking ID */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-gray-100">
          <div>
            <p className="text-gray-600 text-sm">رقم الحجز</p>
            <p className="text-2xl font-bold text-[#09b6ab]">{booking.bookingId}</p>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-lg">
            <p className="text-green-700 font-semibold text-sm">نشط</p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900">معلومات المريض</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-3">
              <User className="w-4 h-4 text-[#09b6ab]" />
              <span className="text-gray-600">الاسم:</span>
              <strong className="text-gray-900">{booking.patientName}</strong>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#09b6ab]" />
              <span className="text-gray-600">الهاتف:</span>
              <strong className="text-gray-900">{booking.patientPhone}</strong>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#09b6ab]" />
              <span className="text-gray-600">البريد:</span>
              <strong className="text-gray-900">{booking.patientEmail}</strong>
            </p>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3 pt-4 border-t-2 border-gray-100">
          <h3 className="font-bold text-gray-900">تفاصيل الموعد</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-xs mb-1">الخدمة</p>
              <p className="font-bold text-gray-900">{booking.service}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-xs mb-1">الموقع</p>
              <p className="font-bold text-gray-900">{booking.location}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 col-span-2">
              <p className="text-gray-600 text-xs mb-1">المعالج</p>
              <p className="font-bold text-gray-900">{booking.therapistName}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3 h-3 text-[#09b6ab]" />
                <p className="text-gray-600 text-xs">التاريخ</p>
              </div>
              <p className="font-bold text-gray-900">{new Date(booking.startTime).toLocaleDateString('ar-EG')}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-[#09b6ab]" />
                <p className="text-gray-600 text-xs">الوقت</p>
              </div>
              <p className="font-bold text-gray-900">{new Date(booking.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!cancelConfirm ? (
        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            رجوع
          </button>
          <button
            onClick={() => onReschedule(booking)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            إعادة جدولة
          </button>
          <button
            onClick={() => setCancelConfirm(true)}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
          >
            إلغاء الحجز
          </button>
        </div>
      ) : (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg space-y-4">
          <p className="text-red-700 font-bold">هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟</p>
          <p className="text-red-600 text-sm">لا يمكن التراجع عن هذا الإجراء</p>
          <div className="flex gap-3">
            <button
              onClick={() => setCancelConfirm(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-100 transition"
            >
              تراجع
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري...
                </>
              ) : (
                'تأكيد الإلغاء'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
