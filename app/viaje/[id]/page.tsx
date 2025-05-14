import { notFound } from "next/navigation"
import { getTrip, getPopularTrips, getUserProfile, getAllTripIds } from "@/lib/data"
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
  try {
    // Obtener IDs de todos los viajes para pre-renderizar
    const allTripIds = await getAllTripIds()
    
    // Mapear los IDs al formato esperado por Next.js
    return allTripIds.map((id: string) => ({ id }))
  } catch (error) {
    console.error("Error generando rutas estáticas:", error)
    // Si hay un error, al menos devolvemos algunos IDs necesarios
    return [
      { id: 'nuevo-viaje-creado' }
    ]
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trip = await getTrip(params.id)

  if (!trip) {
    return {
      title: "Viaje no encontrado | Tag Along",
    }
  }

  return {
    title: `Viaje de ${trip.origin} a ${trip.destination} | Tag Along`,
    description: `Viaje compartido de ${trip.origin} a ${trip.destination} el ${new Date(trip.date).toLocaleDateString("es-AR")} por $${trip.price}`,
  }
}

// Helper function to convert Firebase Timestamp or any date-like object to a plain object
function convertTimestampsToObjects(obj: any): any {
  if (!obj) return obj;
  
  if (typeof obj !== 'object') return obj;
  
  // If it's a Timestamp or has seconds and nanoseconds properties
  if (obj && typeof obj === 'object' && 'seconds' in obj && 'nanoseconds' in obj) {
    // Convert to ISO string date
    return new Date(obj.seconds * 1000).toISOString();
  }
  
  // If it's an array, convert each element
  if (Array.isArray(obj)) {
    return obj.map(item => convertTimestampsToObjects(item));
  }
  
  // If it's an object (but not a Timestamp), convert each property
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = convertTimestampsToObjects(obj[key]);
      }
    }
    return result;
  }
  
  return obj;
}

export default async function TripPage({ params }: Props) {
  const tripRaw = await getTrip(params.id)

  if (!tripRaw) {
    notFound()
  }

  // Convert all Firebase Timestamps to plain objects
  const trip = convertTimestampsToObjects(tripRaw);

  // Si el viaje no tiene información del conductor, intentamos obtenerla
  let driver: any = (trip as any).driver;
  if (!driver && trip.driverId) {
    try {
      const driverData = await getUserProfile(trip.driverId);
      if (driverData) {
        driver = {
          id: driverData.id,
          name: driverData.name,
          avatar: driverData.avatar,
          rating: driverData.rating,
          reviewCount: driverData.reviewCount,
          memberSince: driverData.memberSince,
          bio: driverData.about || undefined,
          preferences: [] // Iniciamos con un array vacío de preferencias
        };
      }
    } catch (error) {
      console.error("Error al cargar información del conductor:", error);
    }
  }

  // Ensure availableSeats is always a number
  if (trip.availableSeats === undefined || typeof trip.availableSeats !== 'number') {
    trip.availableSeats = 0;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TripDetails trip={trip} />
          {driver && (
            <div className="mt-8">
              <DriverProfile driver={driver} />
            </div>
          )}
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
