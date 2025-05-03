import type { Trip, User, Review, UserStats } from "./types"

// Mock data for trips
const mockTrips: Trip[] = [
  {
    id: "1",
    origin: "Buenos Aires",
    destination: "Mar del Plata",
    date: "2025-05-15",
    departureTime: "08:00",
    arrivalTime: "12:30",
    duration: "4h 30m",
    price: 4500,
    availableSeats: 3,
    carModel: "Toyota Corolla",
    carColor: "Gris",
    meetingPoint: "Terminal de Retiro",
    dropOffPoint: "Terminal de Mar del Plata",
    driver: {
      id: "101",
      name: "Carlos Rodríguez",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 4.8,
      reviewCount: 56,
      memberSince: "Enero 2023",
      bio: "Viajo regularmente entre Buenos Aires y Mar del Plata por trabajo. Me gusta la música y las charlas amenas durante el viaje.",
      preferences: ["No fumar", "Mascotas permitidas", "Música permitida", "Aire acondicionado"],
    },
    stops: [
      {
        location: "Chascomús",
        time: "09:15",
      },
      {
        location: "Dolores",
        time: "10:30",
      },
    ],
    features: ["Aire acondicionado", "Música", "Mascotas permitidas"],
  },
  {
    id: "2",
    origin: "Buenos Aires",
    destination: "Rosario",
    date: "2025-05-16",
    departureTime: "10:00",
    arrivalTime: "13:30",
    duration: "3h 30m",
    price: 3800,
    availableSeats: 2,
    carModel: "Volkswagen Golf",
    carColor: "Azul",
    meetingPoint: "Estación de servicio YPF (Av. Libertador)",
    dropOffPoint: "Plaza 25 de Mayo",
    driver: {
      id: "102",
      name: "Laura Fernández",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 4.9,
      reviewCount: 42,
      memberSince: "Marzo 2023",
      preferences: ["No fumar", "No mascotas", "Música permitida", "Aire acondicionado"],
    },
    features: ["Aire acondicionado", "Música", "Equipaje grande"],
  },
  {
    id: "3",
    origin: "Córdoba",
    destination: "Mendoza",
    date: "2025-05-17",
    departureTime: "07:30",
    arrivalTime: "13:00",
    duration: "5h 30m",
    price: 5200,
    availableSeats: 4,
    carModel: "Ford Ecosport",
    carColor: "Rojo",
    meetingPoint: "Terminal de Córdoba",
    dropOffPoint: "Terminal de Mendoza",
    driver: {
      id: "103",
      name: "Martín Gómez",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 4.7,
      reviewCount: 28,
      memberSince: "Junio 2023",
      bio: "Amante de los viajes y la naturaleza. Disfruto conocer gente nueva en mis trayectos.",
      preferences: ["No fumar", "Mascotas pequeñas", "Música a elección", "Paradas para café"],
    },
    stops: [
      {
        location: "Villa Carlos Paz",
        time: "08:15",
      },
      {
        location: "San Luis",
        time: "10:45",
      },
    ],
    features: ["Aire acondicionado", "Mascotas permitidas"],
  },
]

// Mock data for users
const mockUsers: User[] = [
  {
    id: "101",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    avatar: "/placeholder.svg?height=128&width=128",
    rating: 4.8,
    reviewCount: 56,
    memberSince: "Enero 2023",
    bio: "Viajo regularmente entre Buenos Aires y Mar del Plata por trabajo. Me gusta la música y las charlas amenas durante el viaje.",
    isVerified: true,
    emailVerified: true,
    phoneVerified: true,
    isOnline: true,
    badges: ["Conductor Experto", "Viajero Frecuente"],
  },
  {
    id: "102",
    name: "Laura Fernández",
    email: "laura@example.com",
    avatar: "/placeholder.svg?height=128&width=128",
    rating: 4.9,
    reviewCount: 42,
    memberSince: "Marzo 2023",
    bio: "Profesional que viaja por trabajo. Disfruto de conversaciones interesantes y compartir experiencias.",
    isVerified: true,
    emailVerified: true,
    phoneVerified: true,
    isOnline: false,
    badges: ["Conductora Verificada"],
  },
]

// Mock data for reviews
const mockReviews: Record<string, Review[]> = {
  "101": [
    {
      id: "201",
      rating: 5,
      content:
        "Excelente conductor, muy puntual y amable. El viaje fue muy cómodo y agradable. Definitivamente volvería a viajar con Carlos.",
      date: "15 de abril, 2025",
      reviewer: {
        id: "301",
        name: "Ana Martínez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "202",
      rating: 4,
      content:
        "Buen viaje en general. Carlos es un conductor responsable y el auto estaba limpio. La única observación es que llegamos un poco tarde al destino debido al tráfico.",
      date: "2 de abril, 2025",
      reviewer: {
        id: "302",
        name: "Pablo Sánchez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "203",
      rating: 5,
      content:
        "Viaje perfecto. Carlos es muy conversador y hace que el tiempo pase rápido. El auto muy cómodo y limpio. Totalmente recomendable.",
      date: "20 de marzo, 2025",
      reviewer: {
        id: "303",
        name: "Lucía Pérez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ],
  "102": [
    {
      id: "204",
      rating: 5,
      content:
        "Laura es una excelente conductora, muy prudente y amable. El viaje fue muy agradable y llegamos antes de lo previsto. Recomiendo 100%.",
      date: "10 de abril, 2025",
      reviewer: {
        id: "304",
        name: "Diego Morales",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "205",
      rating: 5,
      content:
        "Excelente experiencia. Laura es muy puntual y su auto es muy cómodo. Además, es muy agradable conversar con ella durante el viaje.",
      date: "28 de marzo, 2025",
      reviewer: {
        id: "305",
        name: "Valentina López",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ],
}

// Mock trip reviews
const mockTripReviews: Record<string, Review[]> = {
  "1": [
    {
      id: "301",
      rating: 5,
      content:
        "Excelente viaje. El conductor fue muy puntual y amable. El auto estaba limpio y cómodo. Recomiendo totalmente.",
      date: "18 de mayo, 2025",
      reviewer: {
        id: "401",
        name: "Martina López",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "302",
      rating: 4,
      content:
        "Buen viaje en general. El conductor fue amable y el auto cómodo. Solo llegamos un poco tarde por el tráfico.",
      date: "17 de mayo, 2025",
      reviewer: {
        id: "402",
        name: "Juan Pérez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ],
}

// Mock user stats
const mockUserStats: Record<string, UserStats> = {
  "101": {
    tripsCompleted: 87,
    passengersTransported: 213,
    kilometersTotal: 15420,
    averageRating: 4.8,
    frequentRoutes: [
      {
        origin: "Buenos Aires",
        destination: "Mar del Plata",
        count: 42,
      },
      {
        origin: "Buenos Aires",
        destination: "Rosario",
        count: 28,
      },
      {
        origin: "Buenos Aires",
        destination: "La Plata",
        count: 17,
      },
    ],
  },
  "102": {
    tripsCompleted: 64,
    passengersTransported: 158,
    kilometersTotal: 9870,
    averageRating: 4.9,
    frequentRoutes: [
      {
        origin: "Buenos Aires",
        destination: "Rosario",
        count: 38,
      },
      {
        origin: "Rosario",
        destination: "Córdoba",
        count: 26,
      },
    ],
  },
}

// List of popular cities in Argentina
const popularCities = [
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "Mar del Plata",
  "La Plata",
  "San Miguel de Tucumán",
  "Salta",
  "Santa Fe",
  "San Juan",
  "Resistencia",
  "Neuquén",
  "Posadas",
  "Bariloche",
  "Formosa",
  "Corrientes",
  "Bahía Blanca",
  "Paraná",
]

// Mock function to get popular cities
export async function getPopularCities(): Promise<string[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return popularCities
}

// Mock function to get a trip by ID
export async function getTrip(id: string): Promise<Trip | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const trip = mockTrips.find((trip) => trip.id === id)
  return trip || null
}

// Mock function to search trips
export async function searchTrips(
  origin: string,
  destination: string,
  date: string,
  sortBy = "recommended",
  minPrice?: number,
  maxPrice?: number,
  minDepartureTime?: string,
  maxDepartureTime?: string,
  minRating?: number,
): Promise<Trip[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Filter trips
  let filteredTrips = mockTrips.filter(
    (trip) =>
      trip.origin.toLowerCase().includes(origin.toLowerCase()) &&
      trip.destination.toLowerCase().includes(destination.toLowerCase()) &&
      (date ? trip.date === date : true),
  )

  // Apply price filter
  if (minPrice !== undefined) {
    filteredTrips = filteredTrips.filter((trip) => trip.price >= minPrice)
  }
  if (maxPrice !== undefined) {
    filteredTrips = filteredTrips.filter((trip) => trip.price <= maxPrice)
  }

  // Apply departure time filter
  if (minDepartureTime) {
    filteredTrips = filteredTrips.filter((trip) => trip.departureTime >= minDepartureTime)
  }
  if (maxDepartureTime) {
    filteredTrips = filteredTrips.filter((trip) => trip.departureTime <= maxDepartureTime)
  }

  // Apply rating filter
  if (minRating !== undefined) {
    filteredTrips = filteredTrips.filter((trip) => trip.driver.rating >= minRating)
  }

  // Sort trips
  switch (sortBy) {
    case "price_asc":
      filteredTrips.sort((a, b) => a.price - b.price)
      break
    case "price_desc":
      filteredTrips.sort((a, b) => b.price - a.price)
      break
    case "departure":
      filteredTrips.sort((a, b) => (a.departureTime > b.departureTime ? 1 : -1))
      break
    case "rating":
      filteredTrips.sort((a, b) => b.driver.rating - a.driver.rating)
      break
    default:
      // Default sorting (recommended) - could be a combination of factors
      break
  }

  return filteredTrips
}

// Mock function to get user profile
export async function getUserProfile(id: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = mockUsers.find((user) => user.id === id)
  return user || null
}

// Mock function to get user reviews
export async function getUserReviews(userId: string): Promise<Review[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  return mockReviews[userId] || []
}

// Mock function to get trip reviews
export async function getTripReviews(tripId: string): Promise<Review[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return mockTripReviews[tripId] || []
}

// Mock function to get user trips
export async function getUserTrips(userId: string): Promise<Trip[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return mockTrips.filter((trip) => trip.driver.id === userId)
}

// Mock function to get user stats
export async function getUserStats(userId: string): Promise<UserStats> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return (
    mockUserStats[userId] || {
      tripsCompleted: 0,
      passengersTransported: 0,
      kilometersTotal: 0,
      averageRating: 0,
      frequentRoutes: [],
    }
  )
}

// Mock function to get related trips
export async function getRelatedTrips(
  origin: string,
  destination: string,
  date: string,
  currentTripId: string,
): Promise<Trip[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Find trips with same origin and destination, excluding current trip
  return mockTrips
    .filter(
      (trip) =>
        trip.id !== currentTripId &&
        trip.origin === origin &&
        trip.destination === destination &&
        new Date(trip.date) >= new Date(date),
    )
    .slice(0, 3)
}
