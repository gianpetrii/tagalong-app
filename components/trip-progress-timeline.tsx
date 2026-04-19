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

interface TripProgressTimelineProps {
  trip: Trip
  className?: string
}

interface TimelineItem {
  id: string
  title: string
  description: string
  timestamp: Date | null
  status: "completed" | "current" | "pending"
  icon: React.ReactNode
}

export function TripProgressTimeline({ trip, className }: TripProgressTimelineProps) {
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

  const getTimelineItems = (): TimelineItem[] => {
    const items: TimelineItem[] = [
      {
        id: "published",
        title: "Viaje publicado",
        description: "El viaje fue publicado y está disponible para reservas",
        timestamp: trip.createdAt ? new Date(trip.createdAt) : null,
        status: "completed",
        icon: <CheckCircle className="w-4 h-4 text-green-600" />
      },
      {
        id: "bookings",
        title: "Reservas recibidas",
        description: "Los pasajeros comenzaron a reservar asientos",
        timestamp: null, // Se podría obtener de las reservas
        status: trip.availableSeats < 4 ? "completed" : "pending",
        icon: <Users className="w-4 h-4 text-blue-600" />
      },
      {
        id: "confirmed", 
        title: "Viaje confirmado",
        description: "El conductor confirmó el viaje y está listo para partir",
        timestamp: null,
        status: trip.status === "confirmed" || trip.status === "in_progress" || trip.status === "completed" ? "completed" : 
                trip.status === "published" ? "pending" : "pending",
        icon: <CheckCircle className="w-4 h-4 text-emerald-600" />
      },
      {
        id: "departure",
        title: "Hora de salida",
        description: `Salida programada desde ${trip.origin}`,
        timestamp: new Date(`${trip.date}T${trip.departureTime}`),
        status: trip.status === "in_progress" || trip.status === "completed" ? "completed" : 
                trip.status === "confirmed" ? "current" : "pending",
        icon: <MapPin className="w-4 h-4 text-purple-600" />
      },
      {
        id: "in_progress",
        title: "Viaje en progreso",
        description: "El viaje está en curso hacia el destino",
        timestamp: null,
        status: trip.status === "in_progress" ? "current" : 
                trip.status === "completed" ? "completed" : "pending",
        icon: <Clock className="w-4 h-4 text-orange-600" />
      },
      {
        id: "arrival",
        title: "Llegada al destino",
        description: `Llegada programada a ${trip.destination}`,
        timestamp: new Date(`${trip.date}T${trip.arrivalTime || trip.departureTime}`),
        status: trip.status === "completed" ? "completed" : "pending",
        icon: <MapPin className="w-4 h-4 text-green-600" />
      },
      {
        id: "completed",
        title: "Viaje completado",
        description: "El viaje terminó exitosamente",
        timestamp: null,
        status: trip.status === "completed" ? "completed" : "pending",
        icon: <CheckCircle className="w-4 h-4 text-emerald-600" />
      }
    ]

    return items
  }

  const timelineItems = getTimelineItems()

  const getStatusBadge = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completado</Badge>
      case "current":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">En progreso</Badge>
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>
    }
  }

  const getConnectorClass = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-600"
      case "current":
        return "bg-blue-600"
      case "pending":
        return "bg-gray-300"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Progreso del viaje</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {timelineItems.map((item, index) => (
            <div key={item.id} className="relative flex items-start space-x-3 pb-6">
              {/* Connector line */}
              {index < timelineItems.length - 1 && (
                <div className={`absolute left-2 top-8 w-0.5 h-8 ${getConnectorClass(item.status)}`} />
              )}
              
              {/* Icon */}
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                item.status === "completed" ? "bg-green-50 border-green-600" :
                item.status === "current" ? "bg-blue-50 border-blue-600" :
                "bg-gray-50 border-gray-300"
              }`}>
                {item.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.timestamp && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(item.timestamp, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trip summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Estado actual:</span>
              <div className="font-medium capitalize">{trip.status.replace("_", " ")}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Asientos ocupados:</span>
              <div className="font-medium">{4 - trip.availableSeats} de 4</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 