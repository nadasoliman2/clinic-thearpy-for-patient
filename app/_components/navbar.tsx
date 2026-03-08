"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation" // لمعرفة الصفحة الحالية
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react" // أيقونات المنيو

export default function Navbar() {
  const [active, setActive] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname() // نحصل على المسار الحالي

  const isBookingPage = pathname === "/booking"

  useEffect(() => {
    if (isBookingPage) return // لا نحتاج لمراقبة السكرول في صفحة الحجز

    const sections = ["expertise", "doctors", "services"]
    const handleScroll = () => {
      const scrollY = window.scrollY + 120
      sections.forEach((id) => {
        const section = document.getElementById(id)
        if (!section) return
        const top = section.offsetTop
        const height = section.offsetHeight
        if (scrollY >= top && scrollY < top + height) {
          setActive(id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isBookingPage])

  const linkStyle = (id: string) =>
    `text-sm transition-colors duration-200 ${
      active === id ? "text-[#09b6ab] font-bold" : "text-muted-foreground hover:text-[#09b6ab]"
    }`

  const NavLinks = () => (
    <>
      <a href="/#expertise" onClick={() => setIsMenuOpen(false)} className={linkStyle("expertise")}>لماذا نحن؟</a>
      <a href="/#doctors" onClick={() => setIsMenuOpen(false)} className={linkStyle("doctors")}>أطباؤنا</a>
      <a href="/#services" onClick={() => setIsMenuOpen(false)} className={linkStyle("services")}>خدماتنا</a>
    </>
  )

  return (
    <header dir="rtl" className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border font-sans">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* الشعار */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#09b6ab] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">EliteCare</span>
          </div>
        </Link>

        {/* الروابط للشاشات الكبيرة */}
        <nav className="hidden md:flex items-center gap-10">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-4">
          {/* زر "احجز الآن" يختفي فقط إذا كنا في صفحة الحجز */}
         
            <Link href="/booking" className="hidden md:block">
              <Button className="bg-[#09b6ab] hover:bg-[#079d94] text-white rounded-full px-6">
                احجز الآن
              </Button>
            </Link>
          

          {/* زر المنيو للموبايل */}
          <button 
            className="md:hidden p-2 text-slate-600" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* القائمة المنسدلة للموبايل (Mobile Menu) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 gap-6 text-center">
            <NavLinks />
            
            {/* في الموبايل: لو مش في صفحة الحجز، أظهر زر الحجز داخل المنيو */}
        
              <Link href="/booking" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-[#09b6ab] hover:bg-[#079d94] text-white rounded-2xl py-6 text-lg font-bold">
                  احجز الآن
                </Button>
              </Link>
       
          </nav>
        </div>
      )}
    </header>
  )
}