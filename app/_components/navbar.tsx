"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [active, setActive] = useState("")

  useEffect(() => {
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
  }, [])

  const linkStyle = (id) =>
    `text-sm transition ${
      active === id
        ? "text-[#09b6ab] font-semibold"
        : "hover:text-[#09b6ab]"
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#09b6ab] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="font-bold text-lg text-foreground">EliteCare PT</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#expertise" className={linkStyle("expertise")}>Why Us</a>
          <a href="#doctors" className={linkStyle("doctors")}>Doctors</a>
          <a href="#services" className={linkStyle("services")}>Services</a>
        </nav>

        <Link href="/booking">
          <Button className="bg-[#09b6ab] hover:bg-[#09b6ab]/90 text-white text-sm px-4 py-2">
            Book Now
          </Button>
        </Link>
      </div>
    </header>
  )
}
