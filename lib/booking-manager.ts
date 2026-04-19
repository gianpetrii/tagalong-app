import { 
  doc, 
  addDoc, 
  collection, 
  serverTimestamp, 
  getDoc, 
  query, 
  where, 
  getDocs,
  updateDoc 
} from "firebase/firestore"
import { db } from "./firebase"
import { Booking, BookingStatus, Trip } from "./types"
import { TripStateManager } from "./trip-state-manager"

/**
 * Servicio para gestionar reservas
 */
export class BookingManager {
  
  /**
   * Crea una nueva reserva
   */
  static async createBooking(
    tripId: string,
    userId: string,
    seats: number,
    message: string,
    userInfo: { name: string; avatar: string | null; phone?: string; rating: number },
    specialRequest?: {
      address: string
      coordinates: { lat: number; lng: number }
      extraFee: number
    }
  ): Promise<string> {
    try {
      // Verificar que el viaje existe y está disponible
      const tripDoc = await getDoc(doc(db, "trips", tripId))
      if (!tripDoc.exists()) {
        throw new Error("Viaje no encontrado")
      }

      const trip = tripDoc.data() as Trip
      if (!["published", "confirmed"].includes(trip.status)) {
        throw new Error("Este viaje ya no acepta reservas")
      }

      // Verificar disponibilidad de asientos
      const confirmedBookingsQuery = query(
        collection(db, "bookings"),
        where("tripId", "==", tripId),
        where("status", "==", "confirmed")
      )
      const confirmedBookings = await getDocs(confirmedBookingsQuery)
      const totalSeatsBooked = confirmedBookings.docs
        .map(doc => doc.data().seats)
        .reduce((sum, seats) => sum + seats, 0)

      if (totalSeatsBooked + seats > trip.availableSeats) {
        throw new Error("No hay suficientes asientos disponibles")
      }

      // Calcular el precio total
      let totalAmount = trip.price * seats
      if (specialRequest) {
        totalAmount += specialRequest.extraFee
      }

      // Crear la reserva
      const bookingData: Omit<Booking, "id"> = {
        tripId,
        userId,
        seats,
        message,
        totalAmount,
        status: "pending",
        hasSpecialRequest: !!specialRequest,
        pickupLocation: specialRequest,
        createdAt: serverTimestamp(),
        deadlineForConfirmation: this.calculateConfirmationDeadline(trip),
        passengerInfo: userInfo,
        paymentStatus: "pending"
      }

      const docRef = await addDoc(collection(db, "bookings"), bookingData)
      
      // Actualizar contador de reservas del viaje
      await this.updateTripBookingCounts(tripId)

      return docRef.id
    } catch (error) {
      console.error("Error creando reserva:", error)
      throw error
    }
  }

  /**
   * Obtiene todas las reservas de un viaje
   */
  static async getTripBookings(tripId: string): Promise<Booking[]> {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("tripId", "==", tripId)
      )
      
      const snapshot = await getDocs(bookingsQuery)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booking))
    } catch (error) {
      console.error("Error obteniendo reservas:", error)
      return []
    }
  }

  /**
   * Obtiene todas las reservas de un usuario
   */
  static async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", userId)
      )
      
      const snapshot = await getDocs(bookingsQuery)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booking))
    } catch (error) {
      console.error("Error obteniendo reservas del usuario:", error)
      return []
    }
  }

  /**
   * Confirma una reserva (acción del conductor)
   */
  static async confirmBooking(bookingId: string, driverId: string): Promise<boolean> {
    return await TripStateManager.changeBookingStatus(
      bookingId, 
      "confirmed", 
      driverId, 
      "Confirmada por el conductor"
    )
  }

  /**
   * Rechaza una reserva (acción del conductor)
   */
  static async rejectBooking(bookingId: string, driverId: string, reason?: string): Promise<boolean> {
    return await TripStateManager.changeBookingStatus(
      bookingId, 
      "rejected", 
      driverId, 
      reason || "Rechazada por el conductor"
    )
  }

  /**
   * Cancela una reserva (acción del pasajero)
   */
  static async cancelBooking(bookingId: string, userId: string, reason?: string): Promise<boolean> {
    const success = await TripStateManager.changeBookingStatus(
      bookingId, 
      "canceled_by_passenger", 
      userId, 
      reason || "Cancelada por el pasajero"
    )

    if (success) {
      // Actualizar contadores del viaje
      const bookingDoc = await getDoc(doc(db, "bookings", bookingId))
      if (bookingDoc.exists()) {
        const booking = bookingDoc.data() as Booking
        await this.updateTripBookingCounts(booking.tripId)
      }
    }

    return success
  }

  /**
   * Procesa reservas expiradas automáticamente
   */
  static async processExpiredBookings(): Promise<void> {
    try {
      const now = new Date()
      const expiredBookingsQuery = query(
        collection(db, "bookings"),
        where("status", "==", "pending"),
        where("deadlineForConfirmation", "<=", now)
      )

      const snapshot = await getDocs(expiredBookingsQuery)
      
      for (const doc of snapshot.docs) {
        await TripStateManager.changeBookingStatus(
          doc.id,
          "rejected",
          "system",
          "Expirada por falta de confirmación"
        )
      }
    } catch (error) {
      console.error("Error procesando reservas expiradas:", error)
    }
  }

  /**
   * Calcula la fecha límite para confirmación
   */
  private static calculateConfirmationDeadline(trip: Trip): Date {
    if (!trip.requiresConfirmation) {
      // Si no requiere confirmación, dar 12 horas
      return new Date(Date.now() + (12 * 60 * 60 * 1000))
    }

    const tripDateTime = new Date(`${trip.date}T${trip.departureTime}`)
    const deadline = new Date(tripDateTime.getTime() - (12 * 60 * 60 * 1000)) // 12h antes
    
    // Mínimo 2 horas desde ahora
    const minimumDeadline = new Date(Date.now() + (2 * 60 * 60 * 1000))
    
    return deadline > minimumDeadline ? deadline : minimumDeadline
  }

  /**
   * Actualiza los contadores de reservas del viaje
   */
  private static async updateTripBookingCounts(tripId: string): Promise<void> {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("tripId", "==", tripId)
      )
      
      const snapshot = await getDocs(bookingsQuery)
      const bookings = snapshot.docs.map(doc => doc.data() as Booking)
      
      const totalBookings = bookings.length
      const confirmedBookings = bookings.filter(b => b.status === "confirmed").length
      
      await updateDoc(doc(db, "trips", tripId), {
        totalBookings,
        confirmedBookings
      })
    } catch (error) {
      console.error("Error actualizando contadores:", error)
    }
  }
}

/**
 * Hook para usar en componentes React
 */
export function useBookingManager() {
  const createBooking = async (
    tripId: string,
    userId: string,
    seats: number,
    message: string,
    userInfo: { name: string; avatar: string | null; phone?: string; rating: number },
    specialRequest?: {
      address: string
      coordinates: { lat: number; lng: number }
      extraFee: number
    }
  ) => {
    return await BookingManager.createBooking(tripId, userId, seats, message, userInfo, specialRequest)
  }

  const confirmBooking = async (bookingId: string, driverId: string) => {
    return await BookingManager.confirmBooking(bookingId, driverId)
  }

  const rejectBooking = async (bookingId: string, driverId: string, reason?: string) => {
    return await BookingManager.rejectBooking(bookingId, driverId, reason)
  }

  const cancelBooking = async (bookingId: string, userId: string, reason?: string) => {
    return await BookingManager.cancelBooking(bookingId, userId, reason)
  }

  return {
    createBooking,
    confirmBooking,
    rejectBooking,
    cancelBooking,
    getTripBookings: BookingManager.getTripBookings,
    getUserBookings: BookingManager.getUserBookings
  }
} 