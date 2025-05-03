import { Clock, Calendar, MapPin, Users, Car, Shield, Info } from "lucide-react"
import type { Trip } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTimeToDisplay } from "@/lib/utils"

export default function TripDetails({ trip }: { trip: Trip }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Viaje de {trip.origin} a {trip.destination}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="text-muted-foreground">
                {new Date(trip.date).toLocaleDateString("es-AR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-emerald-600 mr-2" />
              <div>
                <div className="font-medium">
                  {formatTimeToDisplay(trip.departureTime)} → {formatTimeToDisplay(trip.arrivalTime)}
                </div>
                <div className="text-muted-foreground text-sm">Duración: {trip.duration}</div>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="text-muted-foreground">{trip.availableSeats} asientos disponibles</span>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <Car className="h-5 w-5 text-emerald-600 mr-2" />
              <div>
                <div className="font-medium">{trip.carModel}</div>
                <div className="text-muted-foreground text-sm">{trip.carColor}</div>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="h-5 w-5 text-emerald-600 mr-2 flex items-center justify-center">$</div>
              <div>
                <div className="font-medium text-xl">${trip.price} por persona</div>
                <div className="text-muted-foreground text-sm">Pago en efectivo al conductor</div>
              </div>
            </div>

            {trip.features && trip.features.length > 0 && (
              <div className="flex items-start mb-4">
                <Info className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                <div>
                  <div className="font-medium mb-1">Características</div>
                  <div className="flex flex-wrap gap-1">
                    {trip.features.map((feature, index) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Detalles de la ruta</h2>

          <div className="space-y-4">
            <div className="flex">
              <div className="mr-3 relative">
                <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <MapPin size={16} />
                </div>
                <div className="absolute top-6 bottom-0 left-1/2 w-0.5 -ml-px bg-muted"></div>
              </div>
              <div>
                <div className="font-medium">{trip.origin}</div>
                <div className="text-muted-foreground">
                  {formatTimeToDisplay(trip.departureTime)} - Punto de encuentro: {trip.meetingPoint}
                </div>
              </div>
            </div>

            {trip.stops &&
              trip.stops.map((stop, index) => (
                <div key={index} className="flex">
                  <div className="mr-3 relative">
                    <div className="h-6 w-6 rounded-full bg-muted-foreground flex items-center justify-center text-white">
                      <MapPin size={16} />
                    </div>
                    <div className="absolute top-6 bottom-0 left-1/2 w-0.5 -ml-px bg-muted"></div>
                  </div>
                  <div>
                    <div className="font-medium">{stop.location}</div>
                    <div className="text-muted-foreground">{formatTimeToDisplay(stop.time)}</div>
                  </div>
                </div>
              ))}

            <div className="flex">
              <div className="mr-3">
                <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <MapPin size={16} />
                </div>
              </div>
              <div>
                <div className="font-medium">{trip.destination}</div>
                <div className="text-muted-foreground">
                  {formatTimeToDisplay(trip.arrivalTime)} - Punto de llegada: {trip.dropOffPoint}
                </div>
              </div>
            </div>
          </div>
        </div>

        {trip.notes && (
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Notas del conductor</h2>
            <p className="text-muted-foreground">{trip.notes}</p>
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">Políticas del viaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="text-muted-foreground">Cancelación gratuita hasta 24h antes</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-emerald-600 mr-2" />
              <span className="text-muted-foreground">Verificación de identidad requerida</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
