'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Clock, ChevronRight, CheckCircle2, AlertCircle, Loader2, Mail, Phone, User, Calendar } from 'lucide-react'
import Link from 'next/link'

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

const STEPS = ['service', 'location', 'therapist', 'date', 'patient', 'confirmation'] as const;

export function BookingForm() {
  const [step, setStep] = useState<typeof STEPS[number]>('service')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [services, setServices] = useState<any[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [availableSlots, setAvailableSlots] = useState<any[]>([])

  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [displayTime, setDisplayTime] = useState<string>('')
  const [bookingId, setBookingId] = useState<string>('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientFormData>({
    mode: "onTouched"
  })
  
  const currentStepIndex = STEPS.indexOf(step);
  const progressPercentage = ((currentStepIndex + 1) / STEPS.length) * 100;

  // fetch services & locations بدون cache
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const [resServices, resSettings] = await Promise.all([
          fetch(`${API_BASE_URL}/api/settings/services?`, {
        cache: "no-store"
      }).then(res => res.json()),
          fetch(`${API_BASE_URL}/api/settings`, {
        cache: "no-store"
      }).then(res => res.json())
        ]);
        if (resServices.success) setServices(resServices.services.filter((s: any) => s.active !== false));
        if (resSettings.success) setLocations(resSettings.settings.areas);
      } catch (err) {
        setError("فشل الاتصال بالسيرفر.");
      }
    };
    fetchData();
  }, []);

  // fetch slots كل مرة التاريخ أو المعالج يتغير
  useEffect(() => {
    if (selectedDate && selectedTherapist && step === 'date') {
      fetchSlots(selectedDate, selectedTherapist);
    }
  }, [selectedDate, selectedTherapist, step]);

  // جلب المعالجين بدون cache
  const fetchTherapists = async () => {
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({ service: selectedService, location: selectedLocation, status: 'active' });
      const res = await fetch(`${API_BASE_URL}/api/therapists?${params}`, {
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success) setTherapists(data.therapists);
      else setError("لا يوجد معالجين متاحين");
    } catch (err) {
      setError("خطأ في جلب المعالجين");
    } finally {
      setLoading(false);
    }
  };

  // جلب المواعيد بدون cache
  const fetchSlots = async (date: string, tId: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/availability/slots?therapistId=${tId}&date=${date}`, {
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success) setAvailableSlots(data.slots);
      else setError("لا توجد مواعيد متاحة");
    } catch (err) {
      setError("خطأ في جلب المواعيد");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    setError(null);
    if (step === 'service') setStep('location');
    else if (step === 'location') { await fetchTherapists(); setStep('therapist'); }
    else if (step === 'therapist') setStep('date');
    else if (step === 'date') setStep('patient');
  };

  const handleGoBack = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
      setError(null);
    }
  };

  const handleConfirmBooking = async (data: PatientFormData) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistId: selectedTherapist, service: selectedService, location: selectedLocation,
          patientName: data.name, patientEmail: data.email, patientPhone: data.phone,
          patientAge: parseInt(data.age), startTime: selectedTime
        })
      });
      const res_data = await res.json();
      if (res_data.success) { setBookingId(res_data.booking.bookingId); setStep('confirmation'); }
      else { setError(res_data.message || "حدث خطأ أثناء الحجز"); }
    } catch (err) { setError("حدث خطأ أثناء إتمام الحجز"); }
    finally { setLoading(false); }
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
          <div className="bg-gradient-to-r from-[#09b6ab] to-[#07a89d] h-full rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
        </div>
        <div className="flex justify-between mt-4 gap-2">
          {STEPS.map((s, idx) => (
            <div key={s} className={`flex-1 text-center text-xs font-medium py-2 rounded-lg transition ${idx <= currentStepIndex ? 'bg-[#09b6ab] text-white' : 'bg-gray-100 text-gray-400'}`}>
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* رسالة الخطأ */}
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
            <h3 className="font-bold text-gray-900 mb-3 text-balance">اختر الخدمة</h3>
            <p className="text-gray-600 text-lg">حدد الخدمة التي تريد حجز موعد لها</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {services.map((s) => (
              <button key={s.id || s.name} onClick={() => setSelectedService(s.name)}
                className={`p-4 rounded-lg border-2 text-right transition transform hover:scale-105 ${selectedService === s.name ? 'border-[#09b6ab] bg-[#09b6ab]/10 ring-2 ring-[#09b6ab]/20' : 'border-gray-200 hover:border-[#09b6ab]'}`}>
                <div className="font-bold text-gray-900">{s.name}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleNextStep} disabled={!selectedService} className="flex-[2] bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">متابعة</button>
            <Link href="/booking" className="flex-1"><button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">رجوع</button></Link>
          </div>
        </div>
      )}

      {/* الخطوة 2: المواقع */}
      {step === 'location' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <h3 className="font-bold text-gray-900 mb-3 text-balance text-xl">اختر الموقع</h3>
          <div className="grid grid-cols-1 gap-3">
            {locations.map((loc) => (
              <button key={loc} onClick={() => setSelectedLocation(loc)}
                className={`p-4 rounded-lg border-2 text-right transition transform hover:scale-105 ${selectedLocation === loc ? 'border-[#09b6ab] bg-[#09b6ab]/10 ring-2 ring-[#09b6ab]/20' : 'border-gray-200 hover:border-[#09b6ab]'}`}>
                <div className="font-semibold text-gray-900">{loc}</div>
              </button>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={handleNextStep} disabled={!selectedLocation} className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition disabled:opacity-50">متابعة</button>
            <button onClick={handleGoBack} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">رجوع</button>
          </div>
        </div>
      )}

      {/* الخطوة 3: المعالج */}
      {step === 'therapist' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <h3 className="font-bold text-gray-900 mb-3 text-balance text-xl">اختر المعالج</h3>
          {loading ? <div className="flex flex-col items-center py-12"><Loader2 className="animate-spin w-8 h-8 text-[#09b6ab]" /></div> : (
            <div className="grid grid-cols-1 gap-3">
              {therapists.map((t) => (
                <button key={t.id} onClick={() => setSelectedTherapist(t.id)}
                  className={`p-4 rounded-lg border-2 text-right transition transform hover:scale-105 ${selectedTherapist === t.id ? 'border-[#09b6ab] bg-[#09b6ab]/10 ring-2 ring-[#09b6ab]/20' : 'border-gray-200 hover:border-[#09b6ab]'}`}>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-sm text-[#09b6ab] mt-1">{t.specialization}</div>
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button onClick={handleNextStep} disabled={!selectedTherapist || loading} className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition">متابعة</button>
            <button onClick={handleGoBack} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">رجوع</button>
          </div>
        </div>
      )}

      {/* الخطوة 4: التاريخ والوقت */}
   {step === 'date' && (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
    <h3 className="font-bold text-gray-900 text-xl">اختر التاريخ والوقت</h3>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        التاريخ
      </label>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value)
          setSelectedTime('')
          setAvailableSlots([])
        }}
        min={new Date().toISOString().split('T')[0]}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#09b6ab]"
      />
    </div>

    {selectedDate && (
      <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-100">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#09b6ab]" />
          المواعيد المتاحة:
        </h4>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin w-6 h-6 text-[#09b6ab]" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">

            {availableSlots.length > 0 ? (
              availableSlots.map((slot) => {

                const timeLabel = new Date(slot.startTime).toLocaleTimeString(
                  "ar-EG",
                  { hour: "2-digit", minute: "2-digit", hour12: true }
                )

                return (
                  <button
                    key={slot.startTime}
                    onClick={() => {
                      setSelectedTime(slot.startTime)
                      setDisplayTime(timeLabel)
                    }}
                    className={`p-3 text-sm font-semibold rounded-lg border-2 transition transform hover:scale-105
                    ${
                      selectedTime === slot.startTime
                        ? "bg-[#09b6ab] text-white border-[#09b6ab]"
                        : "border-gray-200 text-gray-900 hover:border-[#09b6ab]"
                    }`}
                  >
                    {timeLabel}
                  </button>
                )
              })
            ) : (

              <div className="col-span-3 bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />

                <p className="font-bold text-amber-700">
                  لا توجد مواعيد متاحة
                </p>

                <p className="text-sm text-amber-600 mt-1">
                  اختر تاريخ آخر أو جرب مع معالج مختلف
                </p>

                <button
                  onClick={() => {
                    setSelectedDate("")
                    setAvailableSlots([])
                  }}
                  className="mt-3 text-sm text-[#09b6ab] font-semibold hover:underline"
                >
                  اختيار تاريخ آخر
                </button>
              </div>

            )}

          </div>
        )}
      </div>
    )}

    <div className="flex gap-3 pt-4">

      <button
        onClick={handleNextStep}
        disabled={!selectedTime || loading || availableSlots.length === 0}
        className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition disabled:opacity-50"
      >
        متابعة
      </button>

      <button
        onClick={handleGoBack}
        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
      >
        رجوع
      </button>

    </div>
  </div>
)}

      {/* الخطوة 5: بيانات المريض مع Validation قوي */}
      {step === 'patient' && (
        <form onSubmit={handleSubmit(handleConfirmBooking)} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <h3 className="font-bold text-gray-900 text-xl">أكمل البيانات</h3>
          <div className="space-y-4">
            {/* الاسم */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><User className="w-4 h-4" /> الاسم الكامل</label>
              <input 
                {...register('name', { required: 'الاسم مطلوب' })} 
                placeholder="أدخل اسمك هنا"
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#09b6ab]'}`} 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><Mail className="w-4 h-4" /> البريد الإلكتروني</label>
              <input 
                type="email"
                {...register('email', { 
                  required: 'البريد مطلوب', 
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'البريد الإلكتروني غير صالح (مثال: example@mail.com)' } 
                })} 
                placeholder="example@mail.com"
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#09b6ab]'}`} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
            </div>

            {/* الهاتف */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><Phone className="w-4 h-4" /> رقم الهاتف</label>
              <input 
                {...register('phone', { 
                  required: 'رقم الهاتف مطلوب',
                  pattern: { value: /^(\+?20|0)?1[0-25]\d{8}$/, message: 'رقم الهاتف المصري غير صحيح' }
                })} 
                placeholder="01xxxxxxxxx"
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#09b6ab]'}`} 
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone.message}</p>}
            </div>

            {/* العمر */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> العمر</label>
              <input 
                type="number" 
                {...register('age', { required: 'العمر مطلوب', min: { value: 1, message: 'العمر غير صحيح' } })} 
                placeholder="25"
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${errors.age ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#09b6ab]'}`} 
              />
              {errors.age && <p className="text-red-500 text-xs mt-1 font-bold">{errors.age.message}</p>}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-6 border-2 border-dashed border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-200"><Clock className="w-5 h-5 text-[#09b6ab]"/> ملخص الموعد</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>الخدمة:</span> <span className="font-bold">{selectedService}</span></div>
              <div className="flex justify-between"><span>التاريخ:</span> <span className="font-bold" dir="ltr">{selectedDate}</span></div>
              <div className="flex justify-between"><span>الوقت:</span> <span className="font-bold text-[#09b6ab]">{displayTime}</span></div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-[2] px-6 py-3 bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold rounded-lg transition flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تأكيد الحجز النهائي'}
            </button>
            <button type="button" onClick={handleGoBack} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">رجوع</button>
          </div>
        </form>
      )}

      {/* الخطوة 6: شاشة النجاح */}
      {step === 'confirmation' && (
        <div className="text-center space-y-5 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg"><CheckCircle2 className="w-14 h-14 text-green-600" /></div>
          <h2 className="text-2xl font-bold text-green-700">تم الحجز بنجاح!</h2>
          <div className="bg-white border-2 border-[#09b6ab]/30 p-6 rounded-xl shadow-sm inline-block w-full">
            <p className="text-gray-500 text-sm mb-2">رقم الحجز الخاص بك</p>
            <p className="font-black text-4xl text-[#09b6ab] tracking-widest">{bookingId}</p>
          </div>
          <Link href="/booking" className="block"><button className="w-full bg-[#09b6ab] text-white py-4 rounded-lg font-bold">العودة للرئيسية</button></Link>
        </div>
      )}
    </div>
  )
}