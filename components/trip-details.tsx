import { Clock, Calendar, MapPin, Users, Car, Shield, Info } from "lucide-react"
import type { Trip } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTimeToDisplay } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function TripDetails({ trip }: { trip: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Viaje de {trip.origin} a {trip.destination}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{trip.origin} → {trip.destination}</h2>
            <p className="text-muted-foreground">
              {format(new Date(trip.date), "EEEE d 'de' MMMM", { locale: es })}
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-1">
            ${trip.price}
          </Badge>
            </div>

        <div className="grid grid-cols-2 gap-4">
              <div>
            <div className="text-sm text-muted-foreground">Salida</div>
            <div className="font-medium">{trip.departureTime}</div>
                </div>
          <div>
            <div className="text-sm text-muted-foreground">Llegada</div>
            <div className="font-medium">{trip.arrivalTime || 'No especificada'}</div>
              </div>
          <div>
            <div className="text-sm text-muted-foreground">Duración</div>
            <div className="font-medium">{trip.duration || 'No especificada'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Asientos disponibles</div>
            <div className="font-medium">{trip.availableSeats}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Información del vehículo</h3>
          <div className="grid grid-cols-2 gap-4">
              <div>
              <div className="text-sm text-muted-foreground">Marca</div>
              <div className="font-medium">{trip.carBrand || 'No especificada'}</div>
              </div>
            <div>
              <div className="text-sm text-muted-foreground">Modelo</div>
              <div className="font-medium">{trip.carModel || 'No especificado'}</div>
            </div>
            {trip.carYear && (
              <div>
                <div className="text-sm text-muted-foreground">Año</div>
                <div className="font-medium">{trip.carYear}</div>
              </div>
            )}
            {trip.carPlate && (
                <div>
                <div className="text-sm text-muted-foreground">Patente</div>
                <div className="font-medium">{trip.carPlate}</div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Puntos de encuentro</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Punto de encuentro</div>
              <div className="font-medium">{trip.meetingPoint || 'No especificado'}</div>
              </div>
              <div>
              <div className="text-sm text-muted-foreground">Punto de llegada</div>
              <div className="font-medium">{trip.dropOffPoint || 'No especificado'}</div>
                </div>
              </div>
            </div>

        {trip.stops && trip.stops.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Paradas intermedias</h3>
            <div className="space-y-4">
              {trip.stops.map((stop: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{stop.location}</div>
                    <div className="text-sm text-muted-foreground">{stop.time}</div>
                  </div>
                </div>
              ))}
                </div>
              </div>
        )}

        {trip.features && trip.features.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Características</h3>
            <div className="flex flex-wrap gap-2">
              {trip.features.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {trip.notes && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Notas adicionales</h3>
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
        
        {trip.coordinates && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Ubicaciones</h3>
            <div className="grid grid-cols-1 gap-4">
              {trip.coordinates.origin && (
                <div>
                  <div className="text-sm text-muted-foreground">Coordenadas origen</div>
                  <div className="font-medium">
                    Lat: {trip.coordinates.origin.lat?.toFixed(6)}, Lng: {trip.coordinates.origin.lng?.toFixed(6)}
                  </div>
                </div>
              )}
              {trip.coordinates.destination && (
                <div>
                  <div className="text-sm text-muted-foreground">Coordenadas destino</div>
                  <div className="font-medium">
                    Lat: {trip.coordinates.destination.lat?.toFixed(6)}, Lng: {trip.coordinates.destination.lng?.toFixed(6)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
