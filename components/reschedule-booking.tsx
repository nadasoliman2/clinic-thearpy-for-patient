'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCircle, Loader2, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { convertLocalToUTC, formatLocalTime } from '@/lib/time-utils'

const API_BASE_URL = "http://localhost:3000"

interface RescheduleFormData {
  selectedDate: string
  selectedTime: string // This will be the time in HH:MM format
}

interface RescheduleBookingProps {
  booking: any
  onBack: () => void
}

export function RescheduleBooking({ booking, onBack }: RescheduleBookingProps) {
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [rescheduled, setRescheduled] = useState(false)
  const [displayTime, setDisplayTime] = useState('')

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<RescheduleFormData>({
    defaultValues: {
      selectedDate: '',
      selectedTime: ''
    },
    mode: 'onChange'
  })

  const selectedDate = watch('selectedDate')
  const selectedTime = watch('selectedTime')

  const fetchSlots = async (date: string) => {
    setLoading(true)
    setServerError(null)
    setValue('selectedTime', '')
    setDisplayTime('')

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/availability/slots?date=${date}&therapistId=${booking.therapistId}`,
        { method: 'GET' }
      )

      if (!res.ok) {
        setServerError('فشل تحميل المواعيد المتاحة')
        return
      }

      const data = await res.json()
      
      if (data.success) {
      
        setAvailableSlots(data.slots || [])
        if (!data.slots || data.slots.length === 0) {
          setServerError('لا توجد مواعيد متاحة في هذا اليوم')
        }
      } else {
        setServerError(data.message || 'لا توجد مواعيد متاحة في هذا اليوم')
        setAvailableSlots([])
      }
    } catch (err) {
      setServerError('حدث خطأ أثناء تحميل المواعيد')
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    if (date) {
      fetchSlots(date)
    }
  }

  const onSubmit = async (data: RescheduleFormData) => {
    if (!data.selectedDate || !data.selectedTime) {
      setServerError('يرجى اختيار التاريخ والوقت')
      return
    }

    setLoading(true)
    setServerError(null)

    try {
      // تحويل التاريخ والوقت المحليين إلى UTC
      const newStartTimeUTC = convertLocalToUTC(data.selectedDate, data.selectedTime)

      const res = await fetch(
        `${API_BASE_URL}/api/bookings/${booking.bookingId}/reschedule`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newStartTime: newStartTimeUTC
          })
        }
      )

      const res_data = await res.json()

      if (res_data.success) {
        setRescheduled(true)
      } else {
        setServerError(res_data.message || res_data.error || 'فشلت إعادة جدولة الحجز')
      }
    } catch (err) {
      setServerError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  if (rescheduled) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 text-center py-12" dir="rtl">
        <div className="bg-gradient-to-br from-green-100 to-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-14 h-14 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-green-700 mb-2">تم إعادة جدولة الحجز</h2>
          <p className="text-gray-600">تم تحديث موعدك بنجاح</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg max-w-md mx-auto">
          <p className="text-green-700 font-semibold mb-2">معلومات الموعد الجديد:</p>
          <div className="text-green-600 text-sm space-y-1">
            <p>التاريخ: {new Date(selectedTime).toLocaleDateString('ar-EG')}</p>
            <p>الوقت: {displayTime}</p>
          </div>
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">إعادة جدولة الحجز</h2>
        <p className="text-gray-600">اختر موعداً جديداً لحجزك (الخدمة والمعالج سيبقى كما هو)</p>
      </div>

      {/* Current Appointment Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-blue-700 font-semibold mb-2">موعدك الحالي:</p>
        <div className="text-blue-600 text-sm space-y-1">
          <p>التاريخ: {new Date(booking.startTime).toLocaleDateString('ar-EG')}</p>
          <p>الوقت: {new Date(booking.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
          <p>الخدمة: {booking.service}</p>
          <p>المعالج: {booking.therapistName}</p>
        </div>
      </div>

      {serverError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-semibold mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            خطأ
          </p>
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ direction: 'rtl' }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              اختر التاريخ الجديد
            </div>
          </label>
          <input
            type="date"
            disabled={loading}
            min={new Date().toISOString().split('T')[0]}
            {...register('selectedDate', {
              required: 'اختيار التاريخ مطلوب',
              onChange: handleDateChange
            })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right disabled:opacity-50 ${
              errors.selectedDate
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50'
                : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
            }`}
          />
          {errors.selectedDate && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.selectedDate.message}
            </p>
          )}
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ direction: 'rtl' }}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                اختر الوقت الجديد
              </div>
            </label>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="animate-spin w-8 h-8 text-[#09b6ab] mb-2" />
                <p className="text-gray-600 text-sm">جاري تحميل المواعيد المتاحة...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => {
                  // slot.startTime يأتي بصيغة ISO string (UTC)
                  // نحتاج استخراج الوقت بصيغة HH:MM فقط
                  const slotDate = new Date(slot.startTime)
                  const timeInHHMM = `${String(slotDate.getUTCHours()).padStart(2, '0')}:${String(slotDate.getUTCMinutes()).padStart(2, '0')}`
                  
                  const timeLabel = slotDate.toLocaleTimeString('ar-EG', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Africa/Cairo'
                  })
                  
                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      onClick={() => {
                        setValue('selectedTime', timeInHHMM)
                        setDisplayTime(timeLabel)
                      }}
                      className={`p-3 text-sm font-semibold rounded-lg border-2 transition transform hover:scale-105 cursor-pointer ${
                        selectedTime === timeInHHMM
                          ? 'bg-[#09b6ab] text-white border-[#09b6ab]'
                          : 'border-gray-200 text-gray-900 hover:border-[#09b6ab]'
                      }`}
                    >
                      {timeLabel}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700 font-semibold mb-1">لا توجد مواعيد متاحة</p>
                <p className="text-red-600 text-sm">يرجى اختيار تاريخاً آخر</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            رجوع
          </button>
          <button
            type="submit"
            disabled={loading || !selectedDate || !selectedTime}
            className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              'تأكيد إعادة الجدولة'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
