import { ChevronRight, MapPin, Phone, Mail, Check, Star, Clock, Users } from 'lucide-react'

export default function Footer(){
    return(
        <>
          <footer className="bg-gradient-to-b from-secondary to-white
 text-white py-16 md:py-10 ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#09b6ab] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EC</span>
                </div>
                <span className="font-bold text-lg text-foreground">EliteCare PT</span>
              </div>
              <p className="text-sm text-[#09b6ab]  leading-relaxed">
                Premium physical therapy for peak performance recovery.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Services</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="text-[#09b6ab] transition">Sports Medicine</a></li>
                <li><a href="#" className="text-[#09b6ab] transition">Post-Op Recovery</a></li>
                <li><a href="#" className="text-[#09b6ab] transition">Athletic Training</a></li>
                <li><a href="#" className="text-[#09b6ab] transition">Manual Therapy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Locations</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="text-[#09b6ab] transition">Miami Center</a></li>
                <li><a href="#" className="text-[#09b6ab] transition">Downtown Clinic</a></li>
                <li><a href="#" className="text-[#09b6ab] transition">New York Lab</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#09b6ab]" />
                  <span className="text-[#09b6ab]">+1 (305) 900-5751</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#09b6ab]" />
                  <span className="text-[#09b6ab]">care@elitecpt.com</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </footer>
        </>
    )
}