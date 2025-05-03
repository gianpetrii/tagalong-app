import { Search, Calendar, Car, MapPin, CreditCard, MessageSquare, Star } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function HowItWorksDetailed() {
  const passengerSteps = [
    {
      icon: <Search className="h-10 w-10 text-emerald-600" />,
      title: "Buscar un viaje",
      description:
        "Ingresá tu origen, destino y fecha para encontrar viajes disponibles que se ajusten a tus necesidades.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <Calendar className="h-10 w-10 text-emerald-600" />,
      title: "Reservar tu asiento",
      description: "Elegí el viaje que más te convenga, revisá los detalles y solicitá una reserva al conductor.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-emerald-600" />,
      title: "Comunicarte con el conductor",
      description:
        "Una vez confirmada la reserva, podés comunicarte con el conductor para coordinar los detalles del viaje.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <MapPin className="h-10 w-10 text-emerald-600" />,
      title: "Encontrarte en el punto acordado",
      description: "Llegá puntual al punto de encuentro acordado con el conductor para iniciar el viaje.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-emerald-600" />,
      title: "Pagar al conductor",
      description: "Pagá el monto acordado directamente al conductor al inicio del viaje, generalmente en efectivo.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <Star className="h-10 w-10 text-emerald-600" />,
      title: "Calificar la experiencia",
      description: "Después del viaje, calificá al conductor y dejá una reseña para ayudar a otros usuarios.",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const driverSteps = [
    {
      icon: <Car className="h-10 w-10 text-emerald-600" />,
      title: "Publicar un viaje",
      description: "Indicá tu ruta, fecha, hora, precio y número de asientos disponibles para compartir tu viaje.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <Calendar className="h-10 w-10 text-emerald-600" />,
      title: "Recibir solicitudes",
      description: "Los pasajeros interesados te enviarán solicitudes de reserva que podrás aceptar o rechazar.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-emerald-600" />,
      title: "Coordinar con los pasajeros",
      description: "Comunicarte con los pasajeros para confirmar los detalles del viaje y resolver dudas.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <MapPin className="h-10 w-10 text-emerald-600" />,
      title: "Recoger a los pasajeros",
      description: "Recogé a los pasajeros en los puntos acordados y asegurate de ser puntual.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <CreditCard className="h-10 w-10 text-emerald-600" />,
      title: "Recibir el pago",
      description: "Cobrá el monto acordado a cada pasajero al inicio del viaje, generalmente en efectivo.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: <Star className="h-10 w-10 text-emerald-600" />,
      title: "Calificar a los pasajeros",
      description: "Después del viaje, calificá a los pasajeros para mantener la confianza en la comunidad.",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="space-y-16">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Para pasajeros</h2>
        <div className="space-y-8">
          {passengerSteps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="p-6 md:col-span-2">
                    <div className="flex items-start mb-4">
                      <div className="mr-4 mt-1">{step.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          <span className="inline-block bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 text-center text-sm mr-2">
                            {index + 1}
                          </span>
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-1 bg-muted h-full min-h-[200px] relative">
                    <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Para conductores</h2>
        <div className="space-y-8">
          {driverSteps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="md:col-span-1 bg-muted h-full min-h-[200px] relative order-2 md:order-1">
                    <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
                  </div>
                  <div className="p-6 md:col-span-2 order-1 md:order-2">
                    <div className="flex items-start mb-4">
                      <div className="mr-4 mt-1">{step.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          <span className="inline-block bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 text-center text-sm mr-2">
                            {index + 1}
                          </span>
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
