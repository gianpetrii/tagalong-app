import { notFound } from "next/navigation"
import { getTrip, getPopularTrips } from "@/lib/data"
import TripDetails from "@/components/trip-details"
import DriverProfile from "@/components/driver-profile"
import BookingForm from "@/components/booking-form"
import TripReviews from "@/components/trip-reviews"
import RelatedTrips from "@/components/related-trips"
import type { Metadata } from "next"

type Props = {
  params: { id: string }
}

// Esta función es necesaria para generar rutas estáticas con parámetros dinámicos
export async function generateStaticParams() {
  // Obtener IDs de viajes populares para pre-renderizar
  const tripIds = await getPopularTrips()
  
  return tripIds.map(id => ({
    id: id,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trip = await getTrip(params.id)

  if (!trip) {
    return {
      title: "Viaje no encontrado | ViajeJuntos",
    }
  }

  return {
    title: `Viaje de ${trip.origin} a ${trip.destination} | ViajeJuntos`,
    description: `Viaje compartido de ${trip.origin} a ${trip.destination} el ${new Date(trip.date).toLocaleDateString("es-AR")} por $${trip.price}`,
  }
}

export default async function TripPage({ params }: Props) {
  const trip = await getTrip(params.id)

  if (!trip) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TripDetails trip={trip} />
          <div className="mt-8">
            <DriverProfile driver={trip.driver} />
          </div>
          <div className="mt-8">
            <TripReviews tripId={params.id} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <BookingForm trip={trip} />
            <div className="mt-8">
              <RelatedTrips
                origin={trip.origin}
                destination={trip.destination}
                date={trip.date}
                currentTripId={trip.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
