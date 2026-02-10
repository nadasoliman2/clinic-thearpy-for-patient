'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Clock, ChevronRight, CheckCircle2, AlertCircle, Loader2, Mail, Phone, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

// إعدادات الـ API
const API_BASE_URL = "http://localhost:3000";

interface Therapist {
  id: string;
  name: string;
  specialization: string;
}

interface PatientFormData {
  name: string;
  email: string;
  phone: string;
  age: string;
}

const STEPS = ['service', 'location', 'therapist', 'date', 'time', 'patient', 'confirmation'] as const;

// دوال التحقق من الصحة
const validateEmailPattern = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhonePattern = (phone: string): boolean => {
  const phoneRegex = /^(\+?20|0)?1[0-2]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

interface BookingFormProps {
  onBackToMain?: () => void
}

export function BookingForm({ onBackToMain }: BookingFormProps = {}) {
  const [step, setStep] = useState<typeof STEPS[number]>('service')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // البيانات القادمة من الباك إيند
  const [services, setServices] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  // الحالة المختارة
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [displayTime, setDisplayTime] = useState<string>('')
  const [bookingId, setBookingId] = useState<string>('')

  // استخدام react-hook-form
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PatientFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      age: ''
    },
    mode: 'onChange'
  })
  
  // حساب رقم الخطوة الحالية
  const currentStepIndex = STEPS.indexOf(step);
  const progressPercentage = ((currentStepIndex + 1) / STEPS.length) * 100;

  // 1. جلب الخدمات والمواقع عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resServices, resSettings] = await Promise.all([
          fetch(`${API_BASE_URL}/api/settings/services`).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/settings`).then(res => res.json())
        ]);
        if (resServices.success) setServices(resServices.services.filter((s: any) => s.active !== false));
        if (resSettings.success) setLocations(resSettings.settings.areas);
      } catch (err) {
        setError("فشل الاتصال بالسيرفر. تأكد من تشغيل الباك إيند.");
      }
    };
    fetchData();
  }, []);

  // 2. جلب المعالجين بناءً على الخدمة والموقع
  const fetchTherapists = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ service: selectedService, location: selectedLocation, status: 'active' });
      const res = await fetch(`${API_BASE_URL}/api/therapists?${params}`);
      const data = await res.json();
      if (data.success) setTherapists(data.therapists);
    } catch (err) {
      setError("خطأ في جلب المعالجين");
    } finally {
      setLoading(false);
    }
  };

  // 3. جلب المواعيد المتاحة
  const fetchSlots = async (date: string, tId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/availability/slots?therapistId=${tId}&date=${date}`);
      const data = await res.json();
      if (data.success) setAvailableSlots(data.slots);
    } catch (err) {
      setError("خطأ في جلب المواعيد");
    } finally {
      setLoading(false);
    }
  };

  // نظام التنقل بين الخطوات
  const handleNextStep = async () => {
    setError(null);
    
    if (step === 'location') {
      await fetchTherapists();
      setStep('therapist');
    } else if (step === 'therapist') {
      setStep('date');
    } else if (step === 'date' && selectedDate && selectedTherapist) {
      await fetchSlots(selectedDate, selectedTherapist);
      setStep('time');
    } else if (step === 'time') {
      setStep('patient');
    } else if (step === 'service') {
      setStep('location');
    }
  };

  const handleGoBack = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
      setError(null);
    }
  };

  // تأكيد الحجز النهائي
  const handleConfirmBooking = async (data: PatientFormData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        therapistId: selectedTherapist,
        service: selectedService,
        location: selectedLocation,
        patientName: data.name,
        patientEmail: data.email,
        patientPhone: data.phone,
        patientAge: parseInt(data.age),
        startTime: selectedTime
      };

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const res_data = await res.json();

      if (res_data.success) {
        setBookingId(res_data.booking.bookingId);
        setStep('confirmation');
      } else {
        setError(res_data.message || "فشل الحجز. يرجى المحاولة مرة أخرى");
      }
    } catch (err) {
      setError("حدث خطأ أثناء إتمام الحجز. يرجى التحقق من الاتصال بالإنترنت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8" dir="rtl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">الخطوة {currentStepIndex + 1} من {STEPS.length}</h3>
          <span className="text-xs text-gray-500">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#09b6ab] to-[#07a89d] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-4 gap-2">
          {STEPS.map((s, idx) => (
            <div 
              key={s}
              className={`flex-1 text-center text-xs font-medium py-2 rounded-lg transition ${
                idx <= currentStepIndex 
                  ? 'bg-[#09b6ab] text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* الخطوة 1: الخدمات */}
      {step === 'service' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">اختر الخدمة</h2>
            <p className="text-gray-600 text-lg">حدد الخدمة التي تريد حجز موعد لها</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {services.map((s) => (
              <button
                key={s.id || s.name}
                onClick={() => setSelectedService(s.name)}
                className={`p-4 rounded-lg border-2 text-right transition transform hover:scale-105 ${
                  selectedService === s.name 
                    ? 'border-[#09b6ab] bg-[#09b6ab]/10 ring-2 ring-[#09b6ab]/20' 
                    : 'border-gray-200 hover:border-[#09b6ab]'
                }`}
              >
                <div className="font-bold text-gray-900">{s.name}</div>
                {s.description && <div className="text-sm text-gray-600 mt-1">{s.description}</div>}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            {onBackToMain && (
              <button 
                onClick={onBackToMain}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                رجوع
              </button>
            )}
            <button 
              onClick={handleNextStep} 
              disabled={!selectedService}
              className={`${onBackToMain ? 'flex-[2]' : 'w-full'} bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              متابعة <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* الخطوة 2: المواقع */}
      {step === 'location' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">اختر الموقع</h2>
            <p className="text-gray-600 text-lg">حدد المقر الذي تفضل الحضور إليه</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`p-4 rounded-lg border-2 text-right transition transform hover:scale-105 ${
                  selectedLocation === loc 
                    ? 'border-[#09b6ab] bg-[#09b6ab]/10 ring-2 ring-[#09b6ab]/20' 
                    : 'border-gray-200 hover:border-[#09b6ab]'
                }`}
              >
                <div className="font-semibold text-gray-900">{loc}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleGoBack}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              رجوع
            </button>
            <button 
              onClick={handleNextStep} 
              disabled={!selectedLocation}
              className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              متابعة
            </button>
          </div>
        </div>
      )}

      {/* الخطوة 3: المعالج */}
      {step === 'therapist' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">اختر المعالج</h2>
            <p className="text-gray-600 text-lg">حدد المعالج الفيزيائي المفضل لك</p>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-[#09b6ab] mb-2" />
              <p className="text-gray-600 text-sm">جاري تحميل المعالجين...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {therapists.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTherapist(t.id)}
                  className={`p-4 rounded-lg border-2 text-right transition transform hover:scale-105 ${
                    selectedTherapist === t.id 
                      ? 'border-[#09b6ab] bg-[#09b6ab]/10 ring-2 ring-[#09b6ab]/20' 
                      : 'border-gray-200 hover:border-[#09b6ab]'
                  }`}
                >
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-sm text-[#09b6ab] mt-1">{t.specialization}</div>
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button 
              onClick={handleGoBack}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              رجوع
            </button>
            <button 
              onClick={() => setStep('date')} 
              disabled={!selectedTherapist || loading}
              className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              متابعة
            </button>
          </div>
        </div>
      )}

      {/* الخطوة 4: التاريخ */}
      {step === 'date' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">اختر التاريخ</h2>
            <p className="text-gray-600 text-lg">حدد اليوم الذي تفضل حجز الموعد فيه</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">التاريخ</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleGoBack}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              رجوع
            </button>
            <button 
              onClick={handleNextStep} 
              disabled={!selectedDate}
              className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              عرض المواعيد <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* الخطوة 5: الوقت */}
      {step === 'time' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">اختر الوقت</h2>
            <p className="text-gray-600 text-lg">المواعيد المتاحة بتوقيت القاهرة</p>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-[#09b6ab] mb-2" />
              <p className="text-gray-600 text-sm">جاري تحميل المواعيد...</p>
            </div>
          ) : (
            <div>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => {
                    const timeLabel = new Date(slot.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
                    return (
                      <button
                        key={slot.startTime}
                        onClick={() => { setSelectedTime(slot.startTime); setDisplayTime(timeLabel); }}
                        className={`p-3 text-sm font-semibold rounded-lg border-2 transition transform hover:scale-105 ${
                          selectedTime === slot.startTime 
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
                  <p className="text-red-600 text-sm">يرجى اختيار تاريخ آخر</p>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleGoBack}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              رجوع
            </button>
            <button 
              onClick={() => setStep('patient')} 
              disabled={!selectedTime || loading}
              className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              متابعة
            </button>
          </div>
        </div>
      )}

      {/* الخطوة 6: بيانات المريض */}
      {step === 'patient' && (
        <form onSubmit={handleSubmit(handleConfirmBooking)} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-balance">أكمل البيانات</h2>
            <p className="text-gray-600 text-lg">يرجى إدخال بيانات صحيحة للتواصل معك</p>
          </div>

          <div className="space-y-4">
            {/* الاسم */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" style={{ direction: 'rtl' }}>
                <User className="w-4 h-4" /> الاسم الكامل
              </label>
              <input 
                type="text" 
                placeholder="أحمد محمد علي" 
                {...register('name', {
                  required: 'الاسم مطلوب',
                  minLength: {
                    value: 3,
                    message: 'الاسم يجب أن يكون 3 أحرف على الأقل'
                  }
                })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right ${
                  errors.name 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.name.message}
                </p>
              )}
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" style={{ direction: 'rtl' }}>
                <Mail className="w-4 h-4" /> البريد الإلكتروني
              </label>
              <input 
                type="email" 
                placeholder="example@email.com" 
                {...register('email', {
                  required: 'البريد الإلكتروني مطلوب',
                  validate: (value) => validateEmailPattern(value) || 'صيغة البريد الإلكتروني غير صحيحة (مثال: test@email.com)'
                })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right ${
                  errors.email 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" style={{ direction: 'rtl' }}>
                <Phone className="w-4 h-4" /> رقم الهاتف
              </label>
              <input 
                type="tel" 
                placeholder="01001234567" 
                {...register('phone', {
                  required: 'رقم الهاتف مطلوب',
                  validate: (value) => validatePhonePattern(value) || 'رقم الهاتف غير صحيح (مثال: 01001234567 أو 201001234567)'
                })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right ${
                  errors.phone 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
                }`}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.phone.message}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2" style={{ direction: 'rtl' }}>أدخل رقم هاتف مصري صحيح (مثل: 01001234567 أو 201001234567)</p>
            </div>

            {/* العمر */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" style={{ direction: 'rtl' }}>
                <Calendar className="w-4 h-4" /> العمر
              </label>
              <input 
                type="number" 
                placeholder="25" 
                {...register('age', {
                  required: 'العمر مطلوب',
                  min: {
                    value: 1,
                    message: 'العمر يجب أن يكون على الأقل 1'
                  },
                  max: {
                    value: 120,
                    message: 'العمر يجب أن يكون 120 على الأكثر'
                  }
                })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right ${
                  errors.age 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
                }`}
                min="1"
                max="120"
              />
              {errors.age && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {errors.age.message}
                </p>
              )}
            </div>
          </div>

          {/* ملخص الحجز */}
          <div className="bg-gradient-to-br from-[#09b6ab]/5 to-[#07a89d]/5 border-2 border-[#09b6ab]/20 p-5 rounded-xl space-y-3" style={{ direction: 'rtl' }}>
            <h3 className="font-semibold text-gray-900">ملخص الحجز</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><strong>{selectedService}</strong> <span className="text-gray-600">:الخدمة</span></p>
              <p className="flex justify-between"><strong>{selectedLocation}</strong> <span className="text-gray-600">:الموقع</span></p>
              <p className="flex justify-between"><strong>{selectedDate}</strong> <span className="text-gray-600">:التاريخ</span></p>
              <p className="flex justify-between"><strong>{displayTime}</strong> <span className="text-gray-600">:الوقت</span></p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={handleGoBack} 
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              رجوع
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                'تأكيد الحجز'
              )}
            </button>
          </div>
        </form>
      )}

      {/* شاشة النجاح */}
      {step === 'confirmation' && (
        <div className="text-center space-y-8 py-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-br from-green-100 to-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-2 text-balance">تم الحجز بنجاح!</h2>
            <p className="text-gray-600 text-lg">شكراً لاختيارك عيادتنا</p>
          </div>
          <div className="bg-gradient-to-br from-[#09b6ab]/10 to-[#07a89d]/5 border-2 border-[#09b6ab]/30 p-8 rounded-xl inline-block max-w-md mx-auto w-full">
            <p className="text-gray-600 mb-3 text-sm">رقم الحجز الخاص بك</p>
            <p className="text-4xl font-black text-[#09b6ab] tracking-widest font-mono">{bookingId}</p>
            <p className="text-gray-500 text-xs mt-3">احفظ هذا الرقم لسهولة المراجعة</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg max-w-md mx-auto">
            <p className="text-blue-700 text-sm"><strong>تم إرسال تفاصيل الحجز</strong> إلى البريد الإلكتروني:</p>
            <p className="text-blue-600 font-semibold mt-1" dir="ltr">{watch('email')}</p>
          </div>
          <button 
            onClick={() => onBackToMain ? onBackToMain() : window.location.reload()} 
            className="w-full max-w-md bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold py-3 rounded-lg transition"
          >
            العودة للرئيسية
          </button>
        </div>
      )}
    </div>
  )
}
