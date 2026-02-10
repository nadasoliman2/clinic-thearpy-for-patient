'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

// إعدادات الـ API
const API_BASE_URL = "http://localhost:3000";

interface Therapist {
  id: string;
  name: string;
  specialization: string;
}

export function BookingForm() {
  const [step, setStep] = useState<'service' | 'location' | 'therapist' | 'date' | 'time' | 'patient' | 'confirmation'>('service')
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
  const [selectedTime, setSelectedTime] = useState<string>('') // سنخزن فيها الـ UTC startTime
  const [displayTime, setDisplayTime] = useState<string>('') // للوقت المحلي للعرض
  
  const [patientInfo, setPatientInfo] = useState({ name: '', email: '', phone: '', age: '' });
  const [bookingId, setBookingId] = useState<string>('')

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
    } else {
      // التنقل البسيط للخطوات الأولى
      const steps: any = ['service', 'location', 'therapist', 'date', 'time', 'patient'];
      const currentIndex = steps.indexOf(step);
      if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
    }
  };

  // 4. تأكيد الحجز النهائي (POST)
  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        therapistId: selectedTherapist,
        service: selectedService,
        location: selectedLocation,
        patientName: patientInfo.name,
        patientEmail: patientInfo.email,
        patientPhone: patientInfo.phone,
        patientAge: parseInt(patientInfo.age),
        startTime: selectedTime // الـ UTC الذي اخترناه
      };

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        console.log(data)
        setBookingId(data.booking.bookingId);
        setStep('confirmation');
      } else {
        alert("فشل الحجز: " + data.message);
      }
    } catch (err) {
      setError("حدث خطأ أثناء إتمام الحجز");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4" dir="rtl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* الخطوة 1: الخدمات */}
      {step === 'service' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">اختر الخدمة</h2>
          <div className="grid grid-cols-1 gap-3">
            {services.map((s) => (
              <button
                key={s.id || s.name}
                onClick={() => setSelectedService(s.name)}
                className={`p-4 rounded-xl border-2 text-right transition ${selectedService === s.name ? 'border-[#09b6ab] bg-[#09b6ab]/10' : 'border-gray-100 hover:border-[#09b6ab]'}`}
              >
                <div className="font-bold">{s.name}</div>
                {s.description && <div className="text-sm text-gray-500">{s.description}</div>}
              </button>
            ))}
          </div>
          <Button onClick={() => setStep('location')} disabled={!selectedService} className="w-full bg-[#09b6ab]  hover:bg-[#09b6ab]  text-white py-6 rounded-xl">
            متابعة <ChevronRight className="mr-2 h-5 w-5 rotate-180" />
          </Button>
        </div>
      )}

      {/* الخطوة 2: المواقع */}
      {step === 'location' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">اختر الموقع</h2>
          <div className="grid grid-cols-1 gap-3">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`p-4 rounded-xl border-2 text-right transition ${selectedLocation === loc ? 'border-[#09b6ab] bg-[#09b6ab]/10' : 'border-gray-100 hover:border-[#09b6ab]'}`}
              >
                {loc}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('service')} className="flex-1 py-6 rounded-xl hover:bg-[#09b6ab]">رجوع</Button>
            <Button onClick={handleNextStep} disabled={!selectedLocation} className="flex-[2] bg-[#09b6ab] text-white py-6 rounded-xl">متابعة</Button>
          </div>
        </div>
      )}

      {/* الخطوة 3: المعالج */}
      {step === 'therapist' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">اختر المعالج</h2>
          {loading ? <Loader2 className="animate-spin mx-auto text-[#09b6ab]" /> : (
            <div className="grid grid-cols-1 gap-3">
              {therapists.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTherapist(t.id)}
                  className={`p-4 rounded-xl border-2 text-right transition ${selectedTherapist === t.id ? 'border-[#09b6ab] bg-[#09b6ab]/10' : 'border-gray-100 hover:border-[#09b6ab]'}`}
                >
                  <div className="font-bold">{t.name}</div>
                  <div className="text-sm text-[#09b6ab]">{t.specialization}</div>
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('location')} className="flex-1 py-6 rounded-xl">رجوع</Button>
            <Button onClick={() => setStep('date')} disabled={!selectedTherapist} className="flex-[2] bg-[#09b6ab] text-white py-6 rounded-xl">متابعة</Button>
          </div>
        </div>
      )}

      {/* الخطوة 4: التاريخ */}
      {step === 'date' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">اختر التاريخ</h2>
          <input 
            type="date" 
            className="w-full p-4 border-2 rounded-xl"
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('therapist')} className="flex-1 py-6 rounded-xl">رجوع</Button>
            <Button onClick={handleNextStep} disabled={!selectedDate} className="flex-[2] bg-[#09b6ab] text-white py-6 rounded-xl">عرض المواعيد المتاحة</Button>
          </div>
        </div>
      )}

      {/* الخطوة 5: الوقت */}
      {step === 'time' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">المواعيد المتاحة (بتوقيت القاهرة)</h2>
          {loading ? <Loader2 className="animate-spin mx-auto text-[#09b6ab]" /> : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.length > 0 ? availableSlots.map((slot) => {
                const timeLabel = new Date(slot.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
                return (
                  <button
                    key={slot.startTime}
                    onClick={() => { setSelectedTime(slot.startTime); setDisplayTime(timeLabel); }}
                    className={`p-3 text-sm rounded-lg border-2 transition ${selectedTime === slot.startTime ? 'bg-[#09b6ab] text-white' : 'hover:border-[#09b6ab]'}`}
                  >
                    {timeLabel}
                  </button>
                )
              }) : <p className="col-span-3 text-center text-red-500">لا توجد مواعيد متاحة في هذا اليوم</p>}
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setStep('date')} className="flex-1 py-6 rounded-xl">رجوع</Button>
            <Button onClick={() => setStep('patient')} disabled={!selectedTime} className="flex-[2] bg-[#09b6ab] text-white py-6 rounded-xl">متابعة</Button>
          </div>
        </div>
      )}

      {/* الخطوة 6: بيانات المريض */}
      {step === 'patient' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">بيانات المريض</h2>
          <div className="space-y-3">
            <input type="text" placeholder="الاسم الكامل" className="w-full p-4 border rounded-xl" onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})} />
            <input type="email" placeholder="البريد الإلكتروني" className="w-full p-4 border rounded-xl" onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})} />
            <input type="tel" placeholder="رقم الهاتف" className="w-full p-4 border rounded-xl" onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})} />
            <input type="number" placeholder="العمر" className="w-full p-4 border rounded-xl" onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})} />
          </div>
          <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
            <p><strong>الخدمة:</strong> {selectedService}</p>
            <p><strong>الموعد:</strong> {selectedDate} في {displayTime}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('time')} className="flex-1 py-6 rounded-xl">رجوع</Button>
            <Button onClick={handleConfirmBooking} loading={loading} className="flex-[2] bg-[#09b6ab] hover:border-[#09b6ab] text-white py-6 rounded-xl">تأكيد الحجز النهائي </Button>
          </div>
        </div>
      )}


      {/* شاشة النجاح */}
      {step === 'confirmation' && (
        <div className="text-center space-y-6 py-10">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-700">تم الحجز بنجاح!</h2>
          <div className="bg-white border-2 border-dashed border-[#09b6ab] p-6 rounded-2xl inline-block">
            <p className="text-gray-500 mb-2">رقم الحجز الخاص بك</p>
            <p className="text-3xl font-black text-[#09b6ab] tracking-widest">{bookingId}</p>
          </div>
          <p className="text-gray-600">تم إرسال تفاصيل الحجز إلى {patientInfo.email}</p>
          <Button onClick={() => window.location.reload()} className="w-full bg-[#09b6ab] hover:bg-[#09b6ab]  text-white py-6 rounded-xl">العودة للرئيسية</Button>
        </div>
      )}
    </div>
  )
}