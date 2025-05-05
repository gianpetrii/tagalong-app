"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Clock, MapPin, Users, ChevronRight, Car, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Tipos para los viajes
type TripStatus = "upcoming" | "completed" | "canceled"

interface Trip {
  id: string
  origin: string
  destination: string
  date: string
  departureTime: string
  status: TripStatus
  price: number
  availableSeats: number
  passengersCount: number
}

// Datos de ejemplo
const mockPublishedTrips: Trip[] = [
  {
    id: "pub1",
    origin: "Buenos Aires",
    destination: "Mar del Plata",
    date: "2025-06-15",
    departureTime: "08:00",
    status: "upcoming",
    price: 4500,
    availableSeats: 3,
    passengersCount: 1,
  },
  {
    id: "pub2",
    origin: "Buenos Aires",
    destination: "Rosario",
    date: "2025-06-10",
    departureTime: "10:00",
    status: "upcoming",
    price: 3800,
    availableSeats: 2,
    passengersCount: 2,
  },
  {
    id: "pub3",
    origin: "Córdoba",
    destination: "Buenos Aires",
    date: "2025-05-05",
    departureTime: "07:30",
    status: "completed",
    price: 5200,
    availableSeats: 0,
    passengersCount: 4,
  },
]

const mockBookedTrips: Trip[] = [
  {
    id: "book1",
    origin: "La Plata",
    destination: "Buenos Aires",
    date: "2025-06-20",
    departureTime: "09:15",
    status: "upcoming",
    price: 1800,
    availableSeats: 2,
    passengersCount: 2,
  },
  {
    id: "book2",
    origin: "Buenos Aires",
    destination: "Bahía Blanca",
    date: "2025-04-10",
    departureTime: "07:00",
    status: "completed",
    price: 6200,
    availableSeats: 0,
    passengersCount: 3,
  },
]

export default function MyTripsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [publishedTrips, setPublishedTrips] = useState<Trip[]>([])
  const [bookedTrips, setBookedTrips] = useState<Trip[]>([])
  const [activeTab, setActiveTab] = useState<"published" | "booked">("published")
  const [statusFilter, setStatusFilter] = useState<TripStatus | "all">("all")

  useEffect(() => {
    // Si no hay usuario autenticado, redirigir al login
    if (!isLoading && !user) {
      router.push("/login")
    }

    // Cargar viajes (en una implementación real, esto sería una llamada a Firebase)
    setPublishedTrips(mockPublishedTrips)
    setBookedTrips(mockBookedTrips)
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="text-center">Cargando viajes...</div>
        </div>
      </div>
    )
  }

  // Filtrar viajes por estado
  const filteredPublishedTrips = statusFilter === "all" 
    ? publishedTrips 
    : publishedTrips.filter(trip => trip.status === statusFilter)

  const filteredBookedTrips = statusFilter === "all" 
    ? bookedTrips 
    : bookedTrips.filter(trip => trip.status === statusFilter)

  // Renderizar tarjeta de viaje
  const renderTripCard = (trip: Trip, isPublished: boolean) => {
    const tripDate = new Date(trip.date)
    const formattedDate = format(tripDate, "EEEE d 'de' MMMM, yyyy", { locale: es })
    
    // Determinar color y texto del estado
    const statusConfig = {
      upcoming: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", text: "Próximo" },
      completed: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", text: "Completado" },
      canceled: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", text: "Cancelado" },
    }

    return (
      <Card key={trip.id} className="mb-4">
        <div className="p-4 md:p-6">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
            <Badge className={statusConfig[trip.status].color}>
              {statusConfig[trip.status].text}
            </Badge>
            <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              ${trip.price}
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">
            {trip.origin} a {trip.destination}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Salida: {trip.departureTime} hs</span>
            </div>
            {isPublished && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {trip.passengersCount} pasajero{trip.passengersCount !== 1 ? "s" : ""} · {trip.availableSeats} asiento{trip.availableSeats !== 1 ? "s" : ""} disponible{trip.availableSeats !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Link href={`/viaje/${trip.id}`}>
              <Button variant="outline" size="sm">
                Ver detalles
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Mis viajes</h1>
          <Link href="/publicar">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Publicar viaje
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <Tabs 
            defaultValue="published" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "published" | "booked")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="published">
                <Car className="h-4 w-4 mr-2" />
                Viajes publicados
              </TabsTrigger>
              <TabsTrigger value="booked">
                <Users className="h-4 w-4 mr-2" />
                Viajes reservados
              </TabsTrigger>
            </TabsList>

            {/* Filtros de estado */}
            <div className="flex flex-wrap gap-2 my-4">
              <Badge
                variant={statusFilter === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("all")}
              >
                Todos
              </Badge>
              <Badge
                variant={statusFilter === "upcoming" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("upcoming")}
              >
                Próximos
              </Badge>
              <Badge
                variant={statusFilter === "completed" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("completed")}
              >
                Completados
              </Badge>
              <Badge
                variant={statusFilter === "canceled" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("canceled")}
              >
                Cancelados
              </Badge>
            </div>

            <TabsContent value="published">
              {filteredPublishedTrips.length > 0 ? (
                filteredPublishedTrips.map(trip => renderTripCard(trip, true))
              ) : (
                <div className="text-center py-12">
                  <Car className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes viajes publicados</h3>
                  <p className="text-muted-foreground mb-6">
                    Comparte tu viaje y ahorra dinero mientras conoces personas
                  </p>
                  <Link href="/publicar">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Publicar un viaje
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="booked">
              {filteredBookedTrips.length > 0 ? (
                filteredBookedTrips.map(trip => renderTripCard(trip, false))
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes viajes reservados</h3>
                  <p className="text-muted-foreground mb-6">
                    Busca y reserva viajes para desplazarte de manera económica
                  </p>
                  <Link href="/buscar">
                    <Button>
                      Buscar viajes
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 