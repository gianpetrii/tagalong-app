import { Metadata } from "next"
import NewTripSuccessClient from "@/components/new-trip-success-client"

export const metadata: Metadata = {
  title: "Viaje publicado con éxito | Tag Along",
  description: "Tu viaje ha sido publicado correctamente en Tag Along",
}

export default function NewTripSuccessPage() {
  return <NewTripSuccessClient />
} 