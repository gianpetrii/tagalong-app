import { DollarSign, Leaf, Clock, Users } from "lucide-react"

export default function Benefits() {
  const benefits = [
    {
      icon: <DollarSign className="h-10 w-10 text-emerald-600" />,
      title: "Ahorrá dinero",
      description: "Compartí los gastos del viaje y ahorrá en comparación con otros medios de transporte.",
    },
    {
      icon: <Leaf className="h-10 w-10 text-emerald-600" />,
      title: "Cuidá el planeta",
      description: "Reducí la huella de carbono al compartir un vehículo en lugar de viajar por separado.",
    },
    {
      icon: <Clock className="h-10 w-10 text-emerald-600" />,
      title: "Viajá cómodo",
      description: "Disfrutá de un viaje puerta a puerta sin transbordos ni esperas innecesarias.",
    },
    {
      icon: <Users className="h-10 w-10 text-emerald-600" />,
      title: "Conocé gente",
      description: "Conectá con personas que comparten tus intereses y hacé nuevas amistades.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Por qué elegir ViajeJuntos?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compartir viajes tiene múltiples beneficios tanto para conductores como para pasajeros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
