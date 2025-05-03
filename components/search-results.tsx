import Link from "next/link"
import Image from "next/image"
import { Clock, Calendar, Users, Star, AlertCircle } from "lucide-react"
import { searchTrips } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatTimeToDisplay } from "@/lib/utils"

interface SearchResultsProps {
  origin: string
  destination: string
  date: string
  sortBy?: string
  minPrice?: number
  maxPrice?: number
  minDepartureTime?: string
  maxDepartureTime?: string
  minRating?: number
}

export default async function SearchResults({
  origin,
  destination,
  date,
  sortBy = "recommended",
  minPrice,
  maxPrice,
  minDepartureTime,
  maxDepartureTime,
  minRating,
}: SearchResultsProps) {
  const trips = await searchTrips(
    origin,
    destination,
    date,
    sortBy,
    minPrice,
    maxPrice,
    minDepartureTime,
    maxDepartureTime,
    minRating,
  )

  if (trips.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No se encontraron viajes</h2>
          <p className="text-muted-foreground mb-6">
            No hay viajes disponibles para la ruta y fecha seleccionadas. Intenta con otras fechas o destinos.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/">Volver al inicio</Link>
            </Button>
            <Button asChild>
              <Link href="/publicar">Publicar un viaje</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {trips.length} {trips.length === 1 ? "viaje encontrado" : "viajes encontrados"} de {origin} a {destination} el{" "}
          {new Date(date).toLocaleDateString("es-AR")}
        </p>
        <Badge variant="outline" className="text-xs">
          {sortBy === "recommended" && "Ordenados por recomendación"}
          {sortBy === "price_asc" && "Ordenados por precio: menor a mayor"}
          {sortBy === "price_desc" && "Ordenados por precio: mayor a menor"}
          {sortBy === "departure" && "Ordenados por hora de salida"}
          {sortBy === "rating" && "Ordenados por calificación"}
        </Badge>
      </div>

      {trips.map((trip) => (
        <Link key={trip.id} href={`/viaje/${trip.id}`} className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                <div className="md:col-span-3">
                  <div className="flex items-center mb-3">
                    <div className="text-lg font-semibold">{formatTimeToDisplay(trip.departureTime)}</div>
                    <div className="mx-2 text-muted-foreground">→</div>
                    <div className="text-lg font-semibold">{formatTimeToDisplay(trip.arrivalTime)}</div>
                  </div>

                  <div className="flex items-center text-muted-foreground mb-3">
                    <Clock size={16} className="mr-1" />
                    <span>{trip.duration}</span>
                    <span className="mx-2">•</span>
                    <Calendar size={16} className="mr-1" />
                    <span>{new Date(trip.date).toLocaleDateString("es-AR")}</span>
                  </div>

                  <div className="mb-3">
                    <div className="font-medium">{trip.origin}</div>
                    <div className="text-muted-foreground">→</div>
                    <div className="font-medium">{trip.destination}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">{trip.availableSeats} asientos disponibles</span>
                    </div>

                    <div className="flex items-center">
                      <Image
                        src={trip.driver.avatar || "/placeholder.svg?height=24&width=24"}
                        alt={trip.driver.name}
                        width={24}
                        height={24}
                        className="rounded-full mr-1"
                      />
                      <span className="text-muted-foreground">{trip.driver.name}</span>
                      <div className="flex items-center ml-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-muted-foreground text-sm">{trip.driver.rating}</span>
                      </div>
                    </div>

                    {trip.features && trip.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {trip.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-1 flex md:flex-col md:items-end justify-between">
                  <div className="text-2xl font-bold text-emerald-600">${trip.price}</div>
                  <div className="text-muted-foreground">{trip.carModel}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
