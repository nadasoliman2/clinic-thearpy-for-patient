import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, MapPin, Phone, Mail, Check, Star, Clock, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0bdada] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="font-bold text-lg text-foreground">EliteCare PT</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#booking" className="text-sm text-bold text-foreground hover:text-[#0bdada] transition">
              Book Now
            </a>
            <a href="#expertise" className="text-sm text-foreground hover:text-[#0bdada] transition">
              Why Us
            </a>
            <a href="#stories" className="text-sm text-foreground hover:text-[#0bdada] transition">
              Success Stories
            </a>
          </nav>

         
        </div>
      </header>

      {/* Hero Section */}
      <section className=" px-4 py-16 md:py-24 bg-gradient-to-b from-secondary to-white">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto ">
          <div className="space-y-6">
            <div>
              <span className="text-sm font-semibold text-[#0bdada] tracking-wider">PREMIUM PHYSICAL THERAPY</span>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mt-3 leading-tight">
                Recover. Perform. <span className="text-[#0bdada]">Thrive.</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Experience personalized physical therapy designed for peak performance. From injury recovery to athletic excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href='#booking'>
              <Button   size="lg"   className="bg-[#0bdada] text-[#0bdada]-foreground hover:bg-[#0bdada]/90 rounded-full">
                Book Your Appointment
              </Button>
              </Link>
           
            </div>
          </div>

          <div className="relative h-96 md:h-full md:min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0bdada]/30 via-[#0bdada]/10 to-transparent rounded-3xl"></div>
            <Image
              src="/hero-therapy.jpg"
              alt="Physical therapy session at EliteCare"
              fill
              className="object-cover rounded-3xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Quick Booking Section - FEATURED */}
      <section id="booking" className=" py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
            {/* Header */}
            <div className="bg-[#0bdada] p-8 md:p-12 text-white">
              <h2 className="text-4xl font-bold mb-3">Book Your Session</h2>
              <p className="text-white/90 text-lg">Get started in 4 simple steps</p>
            </div>

            {/* Booking Form */}
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Service Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0bdada] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <label className="font-semibold text-foreground">Select Service</label>
                  </div>
                  <select className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-white hover:border-[#0bdada] transition focus:outline-none focus:border-[#0bdada] focus:ring-2 focus:ring-[#0bdada]/20">
                    <option defaultValue>Choose a service...</option>
                    <option>Sports Medicine</option>
                    <option>Post-Operative Recovery</option>
                    <option>Athletic Performance</option>
                    <option>Injury Rehabilitation</option>
                  </select>
                </div>

                {/* Location Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0bdada] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <label className="font-semibold text-foreground">Choose Location</label>
                  </div>
                  <select className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-white hover:border-[#0bdada] transition focus:outline-none focus:border-[#0bdada] focus:ring-2 focus:ring-[#0bdada]/20">
                    <option defaultValue>Select a location...</option>
                    <option>Miami Wellness Center</option>
                    <option>Downtown Clinic</option>
                    <option>New York Performance Lab</option>
                  </select>
                </div>
              </div>

              {/* Therapist Selection */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0bdada] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <label className="font-semibold text-foreground">Select Your Therapist</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'Dr. Sarah Mitchell', role: 'Sports Specialist', availability: 'Available' },
                    { name: 'Dr. James Wilson', role: 'Recovery Expert', availability: 'Available' },
                    { name: 'Dr. Elena Rodriguez', role: 'Performance Coach', availability: 'Available' },
                  ].map((therapist) => (
                    <button
                      key={therapist.name}
                      className="group p-5 border-2 border-border rounded-xl hover:border-[#0bdada] hover:bg-[#0bdada]/5 transition duration-300"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0bdada]/40 to-[#0bdada]/20 mx-auto mb-3 flex items-center justify-center">
                        <Users className="w-8 h-8 text-[#0bdada]" />
                      </div>
                      <p className="font-semibold text-foreground text-sm">{therapist.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{therapist.role}</p>
                      <p className="text-xs text-[#0bdada] font-medium mt-2">{therapist.availability}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0bdada] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    4
                  </div>
                  <label className="font-semibold text-foreground">Choose Time Slot</label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['6:00 AM', '9:00 AM', '11:00 AM', '1:30 PM', '3:00 PM', '4:30 PM'].map((time) => (
                    <button
                      key={time}
                      className={`py-3 px-4 rounded-xl font-medium transition duration-300 border-2 ${
                        time === '11:00 AM'
                          ? 'bg-[#0bdada] text-white border-[#0bdada]'
                          : 'border-border text-foreground hover:border-[#0bdada] hover:bg-[#0bdada]/5'
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-2" />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#0bdada] text-white hover:bg-[#0bdada]/90 rounded-xl flex-1 font-semibold">
                  Confirm Booking <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
             
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Excellence Section */}
      <section id="expertise" className=" px-4 py-20 md:py-24 bg-gradient-to-b from-secondary to-white">
       <div className='max-w-7xl mx-auto'>
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-[#0bdada] tracking-wider">WHY CHOOSE US</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">Clinical Excellence</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We combine advanced diagnostic technology with personalized care to deliver results that matter.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Advanced Diagnostics',
              description: 'State-of-the-art imaging and assessment to identify root causes, not just symptoms.',
              icon: '⚙️',
            },
            {
              title: 'Expert Specialists',
              description: 'Board-certified therapists with 10+ years experience in sports and recovery medicine.',
              icon: '👨‍⚕️',
            },
            {
              title: 'Proven Results',
              description: '95% of patients report significant improvement within 6 weeks of starting care.',
              icon: '✓',
            },
          ].map((item, idx) => (
            <div key={idx} className="group p-8 rounded-2xl bg-white border border-border hover:border-[#0bdada] hover:shadow-lg transition duration-300">
              <div className="text-5xl mb-4 opacity-80 group-hover:opacity-100 transition">{item.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              <div className="mt-4 pt-4 border-t border-border opacity-0 group-hover:opacity-100 transition">
                <a href="#booking" className="text-[#0bdada] font-semibold text-sm flex items-center gap-2">
                  Book Now <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
</div>
      </section>

      {/* Success Stories Section */}
      <section id="stories" className="bg-gradient-to-b from-white to-secondary py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#0bdada] text-[#0bdada]" />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">4.9/5 - Trusted by 5,000+ Patients</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from real patients who regained mobility and peak performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Michael R.',
                role: 'Professional Athlete',
                quote: 'The personalized attention after my ACL surgery was tremendous. I\'m performing better than before the injury.',
                rating: 5,
              },
              {
                name: 'Sarah L.',
                role: 'Marathon Runner',
                quote: 'Finally found a therapist who understands chronic pain. The results have been life-changing.',
                rating: 5,
              },
              {
                name: 'James K.',
                role: 'Tech Executive',
                quote: 'Dealing with back pain from my desk job became manageable within weeks. Highly recommend.',
                rating: 5,
              },
              {
                name: 'Elena M.',
                role: 'Sports Enthusiast',
                quote: 'The holistic approach combining therapy with lifestyle coaching is what sets EliteCare apart.',
                rating: 5,
              },
            ].map((story, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#0bdada] text-[#0bdada]" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">"{story.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0bdada]/40 to-[#0bdada]/20 flex items-center justify-center">
                    <span className="font-bold text-[#0bdada] text-lg">{story.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{story.name}</p>
                    <p className="text-xs text-muted-foreground">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gradient-to-b from-secondary to-white
 text-white py-16 md:py-10 ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0bdada] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EC</span>
                </div>
                <span className="font-bold text-lg text-foreground">EliteCare PT</span>
              </div>
              <p className="text-sm text-[#0bdada]  leading-relaxed">
                Premium physical therapy for peak performance recovery.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Services</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="text-[#0bdada] transition">Sports Medicine</a></li>
                <li><a href="#" className="text-[#0bdada] transition">Post-Op Recovery</a></li>
                <li><a href="#" className="text-[#0bdada] transition">Athletic Training</a></li>
                <li><a href="#" className="text-[#0bdada] transition">Manual Therapy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Locations</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="text-[#0bdada] transition">Miami Center</a></li>
                <li><a href="#" className="text-[#0bdada] transition">Downtown Clinic</a></li>
                <li><a href="#" className="text-[#0bdada] transition">New York Lab</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0bdada]" />
                  <span className="text-[#0bdada]">+1 (305) 900-5751</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0bdada]" />
                  <span className="text-[#0bdada]">care@elitecpt.com</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  )
}
