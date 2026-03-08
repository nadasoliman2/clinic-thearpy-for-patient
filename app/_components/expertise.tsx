"use client"

import {
  Activity,
  UserCheck,
  BadgeCheck,
  ChevronLeft
} from "lucide-react"

import { motion } from "framer-motion"

const expertise = [
  {
    title: 'تشخيص متقدم',
    description:
      'نستخدم أحدث تقنيات التصوير والتقييم لتحديد الأسباب الجذرة للمشكلة، وليس فقط الأعراض.',
    icon: Activity,
  },
  {
    title: 'أخصائيون خبراء',
    description:
      'معالجون معتمدون لديهم أكثر من 10 سنوات من الخبرة في الطب الرياضي وعلاجات الاستشفاء.',
    icon: UserCheck,
  },
  {
    title: 'نتائج مثبتة',
    description:
      'أبلغ 95% من مرضانا عن تحسن ملحوظ في غضون 6 أسابيع من بدء البرنامج العلاجي.',
    icon: BadgeCheck,
  },
]

/* ✨ animation variants */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
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
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

export default function Expertise() {
  return (
    <section id="expertise" dir="rtl" className="bg-white py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          خبراتنا وتميزنا
        </h2>

        {/* ✅ الجريد المتحرك */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {expertise.map((item, idx) => {
            const Icon = item.icon

            return (
              <motion.div
                key={idx}
                variants={card}
                whileHover={{ y: -6 }}
                className="group p-8 rounded-2xl bg-white border border-border 
                           hover:border-[#09b6ab] hover:shadow-xl transition 
                           flex flex-col text-right"
              >
                {/* الأيقونة */}
                <div className="w-16 h-16 mb-5 rounded-xl bg-[#09b6ab]/10 
                                flex items-center justify-center
                                group-hover:bg-[#09b6ab] transition">
                  <Icon className="w-8 h-8 text-[#09b6ab] group-hover:text-white transition" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed flex-1">
                  {item.description}
                </p>

                <div className="mt-6 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition">
                  <a
                    href="/booking"
                    className="text-[#09b6ab] font-semibold text-sm flex items-center gap-2"
                  >
                    احجز موعدك الآن <ChevronLeft className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}