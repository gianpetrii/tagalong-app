import { getUserStats } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Car, Users, Star } from "lucide-react"

export default async function UserStats({ userId }: { userId: string }) {
  const stats = await getUserStats(userId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Car className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-muted-foreground">Viajes realizados</span>
              </div>
              <span className="font-bold">{stats.tripsCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-muted-foreground">Pasajeros transportados</span>
              </div>
              <span className="font-bold">{stats.passengersTransported}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-muted-foreground">Kilómetros recorridos</span>
              </div>
              <span className="font-bold">{stats.kilometersTotal.toLocaleString()} km</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-muted-foreground">Calificación promedio</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold mr-1">{stats.averageRating}</span>
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rutas frecuentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.frequentRoutes.map((route, index) => (
              <div key={index} className="flex items-start">
                <MapPin className="h-5 w-5 text-emerald-600 mr-2 mt-0.5" />
                <div>
                  <div className="font-medium">
                    {route.origin} → {route.destination}
                  </div>
                  <div className="text-muted-foreground text-sm">{route.count} viajes</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
