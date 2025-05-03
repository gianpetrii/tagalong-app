import { Shield, UserCheck, BadgeCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function TrustedCommunity() {
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-emerald-600" />,
      title: "Verificación de identidad",
      description: "Todos los usuarios deben verificar su identidad para garantizar la seguridad de la comunidad.",
    },
    {
      icon: <UserCheck className="h-10 w-10 text-emerald-600" />,
      title: "Sistema de calificaciones",
      description: "Las calificaciones y reseñas ayudan a mantener altos estándares de confianza entre usuarios.",
    },
    {
      icon: <BadgeCheck className="h-10 w-10 text-emerald-600" />,
      title: "Conductores verificados",
      description: "Verificamos la documentación de los conductores para garantizar viajes seguros y confiables.",
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Una comunidad de confianza</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La seguridad y confianza son nuestra prioridad. Por eso implementamos diversas medidas para proteger a
            nuestra comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
