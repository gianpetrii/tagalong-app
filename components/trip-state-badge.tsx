"use client"

import { Badge } from "@/components/ui/badge"
import { TripStatus, BookingStatus } from "@/lib/types"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  Calendar,
  AlertCircle,
  Clock8
} from "lucide-react"

interface TripStatusBadgeProps {
  status: TripStatus
  className?: string
}

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

const TRIP_STATUS_CONFIG = {
  draft: {
    label: "Borrador",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    icon: Clock8
  },
  published: {
    label: "Publicado",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    icon: Calendar
  },
  confirmed: {
    label: "Confirmado",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    icon: CheckCircle
  },
  in_progress: {
    label: "En progreso",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    icon: Play
  },
  completed: {
    label: "Completado",
    color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    icon: CheckCircle
  },
  canceled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: XCircle
  },
  expired: {
    label: "Expirado",
    color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    icon: AlertCircle
  }
}

const BOOKING_STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    icon: Clock
  },
  confirmed: {
    label: "Confirmada",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    icon: CheckCircle
  },
  rejected: {
    label: "Rechazada",
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: XCircle
  },
  canceled_by_passenger: {
    label: "Cancelada por pasajero",
    color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    icon: XCircle
  },
  canceled_by_driver: {
    label: "Cancelada por conductor",
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: XCircle
  },
  completed: {
    label: "Completada",
    color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    icon: CheckCircle
  },
  no_show: {
    label: "No se presentó",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    icon: AlertCircle
  }
}

export function TripStatusBadge({ status, className }: TripStatusBadgeProps) {
  const config = TRIP_STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <Badge 
      variant="secondary" 
      className={`${config.color} ${className} inline-flex items-center gap-1.5`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = BOOKING_STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <Badge 
      variant="secondary" 
      className={`${config.color} ${className} inline-flex items-center gap-1.5`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

// Función auxiliar para obtener el texto del estado
export function getTripStatusText(status: TripStatus): string {
  return TRIP_STATUS_CONFIG[status]?.label || status
}

export function getBookingStatusText(status: BookingStatus): string {
  return BOOKING_STATUS_CONFIG[status]?.label || status
}

// Función para determinar si un estado permite ciertas acciones
export function canCancelTrip(status: TripStatus): boolean {
  return ["published", "confirmed"].includes(status)
}

export function canStartTrip(status: TripStatus): boolean {
  return status === "confirmed"
}

export function canCompleteTrip(status: TripStatus): boolean {
  return status === "in_progress"
}

export function canConfirmBooking(status: BookingStatus): boolean {
  return status === "pending"
}

export function canCancelBooking(status: BookingStatus): boolean {
  return ["pending", "confirmed"].includes(status)
} 