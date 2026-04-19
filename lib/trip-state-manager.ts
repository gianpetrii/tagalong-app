import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp, 
  getDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch
} from "firebase/firestore"
import { db } from "./firebase"
import { 
  Trip, 
  Booking, 
  TripStatus, 
  BookingStatus, 
  StateTransition, 
  CancellationPolicy 
} from "./types"

// Políticas de cancelación por defecto
export const DEFAULT_CANCELLATION_POLICY: CancellationPolicy = {
  allowCancellation: true,
  freeUntilHours: 24,
  penaltyPercentage: 0,
  refundPercentage: 100
}

export const STRICT_CANCELLATION_POLICY: CancellationPolicy = {
  allowCancellation: true,
  freeUntilHours: 48,
  penaltyPercentage: 20,
  refundPercentage: 80
}

// Validaciones de transiciones de estado para viajes
const VALID_TRIP_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  draft: ["published", "canceled"],
  published: ["confirmed", "canceled", "expired"],
  confirmed: ["in_progress", "canceled"],
  in_progress: ["completed", "canceled"],
  completed: [],
  canceled: [],
  expired: []
}

// Validaciones de transiciones de estado para reservas
const VALID_BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "rejected", "canceled_by_passenger"],
  confirmed: ["completed", "canceled_by_passenger", "canceled_by_driver", "no_show"],
  rejected: [],
  canceled_by_passenger: [],
  canceled_by_driver: [],
  completed: [],
  no_show: []
}

/**
 * Clase principal para gestionar estados de viajes
 */
export class TripStateManager {
  
  /**
   * Cambia el estado de un viaje con validaciones
   */
  static async changeTripStatus(
    tripId: string,
    newStatus: TripStatus,
    triggeredBy: string,
    reason?: string,
    automaticAction = false
  ): Promise<boolean> {
    try {
      const tripRef = doc(db, "trips", tripId)
      const tripDoc = await getDoc(tripRef)
      
      if (!tripDoc.exists()) {
        throw new Error("Viaje no encontrado")
      }

      const tripData = tripDoc.data() as Trip
      const currentStatus = tripData.status

      // Validar transición
      if (!this.isValidTripTransition(currentStatus, newStatus)) {
        throw new Error(`Transición inválida de ${currentStatus} a ${newStatus}`)
      }

      // Crear registro de transición
      const transition: StateTransition = {
        from: currentStatus,
        to: newStatus,
        timestamp: serverTimestamp(),
        triggeredBy,
        reason,
        automaticAction
      }

      // Actualizar viaje
      const updateData: any = {
        status: newStatus,
        statusHistory: arrayUnion(transition),
        lastStateChange: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Lógica específica por estado
      switch (newStatus) {
        case "published":
          updateData.publishedAt = serverTimestamp()
          updateData.confirmationDeadline = this.calculateConfirmationDeadline(tripData)
          break
        
        case "confirmed":
          // Actualizar contador de reservas confirmadas
          const confirmedBookings = await this.getConfirmedBookingsCount(tripId)
          updateData.confirmedBookings = confirmedBookings
          break
        
        case "in_progress":
          // Marcar inicio del viaje
          break
        
        case "completed":
          // Proceso de finalización del viaje
          await this.completeTrip(tripId)
          break
        
        case "canceled":
          // Procesar cancelaciones de todas las reservas
          await this.cancelAllBookings(tripId, triggeredBy, reason || "Viaje cancelado por el conductor")
          break
      }

      await updateDoc(tripRef, updateData)

      // Procesar acciones automáticas post-cambio
      await this.processPostStateChangeActions(tripId, newStatus, tripData)

      return true
    } catch (error) {
      console.error("Error cambiando estado del viaje:", error)
      return false
    }
  }

  /**
   * Cambia el estado de una reserva
   */
  static async changeBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    triggeredBy: string,
    reason?: string
  ): Promise<boolean> {
    try {
      const bookingRef = doc(db, "bookings", bookingId)
      const bookingDoc = await getDoc(bookingRef)
      
      if (!bookingDoc.exists()) {
        throw new Error("Reserva no encontrada")
      }

      const bookingData = bookingDoc.data() as Booking
      const currentStatus = bookingData.status

      // Validar transición
      if (!this.isValidBookingTransition(currentStatus, newStatus)) {
        throw new Error(`Transición inválida de ${currentStatus} a ${newStatus}`)
      }

      // Crear registro de transición
      const transition: StateTransition = {
        from: currentStatus,
        to: newStatus,
        timestamp: serverTimestamp(),
        triggeredBy,
        reason
      }

      const updateData: any = {
        status: newStatus,
        statusHistory: arrayUnion(transition)
      }

      // Lógica específica por estado
      switch (newStatus) {
        case "confirmed":
          updateData.confirmedAt = serverTimestamp()
          // Actualizar estado del viaje si es la primera confirmación
          await this.checkAndUpdateTripStatusOnBookingConfirm(bookingData.tripId)
          break
        
        case "canceled_by_passenger":
        case "canceled_by_driver":
          updateData.canceledAt = serverTimestamp()
          await this.processCancellation(bookingData, triggeredBy, reason)
          break
      }

      await updateDoc(bookingRef, updateData)
      return true
    } catch (error) {
      console.error("Error cambiando estado de la reserva:", error)
      return false
    }
  }

  /**
   * Procesa expiración automática de viajes
   */
  static async processExpiredTrips(): Promise<void> {
    try {
      const now = new Date()
      const tripsQuery = query(
        collection(db, "trips"),
        where("status", "==", "published"),
        where("confirmationDeadline", "<=", now)
      )

      const snapshot = await getDocs(tripsQuery)
      const batch = writeBatch(db)

      for (const doc of snapshot.docs) {
        batch.update(doc.ref, {
          status: "expired",
          statusHistory: arrayUnion({
            from: "published",
            to: "expired",
            timestamp: serverTimestamp(),
            triggeredBy: "system",
            automaticAction: true,
            reason: "Expirado por falta de confirmación"
          })
        })
      }

      await batch.commit()
    } catch (error) {
      console.error("Error procesando viajes expirados:", error)
    }
  }

  /**
   * Obtiene estadísticas de estado de un viaje
   */
  static async getTripStateStats(tripId: string) {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("tripId", "==", tripId)
      )

      const snapshot = await getDocs(bookingsQuery)
      const bookings = snapshot.docs.map(doc => doc.data() as Booking)

      return {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === "pending").length,
        confirmedBookings: bookings.filter(b => b.status === "confirmed").length,
        canceledBookings: bookings.filter(b => 
          b.status === "canceled_by_passenger" || b.status === "canceled_by_driver"
        ).length,
        totalSeatsBooked: bookings
          .filter(b => b.status === "confirmed")
          .reduce((sum, b) => sum + b.seats, 0)
      }
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error)
      return null
    }
  }

  // Métodos auxiliares privados
  private static isValidTripTransition(from: TripStatus, to: TripStatus): boolean {
    return VALID_TRIP_TRANSITIONS[from]?.includes(to) || false
  }

  private static isValidBookingTransition(from: BookingStatus, to: BookingStatus): boolean {
    return VALID_BOOKING_TRANSITIONS[from]?.includes(to) || false
  }

  private static calculateConfirmationDeadline(trip: Trip): Date {
    const tripDateTime = new Date(`${trip.date}T${trip.departureTime}`)
    const deadline = new Date(tripDateTime.getTime() - (1 * 60 * 60 * 1000)) // 1h antes
    return deadline
  }

  private static async getConfirmedBookingsCount(tripId: string): Promise<number> {
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("tripId", "==", tripId),
      where("status", "==", "confirmed")
    )
    const snapshot = await getDocs(bookingsQuery)
    return snapshot.size
  }

  private static async cancelAllBookings(tripId: string, triggeredBy: string, reason: string): Promise<void> {
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("tripId", "==", tripId),
      where("status", "in", ["pending", "confirmed"])
    )

    const snapshot = await getDocs(bookingsQuery)
    const batch = writeBatch(db)

    for (const doc of snapshot.docs) {
      batch.update(doc.ref, {
        status: "canceled_by_driver",
        canceledAt: serverTimestamp(),
        statusHistory: arrayUnion({
          from: doc.data().status,
          to: "canceled_by_driver",
          timestamp: serverTimestamp(),
          triggeredBy,
          reason
        })
      })
    }

    await batch.commit()
  }

  private static async checkAndUpdateTripStatusOnBookingConfirm(tripId: string): Promise<void> {
    const tripRef = doc(db, "trips", tripId)
    const tripDoc = await getDoc(tripRef)
    
    if (tripDoc.exists()) {
      const tripData = tripDoc.data() as Trip
      if (tripData.status === "published") {
        await this.changeTripStatus(tripId, "confirmed", "system", "Primera reserva confirmada", true)
      }
    }
  }

  private static async completeTrip(tripId: string): Promise<void> {
    // Marcar todas las reservas confirmadas como completadas
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("tripId", "==", tripId),
      where("status", "==", "confirmed")
    )

    const snapshot = await getDocs(bookingsQuery)
    const batch = writeBatch(db)

    for (const doc of snapshot.docs) {
      batch.update(doc.ref, {
        status: "completed",
        statusHistory: arrayUnion({
          from: "confirmed",
          to: "completed",
          timestamp: serverTimestamp(),
          triggeredBy: "system",
          automaticAction: true
        })
      })
    }

    await batch.commit()
  }

  private static async processCancellation(booking: Booking, triggeredBy: string, reason?: string): Promise<void> {
    // Aquí iría la lógica de reembolsos según la política de cancelación
    // Por ahora solo registramos la cancelación
    console.log(`Procesando cancelación de reserva ${booking.id}`)
  }

  private static async processPostStateChangeActions(tripId: string, newStatus: TripStatus, tripData: Trip): Promise<void> {
    // Aquí irían las notificaciones y otras acciones automáticas
    console.log(`Post-acción para viaje ${tripId} con nuevo estado: ${newStatus}`)
  }
}

/**
 * Hook para usar en componentes React
 */
export function useTripStateManager() {
  const changeTripStatus = async (
    tripId: string,
    newStatus: TripStatus,
    userId: string,
    reason?: string
  ) => {
    return await TripStateManager.changeTripStatus(tripId, newStatus, userId, reason)
  }

  const changeBookingStatus = async (
    bookingId: string,
    newStatus: BookingStatus,
    userId: string,
    reason?: string
  ) => {
    return await TripStateManager.changeBookingStatus(bookingId, newStatus, userId, reason)
  }

  return {
    changeTripStatus,
    changeBookingStatus,
    getTripStateStats: TripStateManager.getTripStateStats
  }
} 