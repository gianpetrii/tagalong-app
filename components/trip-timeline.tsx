"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Trip, StateTransition, TripStatus } from "@/lib/types"
import { TripStatusBadge, getTripStatusText } from "./trip-state-badge"
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Users,
  MapPin
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TripTimelineProps {
  trip: Trip
  className?: string
}

interface TimelineItemProps {
  transition: StateTransition
  isLast: boolean
}

export function TripTimeline({ trip, className }: TripTimelineProps) {
  const [timeToTrip, setTimeToTrip] = useState<string>("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const tripDateTime = new Date(`${trip.date}T${trip.departureTime}`)
      const timeDiff = tripDateTime.getTime() - now.getTime()

      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

        if (days > 0) {
          setTimeToTrip(`${days}d ${hours}h`)
        } else if (hours > 0) {
          setTimeToTrip(`${hours}h ${minutes}m`)
        } else {
          setTimeToTrip(`${minutes}m`)
        }

        // Calcular progreso basado en el estado
        const progressMap: Record<TripStatus, number> = {
          draft: 0,
          published: 20,
          confirmed: 50,
          in_progress: 80,
          completed: 100,
          canceled: 0,
          expired: 0
        }
        setProgress(progressMap[trip.status] || 0)
      } else {
        setTimeToTrip("Viaje iniciado")
        if (trip.status === "in_progress") {
          setProgress(90)
        } else if (trip.status === "completed") {
          setProgress(100)
        }
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [trip.date, trip.departureTime, trip.status])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Estado del Viaje
          </span>
          <TripStatusBadge status={trip.status} />
        </CardTitle>
        <CardDescription>
          Progreso y cronología del viaje
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información general */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">
                {format(new Date(trip.date), "d 'de' MMMM", { locale: es })}
              </div>
              <div className="text-xs text-muted-foreground">{trip.departureTime}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">
                {trip.confirmedBookings || 0}/{trip.availableSeats} asientos
              </div>
              <div className="text-xs text-muted-foreground">
                {trip.totalBookings || 0} reservas totales
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{timeToTrip}</div>
              <div className="text-xs text-muted-foreground">
                {trip.status === "completed" ? "Completado" : "hasta la salida"}
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso del viaje</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Publicado</span>
            <span>Confirmado</span>
            <span>En progreso</span>
            <span>Completado</span>
          </div>
        </div>

        {/* Avisos importantes */}
        {trip.status === "published" && trip.confirmationDeadline && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <div className="text-sm">
              <div className="font-medium text-yellow-800">Confirmación requerida</div>
              <div className="text-yellow-700">
                Debe haber al menos una reserva confirmada antes de las{" "}
                {trip.confirmationDeadline && format(new Date(trip.confirmationDeadline.toDate()), "HH:mm 'del' d/M", { locale: es })}
              </div>
            </div>
          </div>
        )}

        {trip.status === "expired" && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <div className="text-sm">
              <div className="font-medium text-orange-800">Viaje expirado</div>
              <div className="text-orange-700">
                El viaje se marcó como expirado por falta de confirmación
              </div>
            </div>
          </div>
        )}

        {/* Timeline de cambios de estado */}
        {trip.statusHistory && trip.statusHistory.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">Historial de cambios</h4>
              <div className="space-y-3">
                {trip.statusHistory.map((transition, index) => (
                  <TimelineItem 
                    key={index} 
                    transition={transition} 
                    isLast={index === trip.statusHistory!.length - 1}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function TimelineItem({ transition, isLast }: TimelineItemProps) {
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "d/M/yyyy HH:mm", { locale: es })
  }

  const getTransitionIcon = (from: string, to: string) => {
    if (to === "completed") return <CheckCircle className="h-4 w-4 text-green-600" />
    if (to === "canceled" || to === "expired") return <AlertTriangle className="h-4 w-4 text-red-600" />
    return <Clock className="h-4 w-4 text-blue-600" />
  }

  const getTransitionColor = (to: string) => {
    if (to === "completed") return "border-green-200 bg-green-50"
    if (to === "canceled" || to === "expired") return "border-red-200 bg-red-50"
    return "border-blue-200 bg-blue-50"
  }

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`p-1 rounded-full border-2 ${getTransitionColor(transition.to)}`}>
          {getTransitionIcon(transition.from, transition.to)}
        </div>
        {!isLast && <div className="w-px h-8 bg-muted-foreground/20 mt-2" />}
      </div>
      
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">
            {getTripStatusText(transition.to as TripStatus)}
          </span>
          {transition.automaticAction && (
            <Badge variant="secondary" className="text-xs">
              Automático
            </Badge>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {formatTimestamp(transition.timestamp)}
          {transition.triggeredBy !== "system" && (
            <span className="ml-2">
              • Por {transition.triggeredBy === "user" ? "usuario" : "conductor"}
            </span>
          )}
        </div>
        
        {transition.reason && (
          <div className="text-sm text-muted-foreground mt-1 italic">
            "{transition.reason}"
          </div>
        )}
      </div>
    </div>
  )
} 