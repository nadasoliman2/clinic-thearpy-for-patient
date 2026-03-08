import { MapPin, Phone, Mail, ChevronLeft } from 'lucide-react'

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-gradient-to-b from-secondary to-white py-16 md:py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* الشعار والوصف */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#09b6ab] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EC</span>
              </div>
              <span className="font-bold text-lg text-foreground">EliteCare</span>
            </div>
            <p className="text-sm text-[#09b6ab] leading-relaxed">
              علاج طبيعي متميز لاستعادة الأداء المثالي والتعافي السريع. نحن نعتني بحركتك.
            </p>
          </div>

          {/* الخدمات */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">خدماتنا</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-[#09b6ab] hover:underline transition">الطب الرياضي</a></li>
              <li><a href="#" className="text-[#09b6ab] hover:underline transition">تأهيل ما بعد الجراحة</a></li>
              <li><a href="#" className="text-[#09b6ab] hover:underline transition">التدريب الرياضي المتخصص</a></li>
              <li><a href="#" className="text-[#09b6ab] hover:underline transition">العلاج اليدوي</a></li>
            </ul>
          </div>

          {/* الفروع في القاهرة */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">فروعنا</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-[#09b6ab]">
                <MapPin className="w-4 h-4" />
                <span>المعادي، القاهرة</span>
              </li>
              <li className="flex items-center gap-2 text-[#09b6ab]">
                <MapPin className="w-4 h-4" />
                <span>التجمع الخامس</span>
              </li>
              <li className="flex items-center gap-2 text-[#09b6ab]">
                <MapPin className="w-4 h-4" />
                <span>الشيخ زايد</span>
              </li>
            </ul>
          </div>

          {/* التواصل */}
          <div>
            <h4 className="font-bold mb-4 text-foreground">تواصل معنا</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#09b6ab]" />
                <span className="text-[#09b6ab]" dir="ltr">+20 100 000 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#09b6ab]" />
                <span className="text-[#09b6ab]">info@elitecare-eg.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} إيليت كير للعلاج الطبيعي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}