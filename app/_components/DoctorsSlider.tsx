"use client"

import { useEffect, useState } from "react"
import { Stethoscope } from "lucide-react"

const doctors = [
  { name: "Dr. Sarah Mitchell", specialty: "Sports Therapy" },
  { name: "Dr. James Wilson", specialty: "Post-Op Recovery" },
  { name: "Dr. Elena Rodriguez", specialty: "Performance Rehab" },
  { name: "Dr. Michael Brown", specialty: "Manual Therapy" },
  { name: "Dr. Emma Davis", specialty: "Neurological Rehab" },
  { name: "Dr. Daniel Clark", specialty: "Hydrotherapy" },
  { name: "Dr. Sophia Lee", specialty: "Pediatric PT" },
  { name: "Dr. David Miller", specialty: "Orthopedic Rehab" },
  { name: "Dr. Olivia White", specialty: "Pain Management" },
  { name: "Dr. Noah Taylor", specialty: "Home Visits" },
]

const PER_VIEW = 3

export default function DoctorsSlider() {
  const [index, setIndex] = useState(0)

  const totalSlides = Math.ceil(doctors.length / PER_VIEW)

 useEffect(() => {
  const timer = setInterval(() => {
    setIndex((prev) => (prev + 1) % totalSlides)
  }, 7000) // 👈 أبطأ

  return () => clearInterval(timer)
}, [totalSlides])


  const start = index * PER_VIEW
  const visibleDoctors = doctors.slice(start, start + PER_VIEW)

  return (
    <section id="doctors" className="py-24 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4">

        {/* Title */}
        <h2 className="text-4xl font-bold text-center mb-14">
          Meet Our Doctors
        </h2>

        {/* ✅ 3 cards ثابتين */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleDoctors.map((doc, i) => (
      <div
  key={i}
  className="bg-white p-8 rounded-2xl border border-border shadow-sm 
             hover:shadow-lg hover:border-[#09b6ab] transition
             flex flex-col items-center text-center"
>
  <div className="w-20 h-20 rounded-full bg-[#09b6ab]/10 
                  flex items-center justify-center mb-4">
    <Stethoscope className="w-9 h-9 text-[#09b6ab]" />
  </div>

  <h3 className="font-semibold text-lg">{doc.name}</h3>
  <p className="text-sm text-muted-foreground mt-1">
    {doc.specialty}
  </p>
</div>

          ))}
        </div>

        {/* ✅ dots */}
        <div className="flex justify-center gap-3 mt-10">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                index === i ? "bg-[#09b6ab]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
