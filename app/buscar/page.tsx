"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import SearchForm from "@/components/search-form"
import { getTrips, getRecentTrips } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

interface Trip {
  id: string
  origin: string
  destination: string
  date: string
  departureTime: string
  price: number
  availableSeats: number
  driver?: {
    id?: string
    name: string
    rating: number
    avatar: string | null
    reviewCount?: number
    memberSince?: string
  } | null
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState<string>("Resultados de búsqueda")

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      
      const origin = searchParams.get("origin")
      const destination = searchParams.get("destination") 
      const date = searchParams.get("date")
      
      try {
        // Si tenemos parámetros de búsqueda, buscamos viajes específicos
        if (origin && destination && date) {
          const results = await getTrips({ origin, destination, date })
          // Usar aserción de tipos para evitar errores
          const tripsData = results as any[]
          // Convertir a nuestro tipo Trip
          const formattedTrips: Trip[] = tripsData.map(trip => ({
            id: trip.id || "",
            origin: trip.origin || "",
            destination: trip.destination || "",
            date: trip.date || "",
            departureTime: trip.departureTime || "",
            price: trip.price || 0,
            availableSeats: trip.availableSeats || 0,
            driver: trip.driver ? {
              id: trip.driver.id,
              name: trip.driver.name || "Conductor",
              rating: trip.driver.rating || 0,
              avatar: trip.driver.avatar,
              reviewCount: trip.driver.reviewCount,
              memberSince: trip.driver.memberSince
            } : null
          }))
          setTrips(formattedTrips)
          setTitle(`Viajes de ${origin} a ${destination}`)
        } 
        // Si no hay parámetros, mostramos los últimos 10 viajes
        else {
          const recentTrips = await getRecentTrips()
          // Usar aserción de tipos para evitar errores
          const tripsData = recentTrips as any[]
          // Convertir a nuestro tipo Trip
          const formattedTrips: Trip[] = tripsData.map(trip => ({
            id: trip.id || "",
            origin: trip.origin || "",
            destination: trip.destination || "",
            date: trip.date || "",
            departureTime: trip.departureTime || "",
            price: trip.price || 0,
            availableSeats: trip.availableSeats || 0,
            driver: trip.driver ? {
              id: trip.driver.id,
              name: trip.driver.name || "Conductor",
              rating: trip.driver.rating || 0,
              avatar: trip.driver.avatar,
              reviewCount: trip.driver.reviewCount,
              memberSince: trip.driver.memberSince
            } : null
          }))
          setTrips(formattedTrips)
          setTitle("Últimos viajes publicados")
        }
      } catch (error) {
        console.error("Error loading trips:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTrips()
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filtros de búsqueda a la izquierda */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <SearchForm />
          </Card>
        </div>
        {/* Resultados de viajes a la derecha */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-[100px]" />
                  </div>
                </Card>
              ))
            ) : trips.length > 0 ? (
              trips.map((trip) => (
                <Card key={trip.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">
                        {trip.origin} → {trip.destination}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(trip.date), "EEEE d 'de' MMMM", { locale: es })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {trip.departureTime}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {trip.availableSeats} asientos
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold">${trip.price}</div>
                        <div className="text-sm text-muted-foreground">por asiento</div>
                      </div>
                      <Link href={`/viaje/${trip.id}`}>
                        <Button>
                          Ver detalles
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No se encontraron viajes</h3>
                <p className="text-muted-foreground">
                  No hay viajes disponibles para la ruta y fecha seleccionadas.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
