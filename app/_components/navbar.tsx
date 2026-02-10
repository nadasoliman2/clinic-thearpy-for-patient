import Link from "next/link"

export default function Navbar(){
    return(
        <>
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
<Link href="/">
          <div className="flex items-center gap-2">
            
            <div className="w-8 h-8 bg-[#09b6ab] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="font-bold text-lg text-foreground">EliteCare PT</span>
            
          </div>
</Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/booking" className="text-sm text-bold text-foreground hover:text-[#09b6ab] transition">
              Book Now
            </a>
            <a href="#expertise" className="text-sm text-foreground hover:text-[#09b6ab] transition">
              Why Us
            </a>
            <a href="#stories" className="text-sm text-foreground hover:text-[#09b6ab] transition">
              Success Stories
            </a>
          </nav>

         
        </div>
      </header>

        </>
    )
}