"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Clock, Users, Share2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { TripProgressTimeline } from "./trip-progress-timeline"
import TripChat from "./trip-chat"
import { Trip, Booking } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TripLiveTrackingProps {
  trip: Trip
  bookings: Booking[]
  className?: string
}

interface LocationUpdate {
  latitude: number
  longitude: number
  timestamp: number
  speed?: number
  heading?: number
}

export default function TripLiveTracking({ trip, bookings, className }: TripLiveTrackingProps) {
  const { user } = useAuth()
  const [driverLocation, setDriverLocation] = useState<LocationUpdate | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [eta, setEta] = useState<string>("")
  const [progress, setProgress] = useState(0)
  const [viewerCount, setViewerCount] = useState(0)

  const isDriver = user?.id === trip.driverId
  const isPassenger = bookings.some(booking => booking.userId === user?.id && booking.status === "confirmed")
  const canViewTracking = isDriver || isPassenger

  // Simular actualizaciones de ubicación del conductor
  useEffect(() => {
    if (trip.status === "in_progress" && isDriver) {
      const interval = setInterval(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLocation: LocationUpdate = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: Date.now(),
                speed: position.coords.speed || 0,
                heading: position.coords.heading || 0
              }
              setDriverLocation(newLocation)
              
              // Calcular progreso y ETA (simulado)
              const randomProgress = Math.min(progress + Math.random() * 5, 100)
              setProgress(randomProgress)
              
              const remainingTime = Math.max(120 - (randomProgress * 1.2), 0)
              setEta(`${Math.floor(remainingTime)} min`)
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true }
          )
        }
      }, 30000) // Actualizar cada 30 segundos

      return () => clearInterval(interval)
    }
  }, [trip.status, isDriver, progress])

  // Simular contador de viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(Math.floor(Math.random() * 10) + bookings.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [bookings.length])

  const handleShareTrip = async () => {
    const shareUrl = `${window.location.origin}/viaje/${trip.id}/seguimiento`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Viaje de ${trip.origin} a ${trip.destination}`,
          text: `Sigue mi viaje en tiempo real`,
          url: shareUrl
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(shareUrl)
      setIsSharing(true)
      setTimeout(() => setIsSharing(false), 2000)
    }
  }

  const getTripStatusInfo = () => {
    switch (trip.status) {
      case "published":
        return {
          color: "bg-blue-500",
          text: "Esperando confirmaciones",
          description: "El viaje está publicado y esperando pasajeros"
        }
      case "confirmed":
        return {
          color: "bg-yellow-500",
          text: "Confirmado",
          description: "Listo para iniciar el viaje"
        }
      case "in_progress":
        return {
          color: "bg-green-500",
          text: "En progreso",
          description: "El viaje está en curso"
        }
      case "completed":
        return {
          color: "bg-emerald-500",
          text: "Completado",
          description: "El viaje ha terminado exitosamente"
        }
      default:
        return {
          color: "bg-gray-500",
          text: "Desconocido",
          description: ""
        }
    }
  }

  const statusInfo = getTripStatusInfo()

  if (!canViewTracking) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <Eye className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Acceso restringido</h2>
            <p className="text-muted-foreground">
              Solo los pasajeros confirmados y el conductor pueden ver el seguimiento del viaje.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header del viaje */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {trip.origin} → {trip.destination}
              </CardTitle>
              <p className="text-muted-foreground">
                {format(new Date(trip.date), "EEEE d 'de' MMMM", { locale: es })} a las {trip.departureTime}
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${statusInfo.color}`}>
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                {statusInfo.text}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {statusInfo.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {bookings.filter(b => b.status === "confirmed").length} / {trip.availableSeats} pasajeros
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{viewerCount} personas siguiendo</span>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareTrip}
                disabled={isSharing}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {isSharing ? "¡Copiado!" : "Compartir viaje"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progreso del viaje */}
      {trip.status === "in_progress" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progreso del viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              {eta && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Tiempo estimado de llegada</span>
                  </div>
                  <Badge variant="outline">{eta}</Badge>
                </div>
              )}

              {driverLocation && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Velocidad actual</span>
                  </div>
                  <Badge variant="outline">
                    {driverLocation.speed ? `${Math.round(driverLocation.speed * 3.6)} km/h` : "0 km/h"}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline del viaje */}
      <TripProgressTimeline trip={trip} />

      {/* Lista de pasajeros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pasajeros confirmados</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.filter(booking => booking.status === "confirmed").length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay pasajeros confirmados aún
            </p>
          ) : (
            <div className="space-y-3">
              {bookings
                .filter(booking => booking.status === "confirmed")
                .map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={booking.passengerInfo.avatar || ""} />
                        <AvatarFallback>
                          {booking.passengerInfo.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{booking.passengerInfo.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.seats} asiento{booking.seats > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${booking.totalAmount}</div>
                      <Badge variant={booking.paymentStatus === "paid" ? "default" : "secondary"}>
                        {booking.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat del viaje */}
      <TripChat 
        tripId={trip.id} 
        isDriver={isDriver}
      />
    </div>
  )
} 