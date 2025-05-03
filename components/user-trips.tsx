import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"
import { getUserTrips } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatTimeToDisplay } from "@/lib/utils"

export default async function UserTrips({ userId }: { userId: string }) {
  const trips = await getUserTrips(userId)

  if (trips.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximos viajes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Este usuario no tiene viajes programados.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos viajes ({trips.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trips.slice(0, 3).map((trip) => (
            <Link key={trip.id} href={`/viaje/${trip.id}`}>
              <div className="border border-border rounded-md p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Calendar size={16} className="text-emerald-600 mr-2" />
                  <span className="text-muted-foreground">{new Date(trip.date).toLocaleDateString("es-AR")}</span>
                </div>

                <div className="flex items-center mb-2">
                  <Clock size={16} className="text-emerald-600 mr-2" />
                  <span className="text-muted-foreground">{formatTimeToDisplay(trip.departureTime)}</span>
                </div>

                <div className="flex items-start">
                  <MapPin size={16} className="text-emerald-600 mr-2 mt-1" />
                  <div>
                    <div className="font-medium">{trip.origin}</div>
                    <div className="text-muted-foreground">→</div>
                    <div className="font-medium">{trip.destination}</div>
                  </div>
                </div>

                <div className="mt-2 text-right font-bold text-emerald-600">${trip.price}</div>
              </div>
            </Link>
          ))}
        </div>

        {trips.length > 3 && (
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href={`/usuario/${userId}/viajes`}>Ver todos los viajes</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
