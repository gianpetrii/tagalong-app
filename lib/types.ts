export interface Trip {
  id: string
  origin: string
  destination: string
  date: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  availableSeats: number
  carModel: string
  carColor: string
  meetingPoint: string
  dropOffPoint: string
  driver: Driver
  stops?: Stop[]
  features?: string[]
  notes?: string
}

export interface Stop {
  location: string
  time: string
}

export interface Driver {
  id: string
  name: string
  avatar: string | null
  rating: number
  reviewCount: number
  memberSince: string
  bio?: string
  preferences: string[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  rating: number
  reviewCount: number
  memberSince: string
  bio?: string
  isVerified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  isOnline?: boolean
  badges?: string[]
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
