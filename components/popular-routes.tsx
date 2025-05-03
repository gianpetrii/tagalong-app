import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PopularRoutes() {
  const routes = [
    {
      from: "Buenos Aires",
      to: "Mar del Plata",
      price: 4500,
      date: new Date().toISOString().split("T")[0],
    },
    {
      from: "Buenos Aires",
      to: "Rosario",
      price: 3800,
      date: new Date().toISOString().split("T")[0],
    },
    {
      from: "Córdoba",
      to: "Mendoza",
      price: 5200,
      date: new Date().toISOString().split("T")[0],
    },
    {
      from: "Rosario",
      to: "Córdoba",
      price: 4100,
      date: new Date().toISOString().split("T")[0],
    },
    {
      from: "Buenos Aires",
      to: "La Plata",
      price: 1800,
      date: new Date().toISOString().split("T")[0],
    },
    {
      from: "Mendoza",
      to: "San Juan",
      price: 3200,
      date: new Date().toISOString().split("T")[0],
    },
    {
      from: "Buenos Aires",
      to: "Córdoba",
      price: 6500,
      date: new Date().toISOString().split("T")[0],
    },
    {
      from: "Bariloche",
      to: "Neuquén",
      price: 4800,
      date: new Date().toISOString().split("T")[0],
    },
  ]

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Rutas populares</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={`/buscar?origen=${encodeURIComponent(route.from)}&destino=${encodeURIComponent(route.to)}&fecha=${encodeURIComponent(route.date)}`}
            >
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{route.from}</div>
                    <ArrowRight size={16} className="text-muted-foreground mx-1" />
                    <div className="font-medium">{route.to}</div>
                  </div>
                  <div className="text-emerald-600 font-bold">Desde ${route.price}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
