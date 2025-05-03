import Link from "next/link"
import { Clock, Calendar } from "lucide-react"
import { getRelatedTrips } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTimeToDisplay } from "@/lib/utils"

export default async function RelatedTrips({
  origin,
  destination,
  date,
  currentTripId,
}: {
  origin: string
  destination: string
  date: string
  currentTripId: string
}) {
  const trips = await getRelatedTrips(origin, destination, date, currentTripId)

  if (trips.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viajes similares</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/viaje/${trip.id}`}>
              <div className="border border-border rounded-md p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Calendar size={16} className="text-emerald-600 mr-2" />
                  <span className="text-muted-foreground">{new Date(trip.date).toLocaleDateString("es-AR")}</span>
                </div>

                <div className="flex items-center mb-2">
                  <Clock size={16} className="text-emerald-600 mr-2" />
                  <span className="text-muted-foreground">
                    {formatTimeToDisplay(trip.departureTime)} → {formatTimeToDisplay(trip.arrivalTime)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-muted-foreground text-sm">{trip.availableSeats} asientos</div>
                  <div className="font-bold text-emerald-600">${trip.price}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
