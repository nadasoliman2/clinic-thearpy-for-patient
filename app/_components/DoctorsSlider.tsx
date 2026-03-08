"use client"

import { useEffect, useState } from "react"
import { Stethoscope } from "lucide-react"

const doctors = [
  { name: "د. سارة ميتشل", specialty: "العلاج الرياضي" },
  { name: "د. جيمس ويلسون", specialty: "تأهيل ما بعد الجراحة" },
  { name: "د. إيلينا رودريغيز", specialty: "تأهيل الأداء البدني" },
  { name: "د. مايكل براون", specialty: "العلاج اليدوي" },
  { name: "د. إيما ديفيس", specialty: "التأهيل العصبي" },
  { name: "د. دانيال كلارك", specialty: "العلاج المائي" },
  { name: "د. صوفيا لي", specialty: "علاج طبيعي للأطفال" },
  { name: "د. ديفيد ميلر", specialty: "تأهيل العظام" },
  { name: "د. أوليفيا وايت", specialty: "إدارة الألم" },
  { name: "د. نوح تايلور", specialty: "زيارات منزلية" },
]

const PER_VIEW = 3

export default function DoctorsSlider() {
  const [index, setIndex] = useState(0)
  const totalSlides = Math.ceil(doctors.length / PER_VIEW)

  // Auto slide (desktop فقط لأنه مش ظاهر في الموبايل)
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides)
    }, 7000)

    return () => clearInterval(timer)
  }, [totalSlides])

  const start = index * PER_VIEW
  const visibleDoctors = doctors.slice(start, start + PER_VIEW)

  return (
    <section id="doctors" dir="rtl" className="py-24 bg-secondary/40 font-sans">
      <div className="max-w-7xl mx-auto px-4">

        {/* العنوان */}
        <h2 className="text-4xl font-bold text-center mb-14 text-foreground">
          نخبة أطبائنا
        </h2>

        {/* 📱 Mobile Slider */}
        <div className="flex lg:hidden gap-6 overflow-x-auto scroll-smooth no-scrollbar">
          {doctors.map((doc, i) => (
            <div
              key={i}
              className="
                min-w-[80%]
                bg-white p-8 rounded-2xl border border-border shadow-sm
                flex flex-col items-center text-center flex-shrink-0
              "
            >
              <div className="w-20 h-20 rounded-full bg-[#09b6ab]/10 
                              flex items-center justify-center mb-4">
                <Stethoscope className="w-9 h-9 text-[#09b6ab]" />
              </div>

              <h3 className="font-bold text-xl text-foreground">
                {doc.name}
              </h3>
              <p className="text-md text-[#09b6ab] mt-2 font-medium">
                {doc.specialty}
              </p>
            </div>
          ))}
        </div>

        {/* 💻 Desktop Slider */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {visibleDoctors.map((doc, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl border border-border shadow-sm
                         hover:shadow-lg hover:border-[#09b6ab] transition-all duration-300
                         flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#09b6ab]/10 
                              flex items-center justify-center mb-4">
                <Stethoscope className="w-9 h-9 text-[#09b6ab]" />
              </div>

              <h3 className="font-bold text-xl text-foreground">
                {doc.name}
              </h3>
              <p className="text-md text-[#09b6ab] mt-2 font-medium">
                {doc.specialty}
              </p>
            </div>
          ))}
        </div>

        {/* 💻 Dots (Desktop only) */}
        <div className="hidden lg:flex justify-center gap-3 mt-10" dir="rtl">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-3 rounded-full transition-all duration-500 ${
                index === i
                  ? "bg-[#09b6ab] w-8"
                  : "bg-gray-300 w-3 hover:bg-gray-400"
              }`}
              aria-label={`الذهاب إلى الشريحة ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}