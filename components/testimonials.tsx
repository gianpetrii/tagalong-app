import Image from "next/image"
import { Star, Quote, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Martín Gómez",
      avatar: null,
      role: "Pasajero",
      content:
        "Excelente experiencia. El conductor fue muy amable y puntual. Además, ahorré mucho dinero comparado con otras opciones de transporte.",
      rating: 5,
      location: "Buenos Aires",
    },
    {
      id: 2,
      name: "Laura Fernández",
      avatar: null,
      role: "Conductora",
      content:
        "Me encanta poder compartir mi viaje con otras personas. Además de dividir gastos, conocí gente interesante y hice el viaje más ameno.",
      rating: 5,
      location: "Córdoba",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      avatar: null,
      role: "Pasajero",
      content:
        "Viajo regularmente entre Buenos Aires y Rosario, y esta plataforma me ha facilitado mucho los traslados. Recomendado 100%.",
      rating: 4,
      location: "Rosario",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Miles de personas ya comparten sus viajes en Argentina. Conocé sus experiencias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardContent className="pt-6">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-muted opacity-20" />

                <div className="flex items-center mb-4">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4 border border-muted"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full mr-4 border border-muted flex items-center justify-center bg-muted">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"} mr-1`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
