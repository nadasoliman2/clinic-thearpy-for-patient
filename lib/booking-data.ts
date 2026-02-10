// Booking system data
export const services = [
  { id: 'sports-medicine', name: 'Sports Medicine', description: 'For athletic injuries and performance' },
  { id: 'post-operative', name: 'Post-Operative Recovery', description: 'Recovery after surgery' },
  { id: 'athletic-performance', name: 'Athletic Performance', description: 'Enhance your athletic abilities' },
  { id: 'injury-rehab', name: 'Injury Rehabilitation', description: 'General injury recovery' },
]

export const locations = [
  { id: 'miami', name: 'Miami Wellness Center', address: '123 Miami Ave, Miami, FL' },
  { id: 'downtown', name: 'Downtown Clinic', address: '456 Main St, Downtown' },
  { id: 'newyork', name: 'New York Performance Lab', address: '789 Broadway, New York, NY' },
]

export const therapists = [
  {
    id: 'sarah-mitchell',
    name: 'Dr. Sarah Mitchell',
    role: 'Sports Specialist',
    imageUrl: '/therapist-sarah.jpg',
    locations: ['miami', 'downtown'],
    services: ['sports-medicine', 'athletic-performance'],
    availability: [
      { time: '6:00 AM', available: true },
      { time: '9:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '1:30 PM', available: false },
      { time: '3:00 PM', available: true },
      { time: '4:30 PM', available: true },
    ],
  },
  {
    id: 'james-wilson',
    name: 'Dr. James Wilson',
    role: 'Recovery Expert',
    imageUrl: '/therapist-james.jpg',
    locations: ['miami', 'newyork'],
    services: ['post-operative', 'injury-rehab'],
    availability: [
      { time: '6:00 AM', available: false },
      { time: '9:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '1:30 PM', available: true },
      { time: '3:00 PM', available: true },
      { time: '4:30 PM', available: false },
    ],
  },
  {
    id: 'elena-rodriguez',
    name: 'Dr. Elena Rodriguez',
    role: 'Performance Coach',
    imageUrl: '/therapist-elena.jpg',
    locations: ['downtown', 'newyork'],
    services: ['athletic-performance', 'injury-rehab'],
    availability: [
      { time: '6:00 AM', available: true },
      { time: '9:00 AM', available: true },
      { time: '11:00 AM', available: false },
      { time: '1:30 PM', available: true },
      { time: '3:00 PM', available: true },
      { time: '4:30 PM', available: true },
    ],
  },
]

export const timeSlots = [
  '6:00 AM',
  '9:00 AM',
  '11:00 AM',
  '1:30 PM',
  '3:00 PM',
  '4:30 PM',
]

export interface BookingState {
  service: string | null
  location: string | null
  therapist: string | null
  time: string | null
  patientData: {
    fullName: string
    email: string
    phone: string
    condition: string
  }
}
