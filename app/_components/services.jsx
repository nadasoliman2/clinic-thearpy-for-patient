"use client"

import {
  Dumbbell,
  Footprints,
  Waves,
  HeartPulse,
  House,
} from "lucide-react"

import { motion } from "framer-motion"

const services = [
  { title: "تقييم قوة العضلات", icon: Dumbbell },
  { title: "تحليل المشي والحركة", icon: Footprints },
  { title: "العلاج المائي", icon: Waves },
  { title: "الاسترخاء والاستشفاء", icon: HeartPulse },
  { title: "جلسات علاجية منزلية", icon: House },
]

/* ✨ animation variants */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const card = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function Services() {
  return (
    // تم إضافة dir="rtl" لضمان تنسيق اللغة العربية بشكل صحيح
    <section id="services" dir="rtl" className="bg-secondary/40 py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4">

        {/* العنوان */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground">
          الخدمات
          </h2>
        </div>

        {/* ✅ شبكة الخدمات المتحركة */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon

            return (
              <motion.div
                key={index}
                variants={card}
                whileHover={{ y: -6 }}
                className="group flex items-center gap-5 p-6 rounded-2xl border border-border bg-white hover:border-[#09b6ab] hover:shadow-lg transition cursor-pointer"
              >
                {/* الأيقونة */}
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#09b6ab]/10 group-hover:bg-[#09b6ab] transition">
                  <Icon className="w-7 h-7 text-[#09b6ab] group-hover:text-white transition" />
                </div>

                {/* النص */}
                <h3 className="text-lg font-semibold text-foreground text-right">
                  {service.title}
                </h3>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}