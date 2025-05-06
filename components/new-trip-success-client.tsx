"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

export default function NewTripSuccessClient() {
  const router = useRouter()

  // Redirect to homepage after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold mb-4">¡Viaje publicado con éxito!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Tu viaje ha sido publicado correctamente. Los pasajeros interesados podrán contactarte pronto.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/mis-viajes")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Ver mis viajes
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          Serás redirigido a la página principal en 5 segundos...
        </p>
      </div>
    </div>
  )
} 