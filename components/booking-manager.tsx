'use client'

import { useState } from 'react'
import { BookingForm } from './booking-form'
import { LookupBooking } from './lookup-booking'
import { BookingDetails } from './booking-details'
import { RescheduleBooking } from './reschedule-booking'
import { Calendar, RefreshCw } from 'lucide-react'

type ViewType = 'main' | 'new-booking' | 'lookup' | 'details' | 'reschedule'

interface BookingState {
  booking?: any
}

export function BookingManager() {
  const [currentView, setCurrentView] = useState<ViewType>('main')
  const [bookingState, setBookingState] = useState<BookingState>({})

  const handleNewBooking = () => {
    setCurrentView('new-booking')
  }

  const handleLookupClick = () => {
    setCurrentView('lookup')
  }

  const handleRescheduleClick = () => {
    setCurrentView('lookup')
  }

  const handleBookingFound = (booking: any) => {
    setBookingState({ booking })
    setCurrentView('details')
  }

  const handleRescheduleBooking = (booking: any) => {
    setBookingState({ booking })
    setCurrentView('reschedule')
  }

  const handleBackToMain = () => {
    setCurrentView('main')
    setBookingState({})
  }

  const handleBackToLookup = () => {
    setCurrentView('lookup')
    setBookingState({})
  }

  return (
    <section id="booking" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
          {/* Header - Changes based on current view */}
          <div className="bg-[#09b6ab] p-8 md:p-12 text-white">
            {currentView === 'main' && (
              <>
                <h2 className="text-4xl font-bold mb-3">Book Your Session</h2>
                <p className="text-white/90 text-lg">Choose an option to manage your appointments</p>
              </>
            )}
            {currentView === 'new-booking' && (
              <>
                <h2 className="text-4xl font-bold mb-3">Book a New Session</h2>
                <p className="text-white/90 text-lg">Select your date first to see available times</p>
              </>
            )}
            {currentView === 'lookup' && (
              <>
                <h2 className="text-4xl font-bold mb-3">Look Up Existing Booking</h2>
                <p className="text-white/90 text-lg">Enter your booking details to manage your appointment</p>
              </>
            )}
            {currentView === 'details' && (
              <>
                <h2 className="text-4xl font-bold mb-3">Appointment Details</h2>
                <p className="text-white/90 text-lg">View and manage your booking</p>
              </>
            )}
            {currentView === 'reschedule' && (
              <>
                <h2 className="text-4xl font-bold mb-3">Reschedule Your Appointment</h2>
                <p className="text-white/90 text-lg">Choose a new date and time</p>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Main Menu */}
            {currentView === 'main' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2" dir="rtl">
                <div className="text-center mb-8">
                  <p className="text-gray-600 mb-6">اختر ما تريد القيام به:</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* New Booking Card */}
                  <button
                    onClick={handleNewBooking}
                    className="p-8 rounded-xl border-2 border-gray-200 hover:border-[#09b6ab] hover:bg-[#09b6ab]/5 transition transform hover:scale-105 text-right"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-[#09b6ab]/10 p-3 rounded-lg">
                        <Calendar className="w-6 h-6 text-[#09b6ab]" />
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="text-xl font-bold text-gray-900">حجز موعد جديد</h3>
                        <p className="text-gray-600 text-sm mt-1">اختر خدمة جديدة وحدد موعداً</p>
                      </div>
                    </div>
                  </button>

                  {/* Manage Booking Card */}
                  <button
                    onClick={handleLookupClick}
                    className="p-8 rounded-xl border-2 border-gray-200 hover:border-[#09b6ab] hover:bg-[#09b6ab]/5 transition transform hover:scale-105 text-right"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-[#09b6ab]/10 p-3 rounded-lg">
                        <RefreshCw className="w-6 h-6 text-[#09b6ab]" />
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="text-xl font-bold text-gray-900">إدارة حجزك الحالي</h3>
                        <p className="text-gray-600 text-sm mt-1">اعرض أو ألغِ أو أعد جدولة موعدك</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* New Booking View */}
            {currentView === 'new-booking' && (
              <>
                <BookingForm onBackToMain={handleBackToMain} />
              </>
            )}

            {/* Lookup View */}
            {currentView === 'lookup' && (
              <LookupBooking
                onBookingFound={handleBookingFound}
                onBack={handleBackToMain}
              />
            )}

            {/* Details View */}
            {currentView === 'details' && bookingState.booking && (
              <BookingDetails
                booking={bookingState.booking}
                onReschedule={handleRescheduleBooking}
                onBack={handleBackToMain}
              />
            )}

            {/* Reschedule View */}
            {currentView === 'reschedule' && bookingState.booking && (
              <RescheduleBooking
                booking={bookingState.booking}
                onBack={handleBackToMain}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
