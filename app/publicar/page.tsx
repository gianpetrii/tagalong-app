import TripPostingForm from "@/components/trip-posting-form"
import PostingGuidelines from "@/components/posting-guidelines"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Publicar un viaje | TagAlong",
  description: "Publicá tu viaje y compartí los gastos con pasajeros que van en tu misma dirección",
}

export default function PostTripPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Publicar un viaje</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TripPostingForm />
        </div>
        <div className="lg:col-span-1">
          <PostingGuidelines />
        </div>
      </div>
    </div>
  )
}
