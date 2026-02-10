'use client'

import { useState, useEffect } from 'react'
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

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  age?: string;
}

const STEPS = ['service', 'location', 'therapist', 'date', 'time', 'patient', 'confirmation'] as const;

// دوال التحقق من الصحة مع رسائل الأخطاء
const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'البريد الإلكتروني مطلوب';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'صيغة البريد الإلكتروني غير صحيحة (مثال: test@email.com)';
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return 'رقم الهاتف مطلوب';
  const phoneRegex = /^(\+?20|0)?1[0-2]\d{8}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'رقم الهاتف غير صحيح (مثال: 01001234567 أو 201001234567)';
  return null;
};

const validateAge = (age: string): string | null => {
  if (!age.trim()) return 'العمر مطلوب';
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return 'يجب إدخال رقم صحيح';
  if (ageNum < 1 || ageNum > 120) return 'العمر يجب أن يكون بين 1 و 120 سنة';
  return null;
};

const validateName = (name: string): string | null => {
  if (!name.trim()) return 'الاسم مطلوب';
  if (name.trim().length < 3) return 'الاسم يجب أن يكون 3 أحرف على الأقل';
  return null;
};

export function BookingForm() {
  const [step, setStep] = useState<typeof STEPS[number]>('service')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

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

  // دالة التحقق من بيانات المريض عند الضغط على الزر
  const validatePatientInfo = (): boolean => {
    const errors: ValidationErrors = {};
    
    const nameError = validateName(patientInfo.name);
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(patientInfo.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = validatePhone(patientInfo.phone);
    if (phoneError) errors.phone = phoneError;
    
    const ageError = validateAge(patientInfo.age);
    if (ageError) errors.age = ageError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // دالة للتحقق من حقل واحد أثناء الكتابة (Real-time validation)
  const validateField = (fieldName: keyof ValidationErrors, value: string) => {
    let error: string | null = null;
    
    if (fieldName === 'name') {
      error = validateName(value);
    } else if (fieldName === 'email') {
      error = validateEmail(value);
    } else if (fieldName === 'phone') {
      error = validatePhone(value);
    } else if (fieldName === 'age') {
      error = validateAge(value);
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error || undefined
    }));
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
      setValidationErrors({});
    }
  };

  // 4. تأكيد الحجز النهائي (POST)
  const handleConfirmBooking = async () => {
    if (!validatePatientInfo()) {
      setError('يرجى تصحيح جميع الأخطاء قبل المتابعة');
      return;
    }

    setLoading(true);
    setError(null);
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
        setBookingId(data.booking.bookingId);
        setStep('confirmation');
      } else {
        setError(data.message || "فشل الحجز. يرجى المحاولة مرة أخرى");
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر الخدمة المطلوبة</h2>
            <p className="text-gray-600 text-sm">حدد الخدمة التي تريد حجز موعد لها</p>
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
          <button 
            onClick={handleNextStep} 
            disabled={!selectedService}
            className="w-full bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            متابعة <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
        </div>
      )}

      {/* الخطوة 2: المواقع */}
      {step === 'location' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر الموقع</h2>
            <p className="text-gray-600 text-sm">حدد المقر الذي تفضل الحضور إليه</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر المعالج</h2>
            <p className="text-gray-600 text-sm">حدد المعالج الفيزيائي المفضل لك</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر التاريخ المناسب</h2>
            <p className="text-gray-600 text-sm">حدد اليوم الذي تفضل حجز الموعد فيه</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">التاريخ</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10"
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر الوقت المناسب</h2>
            <p className="text-gray-600 text-sm">المواعيد المتاحة بتوقيت القاهرة</p>
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">بيانات المريض</h2>
            <p className="text-gray-600 text-sm">يرجى إدخال بيانات صحيحة للتواصل معك</p>
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
                value={patientInfo.name}
                onChange={(e) => {
                  setPatientInfo({...patientInfo, name: e.target.value});
                  validateField('name', e.target.value);
                }}
                onBlur={() => validateField('name', patientInfo.name)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right ${
                  validationErrors.name 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
                }`}
              />
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {validationErrors.name}
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
                value={patientInfo.email}
                onChange={(e) => {
                  setPatientInfo({...patientInfo, email: e.target.value});
                  validateField('email', e.target.value);
                }}
                onBlur={() => validateField('email', patientInfo.email)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right ${
                  validationErrors.email 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {validationErrors.email}
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
                value={patientInfo.phone}
                onChange={(e) => {
                  setPatientInfo({...patientInfo, phone: e.target.value});
                  validateField('phone', e.target.value);
                }}
                onBlur={() => validateField('phone', patientInfo.phone)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right ${
                  validationErrors.phone 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
                }`}
              />
              {validationErrors.phone && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {validationErrors.phone}
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
                value={patientInfo.age}
                onChange={(e) => {
                  setPatientInfo({...patientInfo, age: e.target.value});
                  validateField('age', e.target.value);
                }}
                onBlur={() => validateField('age', patientInfo.age)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-right ${
                  validationErrors.age 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-200 focus:border-[#09b6ab] focus:ring-2 focus:ring-[#09b6ab]/10'
                }`}
                min="1"
                max="120"
              />
              {validationErrors.age && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1" style={{ direction: 'rtl' }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0" /> {validationErrors.age}
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
              onClick={handleGoBack} 
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              رجوع
            </button>
            <button 
              onClick={handleConfirmBooking} 
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
        </div>
      )}


      {/* شاشة النجاح */}
      {step === 'confirmation' && (
        <div className="text-center space-y-8 py-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-br from-green-100 to-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-2">تم الحجز بنجاح!</h2>
            <p className="text-gray-600">شكراً لاختيارك عيادتنا</p>
          </div>
          <div className="bg-gradient-to-br from-[#09b6ab]/10 to-[#07a89d]/5 border-2 border-[#09b6ab]/30 p-8 rounded-xl inline-block max-w-md mx-auto w-full">
            <p className="text-gray-600 mb-3 text-sm">رقم الحجز الخاص بك</p>
            <p className="text-4xl font-black text-[#09b6ab] tracking-widest font-mono">{bookingId}</p>
            <p className="text-gray-500 text-xs mt-3">احفظ هذا الرقم لسهولة المراجعة</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg max-w-md mx-auto">
            <p className="text-blue-700 text-sm"><strong>تم إرسال تفاصيل الحجز</strong> إلى البريد الإلكتروني:</p>
            <p className="text-blue-600 font-semibold mt-1">{patientInfo.email}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto space-y-2 text-sm" style={{ direction: 'rtl', textAlign: 'right' }}>
            <h3 className="font-bold text-gray-900 mb-3">ملخص الحجز</h3>
            <p className="flex justify-between"><strong>{patientInfo.name}</strong> <span className="text-gray-600">:المريض</span></p>
            <p className="flex justify-between"><strong>{selectedService}</strong> <span className="text-gray-600">:الخدمة</span></p>
            <p className="flex justify-between"><strong>{selectedDate}</strong> <span className="text-gray-600">:التاريخ</span></p>
            <p className="flex justify-between"><strong>{displayTime}</strong> <span className="text-gray-600">:الوقت</span></p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full max-w-md bg-[#09b6ab] hover:bg-[#07a89d] text-white font-semibold py-3 rounded-lg transition"
          >
            العودة للرئيسية
          </button>
        </div>
      )}
    </div>
  )
}
