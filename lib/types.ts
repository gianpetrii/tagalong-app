// Estados de viaje con flujo completo
export type TripStatus = 
  | "draft"           // Borrador, no publicado aún
  | "published"       // Publicado, esperando reservas
  | "confirmed"       // Al menos una reserva confirmada
  | "in_progress"     // Viaje en curso
  | "completed"       // Viaje completado exitosamente
  | "canceled"        // Cancelado por conductor
  | "expired"         // Expirado (pasó la fecha sin confirmar)

// Estados de reserva individual
export type BookingStatus = 
  | "pending"         // Esperando confirmación del conductor
  | "confirmed"       // Confirmada por el conductor
  | "rejected"        // Rechazada por el conductor
  | "canceled_by_passenger"  // Cancelada por el pasajero
  | "canceled_by_driver"     // Cancelada por el conductor
  | "completed"       // Viaje completado
  | "no_show"         // Pasajero no se presentó

// Políticas de cancelación
export interface CancellationPolicy {
  allowCancellation: boolean
  freeUntilHours: number  // Horas antes del viaje para cancelar gratis
  penaltyPercentage: number  // % de penalidad después del tiempo libre
  refundPercentage: number   // % de reembolso
}

// Timestamps de transiciones de estado
export interface StateTransition {
  from: TripStatus | BookingStatus
  to: TripStatus | BookingStatus
  timestamp: any // Firestore timestamp
  triggeredBy: string // userId
  reason?: string
  automaticAction?: boolean
}

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
  
  // Sistema de estados expandido
  status: TripStatus
  statusHistory?: StateTransition[]
  
  // Configuración del viaje
  acceptsSpecialRequests: boolean  // Si acepta solicitudes de recogida
  requiresConfirmation: boolean    // Si requiere confirmación 24h antes
  cancellationPolicy: CancellationPolicy
  
  // Timestamps importantes
  publishedAt?: any
  confirmationDeadline?: any  // 24h antes para confirmar
  lastStateChange?: any
  
  // Información de reservas
  totalBookings: number
  confirmedBookings: number
  passengersCount?: number
  
  // Para compatibilidad con código existente
  driver?: Driver
  createdAt?: any
  updatedAt?: any
}

// Sistema de Pagos - MercadoPago
export type PaymentMethod = "mercadopago" | "cash"
export type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled" | "in_process" | "refunded"

export interface Payment {
  id: string
  bookingId: string
  amount: number
  paymentMethod: PaymentMethod
  status: PaymentStatus
  
  // MercadoPago specific
  mercadoPagoPaymentId?: string
  mercadoPagoPreferenceId?: string
  mercadoPagoCollectorId?: number
  
  // Metadatos del pago
  currency: "ARS" | "USD"
  description: string
  externalReference: string
  
  // Timestamps
  createdAt: any
  approvedAt?: any
  cancelledAt?: any
  
  // Información de reembolso
  refundAmount?: number
  refundReason?: string
  refundedAt?: any
  
  // Datos adicionales
  payerInfo?: {
    email: string
    identification?: {
      type: string
      number: string
    }
    phone?: {
      area_code: string
      number: string
    }
  }
}

export interface MercadoPagoPreference {
  id: string
  items: Array<{
    id: string
    title: string
    description: string
    picture_url?: string
    category_id: string
    quantity: number
    currency_id: "ARS" | "USD"
    unit_price: number
  }>
  payer?: {
    name?: string
    surname?: string
    email?: string
    phone?: {
      area_code: string
      number: string
    }
    identification?: {
      type: string
      number: string
    }
    address?: {
      street_name: string
      street_number: number
      zip_code: string
    }
  }
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  auto_return: "approved" | "all"
  payment_methods: {
    excluded_payment_methods: Array<{ id: string }>
    excluded_payment_types: Array<{ id: string }>
    installments: number
  }
  notification_url: string
  statement_descriptor: string
  external_reference: string
  expires: boolean
  expiration_date_from?: string
  expiration_date_to?: string
}

export interface PaymentNotification {
  id: string
  live_mode: boolean
  type: "payment" | "merchant_order" | "subscription_authorized_payment"
  date_created: string
  application_id: number
  user_id: number
  version: number
  api_version: string
  action: "payment.created" | "payment.updated"
  data: {
    id: string
  }
}

// Expandir la interfaz Booking para incluir pagos
export interface Booking {
  id: string
  tripId: string
  userId: string
  seats: number
  message: string
  totalAmount: number
  
  // Estado de la reserva
  status: BookingStatus
  statusHistory?: StateTransition[]
  
  // Solicitudes especiales
  hasSpecialRequest: boolean
  pickupLocation?: {
    address: string
    coordinates: { lat: number; lng: number }
    extraFee: number
  }
  
  // Timestamps
  createdAt: any
  confirmedAt?: any
  canceledAt?: any
  deadlineForConfirmation?: any
  
  // Información del pasajero (desnormalizada para performance)
  passengerInfo: {
    name: string
    avatar: string | null
    phone?: string
    rating: number
  }
  
  // Sistema de Pagos actualizado
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  paymentMethod: PaymentMethod
  paymentId?: string // ID del pago en nuestra DB
  mercadoPagoPreferenceId?: string // ID de preferencia de MercadoPago
  mercadoPagoPaymentId?: string // ID del pago en MercadoPago
  refundAmount?: number
  
  // Requerimientos de pago
  requiresAdvancePayment: boolean // Si requiere pago por adelantado
  advancePaymentPercentage: number // % del total a pagar por adelantado (ej: 50%)
  remainingPaymentMethod: "cash" | "mercadopago" // Método para el resto
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

// Notificaciones del sistema
export interface Notification {
  id: string
  userId: string
  type: "trip_confirmed" | "trip_canceled" | "booking_request" | "payment_received" | "reminder"
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: any
}
