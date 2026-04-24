export const DEFAULT_SETTINGS = {
  businessName: 'MR P Auto Tech Ltd',
  tagline: 'Precision Auto Engineering',
  phone: '08138412608',
  whatsapp: '2348138412608',
  email: 'info@mrpautotech.com',
  address: 'Owerri, Imo State, Nigeria',
  mapEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.9!2d7.0451943!3d5.448401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10425ba9371c53b7%3A0xf5c708f8771b6829!2sMR%20P%20-%20Auto%20Tech%20limited!5e0!3m2!1sen!2sng!4v1700000000000',
  hoursWeekday: 'Monday – Saturday: 8:00 AM – 6:00 PM',
  hoursSunday: 'Sunday: Closed',
  facebook: '#',
  instagram: '#',
  heroTitle: 'Precision Auto Engineering',
  heroSubtitle:
    'Expert automobile engineering, diagnostics, repairs and fleet services you can trust. MR P Auto Tech Ltd — where quality meets reliability in Owerri.',
  yearsExperience: '5',
  carsServiced: '1500',
  satisfaction: '98',
  technicians: '12',
}

export const DEFAULT_SERVICES = [
  {
    id: 'svc-1',
    icon: '🔧',
    title: 'Car Repairs & Servicing',
    description:
      'Full mechanical repairs and scheduled servicing for all vehicle makes and models — petrol, diesel, and hybrid.',
    visible: true,
  },
  {
    id: 'svc-2',
    icon: '🔬',
    title: 'Advanced Diagnostics',
    description:
      'Computer-based engine diagnostics to accurately identify faults, saving you time and unnecessary parts costs.',
    visible: true,
  },
  {
    id: 'svc-3',
    icon: '🛞',
    title: 'Tyre & Wheel Services',
    description:
      'Tyre fitting, balancing, alignment, and rotation for a smoother, safer ride and extended tyre life.',
    visible: true,
  },
  {
    id: 'svc-4',
    icon: '🏎️',
    title: 'Auto Parts Supply',
    description:
      'Genuine and high-quality aftermarket parts sourced for your vehicle — with fitting available on-site.',
    visible: true,
  },
  {
    id: 'svc-5',
    icon: '🚛',
    title: 'Fleet Management',
    description:
      'Dedicated maintenance plans and priority scheduling for businesses with multiple vehicles in their fleet.',
    visible: true,
  },
  {
    id: 'svc-6',
    icon: '🎨',
    title: 'Body Works & Paint',
    description:
      'Panel beating, dent removal, and professional spray painting to restore your vehicle to showroom condition.',
    visible: true,
  },
]

export const DEFAULT_TESTIMONIALS = [
  {
    id: 'tst-1',
    name: 'Chukwuemeka O.',
    role: 'Toyota Camry Owner',
    text: "These guys are thorough and honest. My car had an issue three other workshops couldn't figure out — MR P diagnosed it in 30 minutes. Excellent work.",
    stars: 5,
    visible: true,
  },
  {
    id: 'tst-2',
    name: 'Adaeze N.',
    role: 'Fleet Manager, Owerri',
    text: 'I manage a fleet of 8 vehicles and MR P Auto Tech handles all of them. Timely, professional and always transparent about pricing. Highly recommended.',
    stars: 5,
    visible: true,
  },
  {
    id: 'tst-3',
    name: 'Ifeanyi M.',
    role: 'Honda CR-V Owner',
    text: "Best auto workshop experience I've had in Owerri. Clean facility, fair prices, and they actually WhatsApp you updates on your car. Will keep coming back.",
    stars: 5,
    visible: true,
  },
]

export const DEFAULT_GALLERY = [
  { id: 'gal-1', url: '', title: 'Engine Repair', category: 'Repairs', visible: true },
  { id: 'gal-2', url: '', title: 'Computer Diagnostics', category: 'Diagnostics', visible: true },
  { id: 'gal-3', url: '', title: 'Tyre Alignment', category: 'Tyres', visible: true },
  { id: 'gal-4', url: '', title: 'Spray Painting', category: 'Body Work', visible: true },
  { id: 'gal-5', url: '', title: 'Fleet Maintenance', category: 'Fleet', visible: true },
  { id: 'gal-6', url: '', title: 'Auto Parts', category: 'Parts', visible: true },
]

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const VALID_BOOKING_STATUSES = new Set(Object.values(BOOKING_STATUSES))
