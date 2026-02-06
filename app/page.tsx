import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, Play, MapPin, Phone, Mail, Check, Star } from 'lucide-react'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="font-bold text-lg text-foreground">EliteCare PT</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm text-foreground hover:text-primary">
              Services
            </a>
            <a href="#expertise" className="text-sm text-foreground hover:text-primary">
              Expertise
            </a>
            <a href="#stories" className="text-sm text-foreground hover:text-primary">
              Success Stories
            </a>
            <a href="#locations" className="text-sm text-foreground hover:text-primary">
              Locations
            </a>
          </nav>

          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Patient Portal
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-bold text-primary mb-4 tracking-wider">
              PREMIUM PHYSICAL THERAPY
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Elite Care for <span className="text-primary">Peak Performance</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Experience high-end physical therapy tailored to your recovery journey. We combine advanced technology with personalized manual therapy for athletes and individuals seeking excellence.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Healing
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Play className="w-4 h-4" />
                Watch Video
              </Button>
            </div>
          </div>

          <div className="relative h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl"></div>
            <div className="relative h-full bg-primary/5 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src="/hero-therapy.jpg"
                alt="Physical therapy session"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">Quick Booking</h2>
              <p className="text-muted-foreground">Secure your premium consultation in minutes</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Steps */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <span className="font-semibold text-foreground">Service</span>
                </div>
                <select className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-white">
                  <option>SELECT SERVICE</option>
                  <option>Sports Medicine</option>
                  <option>Post-Op Recovery</option>
                  <option>Athletic Training</option>
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <span className="font-semibold text-foreground">Area</span>
                </div>
                <select className="w-full px-4 py-2 border border-border rounded-lg text-foreground bg-white">
                  <option>CHOOSE A LOCATION</option>
                  <option>Miami Wellness Center</option>
                  <option>Downtown Clinic</option>
                  <option>New York Location</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <span className="font-semibold text-foreground">Therapist</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Dr. Sarah Mitchell', role: 'Sports Therapy' },
                    { name: 'Dr. James Wilson', role: 'Recovery Specialist' },
                    { name: 'Dr. Elena Rodriguez', role: 'Performance Coach' },
                  ].map((therapist) => (
                    <button
                      key={therapist.name}
                      className="p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-2"></div>
                      <p className="text-sm font-semibold text-foreground">{therapist.name}</p>
                      <p className="text-xs text-muted-foreground">{therapist.role}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <span className="font-semibold text-foreground">Schedule</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {['06:00 AM', '09:10 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:15 PM'].map((time) => (
                  <button
                    key={time}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      time === '11:00 AM'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-primary/10'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                Confirm Booking <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Excellence Section */}
      <section id="expertise" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Clinical Excellence</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We utilize state-of-the-art diagnostic tools and treatment modalities to ensure your recovery is efficient and sustainable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔬',
              title: 'Diagnostic Accuracy',
              description: 'Advanced imaging and assessment techniques to identify the root cause of pain, not just symptoms.',
            },
            {
              icon: '🎯',
              title: 'Performance Focus',
              description: 'Specialized programs designed for elite professionals and athletes seeking peak performance criteria.',
            },
            {
              icon: '🌿',
              title: 'Holistic Recovery',
              description: 'Integrated coaching to support your physical therapy journey with sustainable lifestyle changes.',
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="stories" className="bg-foreground py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-foreground/50 to-foreground/30 rounded-2xl p-12 text-white">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-sm font-semibold">4.9/5 Rating</span>
            </div>

            <h2 className="text-3xl font-bold mb-8">Patient Success Stories</h2>

            <p className="text-lg mb-8 leading-relaxed max-w-2xl">
              Join over 5,000 patients who have regained mobility and elite performance with EliteCare PT.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  name: 'Michael R.',
                  role: 'Professional Athlete',
                  quote:
                    '"They personalized attention I received after my ACL surgery was tremendous. I\'m now better than my doctor predicted."',
                },
                {
                  name: 'Sarah L.',
                  role: 'Marathon Runner',
                  quote:
                    '"Truly found a therapist who understands. The manual therapy combined with chronic back pain protocols was life-changing."',
                },
              ].map((story, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex-shrink-0"></div>
                  <div>
                    <p className="italic mb-4">{story.quote}</p>
                    <p className="font-semibold">{story.name}</p>
                    <p className="text-sm text-white/80">{story.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready to regain your mobility?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Don't leave pain to chance. Book initial assessment today and take the first step towards a pain-free life.
        </p>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Book My Free Consultation
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EC</span>
                </div>
                <span className="font-bold text-lg">EliteCare PT</span>
              </div>
              <p className="text-sm text-white/80">
                Advancing physical therapy with technology and personalized care for peak performance.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">OUR SERVICES</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-primary">
                    Sports Medicine
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Post-Op Recovery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Athletic Training
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Manual Therapy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">LOCATIONS</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-primary">
                    Miami Wellness Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Downtown Clinic
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    New York Performance Lab
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">CONTACT</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (305) 900-5751</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>care@elitecpt.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>© 2024 EliteCare PT. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
