import { Search, Calendar, Car } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-emerald-600" />,
      title: "Buscar",
      description: "Ingresá tu origen, destino y fecha para encontrar viajes disponibles.",
    },
    {
      icon: <Calendar className="h-12 w-12 text-emerald-600" />,
      title: "Reservar",
      description: "Elegí el viaje que más te convenga y solicitá una reserva al conductor.",
    },
    {
      icon: <Car className="h-12 w-12 text-emerald-600" />,
      title: "Viajar",
      description: "Encontrate con el conductor en el punto acordado y disfrutá del viaje.",
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Cómo funciona</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compartir viajes nunca fue tan fácil. Conectamos conductores con pasajeros en tres simples pasos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
