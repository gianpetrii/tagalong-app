import type { Trip, User, Review, UserStats, Driver } from "./types"
import { db } from "./firebase"
import { collection, doc, getDocs, getDoc, addDoc, query, where, limit, serverTimestamp, orderBy } from "firebase/firestore"

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
    carBrand: "Toyota",
    carModel: "Corolla",
    carYear: "2020",
    carPlate: "ABC123",
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
    carBrand: "Volkswagen",
    carModel: "Golf",
    carYear: "2019",
    carPlate: "XYZ789",
    meetingPoint: "Estación de servicio YPF (Av. Libertador)",
    dropOffPoint: "Plaza 25 de Mayo",
    driver: {
      id: "102",
      name: "Laura Fernández",
      avatar: "/placeholder.svg?height=64&width=64",
      rating: 4.9,
      reviewCount: 42,
      memberSince: "Marzo 2023",
      bio: "Profesional que viaja por trabajo. Disfruto de conversaciones interesantes y compartir experiencias.",
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
    carBrand: "Ford",
    carModel: "Ecosport",
    carYear: "2021",
    carPlate: "DEF456",
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
    about: "Viajo regularmente entre Buenos Aires y Mar del Plata por trabajo. Me gusta la música y las charlas amenas durante el viaje.",
    carInfo: {
      brand: "Toyota",
      model: "Corolla",
      year: "2020",
      plate: "ABC123",
      isActive: true
    }
  },
  {
    id: "102",
    name: "Laura Fernández",
    email: "laura@example.com",
    avatar: "/placeholder.svg?height=128&width=128",
    rating: 4.9,
    reviewCount: 42,
    memberSince: "Marzo 2023",
    about: "Profesional que viaja por trabajo. Disfruto de conversaciones interesantes y compartir experiencias.",
    carInfo: {
      brand: "Volkswagen",
      model: "Golf",
      year: "2019",
      plate: "XYZ789",
      isActive: true
    }
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
  try {
    // Check for the "nuevo-viaje-creado" special case
    if (id === "nuevo-viaje-creado") {
      return {
        id: "nuevo-viaje-creado",
        origin: "Origen",
        destination: "Destino",
        date: new Date().toISOString().split('T')[0],
        departureTime: "09:00",
        arrivalTime: "12:00",
        duration: "3h 00m",
        price: 0,
        availableSeats: 0,
        carBrand: "N/A",
        carModel: "N/A",
        carYear: "N/A",
        carPlate: "N/A",
        meetingPoint: "N/A",
        dropOffPoint: "N/A",
        driver: {
          id: "system",
          name: "Sistema",
          avatar: null,
          rating: 5,
          reviewCount: 0,
          memberSince: new Date().toLocaleDateString("es-AR", { month: 'long', year: 'numeric' }),
          preferences: [],
        },
      };
    }

    // Try to get from Firestore
    const tripDoc = await getDoc(doc(db, "trips", id));
    
    if (tripDoc.exists()) {
      const tripData = tripDoc.data();
      return {
        id: tripDoc.id,
        ...tripData,
      } as Trip;
    }

    // Fall back to mock data if not found
    const trip = mockTrips.find((trip) => trip.id === id)
    return trip || null
  } catch (error) {
    console.error("Error fetching trip:", error);
    // Fall back to mock data in case of error
    const trip = mockTrips.find((trip) => trip.id === id)
    return trip || null
  }
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
  try {
    // Build query for Firestore
    let tripsQuery = query(collection(db, "trips"));
    
    // Apply filters
    if (origin) {
      tripsQuery = query(tripsQuery, where("origin", "==", origin));
    }
    
    if (destination) {
      tripsQuery = query(tripsQuery, where("destination", "==", destination));
    }
    
    if (date) {
      tripsQuery = query(tripsQuery, where("date", "==", date));
    }
    
    // Execute query
    const querySnapshot = await getDocs(tripsQuery);
    
    if (!querySnapshot.empty) {
      // Get trips from Firestore
      let trips: Trip[] = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        } as Trip;
      });
      
      // Apply client-side filters for complex queries
      if (minPrice !== undefined) {
        trips = trips.filter((trip) => trip.price >= minPrice);
      }
      
      if (maxPrice !== undefined) {
        trips = trips.filter((trip) => trip.price <= maxPrice);
      }
      
      if (minDepartureTime) {
        trips = trips.filter((trip) => trip.departureTime >= minDepartureTime);
      }
      
      if (maxDepartureTime) {
        trips = trips.filter((trip) => trip.departureTime <= maxDepartureTime);
      }
      
      if (minRating !== undefined) {
        trips = trips.filter((trip) => trip.driver.rating >= minRating);
      }
      
      // Sort results
      switch (sortBy) {
        case "price-asc":
          trips.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          trips.sort((a, b) => b.price - a.price)
          break
        case "departure-time":
          trips.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
          break
        case "rating":
          trips.sort((a, b) => b.driver.rating - a.driver.rating)
          break
        case "recommended":
        default:
          // For recommended, use a combination of price and rating
          trips.sort((a, b) => {
            const ratingDiff = b.driver.rating - a.driver.rating
            const priceDiff = a.price - b.price
            return ratingDiff * 2 + priceDiff * 0.5
          })
      }
      
      return trips;
    }
    
    // Fall back to mock data if no results from Firestore
    return mockTrips.filter((trip) => {
      let isMatch = true

      if (origin && !trip.origin.toLowerCase().includes(origin.toLowerCase())) {
        isMatch = false
      }

      if (destination && !trip.destination.toLowerCase().includes(destination.toLowerCase())) {
        isMatch = false
      }

      if (date && trip.date !== date) {
        isMatch = false
      }

      if (minPrice !== undefined && trip.price < minPrice) {
        isMatch = false
      }

      if (maxPrice !== undefined && trip.price > maxPrice) {
        isMatch = false
      }

      if (minDepartureTime && trip.departureTime < minDepartureTime) {
        isMatch = false
      }

      if (maxDepartureTime && trip.departureTime > maxDepartureTime) {
        isMatch = false
      }

      if (minRating !== undefined && trip.driver.rating < minRating) {
        isMatch = false
      }

      return isMatch
    }).sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "departure-time":
          return a.departureTime.localeCompare(b.departureTime)
        case "rating":
          return b.driver.rating - a.driver.rating
        case "recommended":
        default:
          // For recommended, use a combination of price and rating
          const ratingDiff = b.driver.rating - a.driver.rating
          const priceDiff = a.price - b.price
          return ratingDiff * 2 + priceDiff * 0.5
      }
    })
  } catch (error) {
    console.error("Error searching trips:", error);
    // Fall back to mock data in case of error
    return mockTrips;
  }
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

// Función para obtener usuarios populares para pre-renderizar perfiles
export async function getPopularUsers(): Promise<string[]> {
  // En un entorno real, esto obtendría los IDs de los usuarios más populares de la base de datos
  // Por ahora, devolvemos algunos IDs de ejemplo
  return ['user1', 'user2', 'user3', 'user4', 'user5'];
}

// Función para obtener viajes populares para pre-renderizar páginas de viaje
export async function getPopularTrips(): Promise<string[]> {
  // En un entorno real, esto obtendría los IDs de los viajes más populares de la base de datos
  // Por ahora, devolvemos los IDs de los viajes de ejemplo
  return mockTrips.map(trip => trip.id);
}

export async function saveTrip(tripData: Omit<Trip, 'id'>): Promise<string> {
  const tripRef = await addDoc(collection(db, "trips"), {
    ...tripData,
    createdAt: serverTimestamp(),
  });
  
  return tripRef.id;
}

export const sampleTrips: Trip[] = [
  {
    id: "1",
    origin: "Buenos Aires",
    destination: "Mar del Plata",
    date: "2024-03-15",
    departureTime: "08:00",
    arrivalTime: "12:00",
    duration: "4h 00m",
    price: 2500,
    availableSeats: 3,
    carBrand: "Toyota",
    carModel: "Corolla",
    carYear: "2020",
    carPlate: "ABC123",
    meetingPoint: "Plaza Italia",
    dropOffPoint: "Centro Comercial",
    driver: {
      id: "1",
      name: "Juan Pérez",
      avatar: null,
      rating: 4.8,
      reviewCount: 45,
      memberSince: "2023-01-15",
      bio: "Conductor experimentado",
      preferences: ["Música", "Aire acondicionado"]
    },
    stops: [
      { location: "La Plata", time: "09:30" }
    ],
    features: ["Aire acondicionado", "Música", "Equipaje grande"],
    notes: "Viaje directo con una parada en La Plata"
  },
  {
    id: "2",
    origin: "Córdoba",
    destination: "Rosario",
    date: "2024-03-16",
    departureTime: "10:00",
    arrivalTime: "14:00",
    duration: "4h 00m",
    price: 2000,
    availableSeats: 2,
    carBrand: "Volkswagen",
    carModel: "Golf",
    carYear: "2019",
    carPlate: "XYZ789",
    meetingPoint: "Terminal de Ómnibus",
    dropOffPoint: "Centro",
    driver: {
      id: "2",
      name: "María García",
      avatar: null,
      rating: 4.9,
      reviewCount: 32,
      memberSince: "2023-02-20",
      bio: "Conductora profesional",
      preferences: ["Silencio", "Aire acondicionado"]
    },
    features: ["Aire acondicionado", "Mascotas permitidas"],
    notes: "Viaje directo sin paradas"
  },
  {
    id: "3",
    origin: "Mendoza",
    destination: "San Juan",
    date: "2024-03-17",
    departureTime: "09:00",
    arrivalTime: "11:30",
    duration: "2h 30m",
    price: 1500,
    availableSeats: 4,
    carBrand: "Renault",
    carModel: "Sandero",
    carYear: "2021",
    carPlate: "DEF456",
    meetingPoint: "Plaza Independencia",
    dropOffPoint: "Terminal",
    driver: {
      id: "3",
      name: "Carlos López",
      avatar: null,
      rating: 4.7,
      reviewCount: 28,
      memberSince: "2023-03-10",
      bio: "Conductor de confianza",
      preferences: ["Música", "Conversación"]
    },
    features: ["Música", "Fumar permitido"],
    notes: "Viaje directo"
  }
]

export const sampleUsers: User[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    avatar: null,
    rating: 4.8,
    reviewCount: 45,
    memberSince: "2023-01-15",
    phone: "+54 11 1234-5678",
    about: "Conductor experimentado",
    carInfo: {
      brand: "Toyota",
      model: "Corolla",
      year: "2020",
      plate: "ABC123",
      isActive: true
    }
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    avatar: null,
    rating: 4.9,
    reviewCount: 32,
    memberSince: "2023-02-20",
    phone: "+54 11 8765-4321",
    about: "Conductora profesional",
    carInfo: {
      brand: "Volkswagen",
      model: "Golf",
      year: "2019",
      plate: "XYZ789",
      isActive: true
    }
  }
]

export async function getTrips({ origin, destination, date }: { origin: string; destination: string; date: string }) {
  try {
    const tripsRef = collection(db, "trips")
    const q = query(
      tripsRef,
      where("origin", "==", origin),
      where("destination", "==", destination),
      where("date", "==", date)
    )
    const querySnapshot = await getDocs(q)
    
    // Obtener todos los viajes
    const trips = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const tripData = docSnapshot.data()
        
        // Obtener la información del conductor
        if (tripData.driverId) {
          const userRef = doc(db, "users", tripData.driverId)
          const userSnapshot = await getDoc(userRef)
          const driverData = userSnapshot.exists() ? userSnapshot.data() : null
          
          return {
            id: docSnapshot.id,
            ...tripData,
            driver: driverData ? {
              id: tripData.driverId,
              name: driverData.name || "Conductor",
              avatar: driverData.avatar,
              rating: driverData.rating || 0,
              reviewCount: driverData.reviewCount || 0,
              memberSince: driverData.memberSince || ""
            } : null
          }
        }
        
        return {
          id: docSnapshot.id,
          ...tripData,
          driver: null
        }
      })
    )
    
    return trips
  } catch (error) {
    console.error("Error fetching trips:", error)
    return []
  }
}

export async function getRecentTrips(): Promise<any[]> {
  try {
    const tripsRef = collection(db, "trips")
    const q = query(
      tripsRef,
      orderBy("createdAt", "desc"),
      limit(10)
    )
    const querySnapshot = await getDocs(q)
    
    // Obtener todos los viajes
    const trips = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const tripData = docSnapshot.data()
        
        // Obtener la información del conductor
        if (tripData.driverId) {
          const userRef = doc(db, "users", tripData.driverId)
          const userSnapshot = await getDoc(userRef)
          const driverData = userSnapshot.exists() ? userSnapshot.data() : null
          
          return {
            id: docSnapshot.id,
            ...tripData,
            driver: driverData ? {
              id: tripData.driverId,
              name: driverData.name || "Conductor",
              avatar: driverData.avatar,
              rating: driverData.rating || 0,
              reviewCount: driverData.reviewCount || 0,
              memberSince: driverData.memberSince || ""
            } : null
          }
        }
        
        return {
          id: docSnapshot.id,
          ...tripData,
          driver: null
        }
      })
    )
    
    return trips
  } catch (error) {
    console.error("Error fetching recent trips:", error)
    return []
  }
}
