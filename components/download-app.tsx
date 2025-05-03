import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DownloadApp() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 md:p-12 flex items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Llevá ViajeJuntos a todos lados</h2>
                  <p className="text-white/90 text-lg mb-6">
                    Descargá nuestra aplicación móvil para buscar y publicar viajes desde cualquier lugar. Disponible
                    para iOS y Android.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      <Image
                        src="/placeholder.svg?height=24&width=24"
                        alt="App Store"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      App Store
                    </Button>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      <Image
                        src="/placeholder.svg?height=24&width=24"
                        alt="Google Play"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      Google Play
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[300px] md:min-h-[400px]">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="App móvil ViajeJuntos"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
