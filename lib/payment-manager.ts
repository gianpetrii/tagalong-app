import { 
  doc, 
  addDoc, 
  collection, 
  serverTimestamp, 
  getDoc, 
  updateDoc,
  query,
  where,
  getDocs 
} from "firebase/firestore"
import { db } from "./firebase"
import { Payment, PaymentMethod, PaymentStatus, Booking } from "./types"

/**
 * Servicio para gestionar pagos con MercadoPago
 */
export class PaymentManager {
  
  /**
   * Crea una preferencia de pago en MercadoPago
   */
  static async createPaymentPreference(
    bookingId: string,
    amount: number,
    description: string,
    payerEmail: string,
    payerName?: string
  ): Promise<string> {
    try {
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount,
          description,
          payerEmail,
          payerName
        })
      })

      if (!response.ok) {
        throw new Error('Error al crear preferencia de pago')
      }

      const data = await response.json()
      return data.preferenceId
    } catch (error) {
      console.error('Error creando preferencia de pago:', error)
      throw error
    }
  }

  /**
   * Crea un registro de pago en Firestore
   */
  static async createPayment(
    bookingId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    currency: "ARS" | "USD" = "ARS",
    description: string,
    externalReference: string,
    payerInfo?: {
      email: string
      identification?: { type: string; number: string }
      phone?: { area_code: string; number: string }
    }
  ): Promise<string> {
    try {
      const paymentData: Omit<Payment, "id"> = {
        bookingId,
        amount,
        paymentMethod,
        status: "pending",
        currency,
        description,
        externalReference,
        createdAt: serverTimestamp(),
        payerInfo
      }

      const docRef = await addDoc(collection(db, "payments"), paymentData)
      return docRef.id
    } catch (error) {
      console.error("Error creando pago:", error)
      throw error
    }
  }

  /**
   * Actualiza el estado de un pago
   */
  static async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    mercadoPagoPaymentId?: string,
    mercadoPagoCollectorId?: number
  ): Promise<void> {
    try {
      const paymentRef = doc(db, "payments", paymentId)
      const updateData: any = {
        status,
        [`${status}At`]: serverTimestamp()
      }

      if (mercadoPagoPaymentId) {
        updateData.mercadoPagoPaymentId = mercadoPagoPaymentId
      }

      if (mercadoPagoCollectorId) {
        updateData.mercadoPagoCollectorId = mercadoPagoCollectorId
      }

      await updateDoc(paymentRef, updateData)

      // Si el pago fue aprobado, actualizar la reserva
      if (status === "approved") {
        await this.updateBookingPaymentStatus(paymentId, "paid")
      } else if (status === "rejected" || status === "cancelled") {
        await this.updateBookingPaymentStatus(paymentId, "failed")
      }
    } catch (error) {
      console.error("Error actualizando estado de pago:", error)
      throw error
    }
  }

  /**
   * Actualiza el estado de pago de una reserva
   */
  private static async updateBookingPaymentStatus(
    paymentId: string,
    paymentStatus: "pending" | "paid" | "refunded" | "failed"
  ): Promise<void> {
    try {
      // Buscar la reserva asociada al pago
      const paymentDoc = await getDoc(doc(db, "payments", paymentId))
      if (!paymentDoc.exists()) {
        throw new Error("Pago no encontrado")
      }

      const payment = paymentDoc.data() as Payment
      const bookingRef = doc(db, "bookings", payment.bookingId)
      
      await updateDoc(bookingRef, {
        paymentStatus,
        ...(paymentStatus === "paid" && { mercadoPagoPaymentId: payment.mercadoPagoPaymentId })
      })
    } catch (error) {
      console.error("Error actualizando estado de pago de reserva:", error)
      throw error
    }
  }

  /**
   * Procesa un reembolso
   */
  static async processRefund(
    paymentId: string,
    refundAmount: number,
    reason: string
  ): Promise<void> {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          refundAmount,
          reason
        })
      })

      if (!response.ok) {
        throw new Error('Error al procesar reembolso')
      }

      // Actualizar el pago en Firestore
      const paymentRef = doc(db, "payments", paymentId)
      await updateDoc(paymentRef, {
        status: "refunded",
        refundAmount,
        refundReason: reason,
        refundedAt: serverTimestamp()
      })

      // Actualizar la reserva
      await this.updateBookingPaymentStatus(paymentId, "refunded")
    } catch (error) {
      console.error("Error procesando reembolso:", error)
      throw error
    }
  }

  /**
   * Obtiene el historial de pagos de un usuario
   */
  static async getUserPayments(userId: string): Promise<Payment[]> {
    try {
      // Primero obtener las reservas del usuario
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", userId)
      )
      const bookingsSnapshot = await getDocs(bookingsQuery)
      const bookingIds = bookingsSnapshot.docs.map(doc => doc.id)

      if (bookingIds.length === 0) {
        return []
      }

      // Luego obtener los pagos de esas reservas
      const paymentsPromises = bookingIds.map(async (bookingId) => {
        const paymentsQuery = query(
          collection(db, "payments"),
          where("bookingId", "==", bookingId)
        )
        const paymentsSnapshot = await getDocs(paymentsQuery)
        return paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Payment))
      })

      const paymentsArrays = await Promise.all(paymentsPromises)
      return paymentsArrays.flat()
    } catch (error) {
      console.error("Error obteniendo pagos del usuario:", error)
      return []
    }
  }

  /**
   * Obtiene los pagos de un viaje específico
   */
  static async getTripPayments(tripId: string): Promise<Payment[]> {
    try {
      // Obtener todas las reservas del viaje
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("tripId", "==", tripId)
      )
      const bookingsSnapshot = await getDocs(bookingsQuery)
      const bookingIds = bookingsSnapshot.docs.map(doc => doc.id)

      if (bookingIds.length === 0) {
        return []
      }

      // Obtener los pagos de todas las reservas
      const paymentsPromises = bookingIds.map(async (bookingId) => {
        const paymentsQuery = query(
          collection(db, "payments"),
          where("bookingId", "==", bookingId)
        )
        const paymentsSnapshot = await getDocs(paymentsQuery)
        return paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Payment))
      })

      const paymentsArrays = await Promise.all(paymentsPromises)
      return paymentsArrays.flat()
    } catch (error) {
      console.error("Error obteniendo pagos del viaje:", error)
      return []
    }
  }

  /**
   * Calcula las comisiones y montos netos
   */
  static calculateCommissions(amount: number, commissionRate: number = 0.1): {
    grossAmount: number
    commission: number
    netAmount: number
    mercadoPagoFee: number
    finalAmount: number
  } {
    const grossAmount = amount
    const commission = grossAmount * commissionRate
    const netAmount = grossAmount - commission
    
    // MercadoPago cobra aproximadamente 5.99% + $2.99 por transacción
    const mercadoPagoFee = (grossAmount * 0.0599) + 2.99
    const finalAmount = netAmount - mercadoPagoFee

    return {
      grossAmount,
      commission,
      netAmount,
      mercadoPagoFee,
      finalAmount
    }
  }
}

/**
 * Hook para usar en componentes React
 */
export function usePaymentManager() {
  const createPaymentPreference = async (
    bookingId: string,
    amount: number,
    description: string,
    payerEmail: string,
    payerName?: string
  ) => {
    return await PaymentManager.createPaymentPreference(
      bookingId, amount, description, payerEmail, payerName
    )
  }

  const createPayment = async (
    bookingId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    currency: "ARS" | "USD" = "ARS",
    description: string,
    externalReference: string,
    payerInfo?: {
      email: string
      identification?: { type: string; number: string }
      phone?: { area_code: string; number: string }
    }
  ) => {
    return await PaymentManager.createPayment(
      bookingId, amount, paymentMethod, currency, description, externalReference, payerInfo
    )
  }

  const processRefund = async (
    paymentId: string,
    refundAmount: number,
    reason: string
  ) => {
    return await PaymentManager.processRefund(paymentId, refundAmount, reason)
  }

  return {
    createPaymentPreference,
    createPayment,
    processRefund,
    getUserPayments: PaymentManager.getUserPayments,
    getTripPayments: PaymentManager.getTripPayments,
    calculateCommissions: PaymentManager.calculateCommissions
  }
} 