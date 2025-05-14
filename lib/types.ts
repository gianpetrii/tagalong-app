export interface Trip {
  id: string
  origin: string
  destination: string
  date: string
  departureTime: string
  arrivalTime?: string
  duration?: string
  price: number
  availableSeats: number
  carBrand?: string
  carModel?: string
  meetingPoint?: string
  dropOffPoint?: string
  driverId?: string
  coordinates?: {
    origin?: {
      lat: number
      lng: number
    }
    destination?: {
      lat: number
      lng: number
    }
  }
  carYear?: number
  carPlate?: string
  stops?: Stop[]
  features?: string[]
  notes?: string
  status?: "upcoming" | "completed" | "canceled"
  passengersCount?: number
  // Para compatibilidad con código existente que usa driver
  driver?: Driver
}

export interface Stop {
  location: string
  time: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Driver {
  id: string
  name: string
  avatar: string | null
  rating: number
  reviewCount: number
  memberSince: string
  bio?: string
  preferences?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  rating: number
  reviewCount: number
  memberSince: string
  phone?: string
  bio?: string
  about?: string
  isVerified?: boolean
  emailVerified?: boolean
  phoneVerified?: boolean
  isOnline?: boolean
  badges?: string[]
  carInfo?: {
    brand: string
    model: string
    year?: string
    plate?: string
    isActive: boolean
  }
  createdAt?: any // Firestore timestamp
  lastLogin?: any // Firestore timestamp
  lastLogout?: any // Firestore timestamp
}

export interface Review {
  id: string
  rating: number
  content: string
  date: string
  reviewer: {
    id: string
    name: string
    avatar: string | null
  }
}

export interface UserStats {
  tripsCompleted: number
  passengersTransported: number
  kilometersTotal: number
  averageRating: number
  frequentRoutes: {
    origin: string
    destination: string
    count: number
  }[]
}
