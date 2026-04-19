"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  TripStatusBadge, 
  BookingStatusBadge,
  canCancelTrip,
  canStartTrip,
  canCompleteTrip,
  canConfirmBooking,
  canCancelBooking
} from "./trip-state-badge"
import { useTripStateManager } from "@/lib/trip-state-manager"
import { Trip, Booking, TripStatus, BookingStatus } from "@/lib/types"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Users,
  MapPin
} from "lucide-react"

interface TripStateManagerPanelProps {
  trip: Trip
  bookings?: Booking[]
  onStateChange?: () => void
}

interface BookingItemProps {
  booking: Booking
  onStatusChange?: () => void
}

export function TripStateManagerPanel({ trip, bookings = [], onStateChange }: TripStateManagerPanelProps) {
  const { user } = useAuth()
  const { changeTripStatus } = useTripStateManager()
  const [loading, setLoading] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const isDriver = user?.id === trip.driverId

  if (!isDriver) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TripStatusBadge status={trip.status} />
            Estado del Viaje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Solo el conductor puede gestionar el estado del viaje.
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleStatusChange = async (newStatus: TripStatus, reason?: string) => {
    if (!user) return
    
    setLoading(true)
    try {
      const success = await changeTripStatus(trip.id, newStatus, user.id, reason)
      if (success) {
        toast.success(`Viaje marcado como ${newStatus}`)
        onStateChange?.()
      } else {
        toast.error("Error al cambiar el estado del viaje")
      }
    } catch (error) {
      toast.error("Error al cambiar el estado del viaje")
    } finally {
      setLoading(false)
    }
  }

  const confirmedBookingsCount = bookings.filter(b => b.status === "confirmed").length
  const pendingBookingsCount = bookings.filter(b => b.status === "pending").length
  const totalSeatsBooked = bookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + b.seats, 0)

  return (
    <div className="space-y-6">
      {/* Estado del Viaje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TripStatusBadge status={trip.status} />
              Gestión del Viaje
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {totalSeatsBooked}/{trip.availableSeats} asientos
            </div>
          </CardTitle>
          <CardDescription>
            Controla el estado de tu viaje y gestiona las reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pendingBookingsCount}</div>
              <div className="text-xs text-muted-foreground">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{confirmedBookingsCount}</div>
              <div className="text-xs text-muted-foreground">Confirmadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalSeatsBooked}</div>
              <div className="text-xs text-muted-foreground">Asientos ocupados</div>
            </div>
          </div>

          <Separator />

          {/* Acciones de estado */}
          <div className="flex flex-wrap gap-2">
            {canStartTrip(trip.status) && (
              <Button 
                onClick={() => handleStatusChange("in_progress")}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Viaje
              </Button>
            )}

            {canCompleteTrip(trip.status) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completar Viaje
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Completar viaje?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción marcará el viaje como completado y todas las reservas confirmadas 
                      también se marcarán como completadas. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleStatusChange("completed")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Sí, completar viaje
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {canCancelTrip(trip.status) && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    disabled={loading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar Viaje
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Cancelar viaje?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción cancelará el viaje y todas las reservas asociadas. 
                      Los pasajeros serán notificados automáticamente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Label htmlFor="cancel-reason">Motivo de cancelación (opcional)</Label>
                    <Textarea
                      id="cancel-reason"
                      placeholder="Explica el motivo de la cancelación..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleStatusChange("canceled", cancelReason)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sí, cancelar viaje
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Avisos importantes */}
          {trip.status === "published" && pendingBookingsCount > 0 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Tienes {pendingBookingsCount} reserva(s) pendiente(s) de confirmación
              </span>
            </div>
          )}

          {trip.status === "confirmed" && trip.confirmationDeadline && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Si no hay reservas confirmadas 1h antes del viaje, se marcará como expirado automáticamente
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      {bookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reservas del Viaje</CardTitle>
            <CardDescription>
              Gestiona las reservas individuales de los pasajeros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.map((booking) => (
                <BookingItem 
                  key={booking.id} 
                  booking={booking} 
                  onStatusChange={onStateChange}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function BookingItem({ booking, onStatusChange }: BookingItemProps) {
  const { user } = useAuth()
  const { changeBookingStatus } = useTripStateManager()
  const [loading, setLoading] = useState(false)

  const handleBookingStatusChange = async (newStatus: BookingStatus, reason?: string) => {
    if (!user) return
    
    setLoading(true)
    try {
      const success = await changeBookingStatus(booking.id, newStatus, user.id, reason)
      if (success) {
        toast.success(`Reserva marcada como ${newStatus}`)
        onStatusChange?.()
      } else {
        toast.error("Error al cambiar el estado de la reserva")
      }
    } catch (error) {
      toast.error("Error al cambiar el estado de la reserva")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          {booking.passengerInfo.avatar ? (
            <img 
              src={booking.passengerInfo.avatar} 
              alt={booking.passengerInfo.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium">
              {booking.passengerInfo.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <div className="font-medium">{booking.passengerInfo.name}</div>
          <div className="text-sm text-muted-foreground">
            {booking.seats} asiento(s) • ${booking.totalAmount}
          </div>
          {booking.message && (
            <div className="text-xs text-muted-foreground mt-1">
              "{booking.message}"
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <BookingStatusBadge status={booking.status} />
        
        {canConfirmBooking(booking.status) && (
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={() => handleBookingStatusChange("confirmed")}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Confirmar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBookingStatusChange("rejected", "Rechazada por el conductor")}
              disabled={loading}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Rechazar
            </Button>
          </div>
        )}

        {canCancelBooking(booking.status) && booking.status === "confirmed" && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleBookingStatusChange("canceled_by_driver", "Cancelada por el conductor")}
            disabled={loading}
          >
            <XCircle className="h-3 w-3 mr-1" />
            Cancelar
          </Button>
        )}
      </div>
    </div>
  )
} 