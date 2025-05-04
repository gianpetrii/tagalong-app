import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AppleIcon, ShoppingBagIcon } from "lucide-react"

export default function DownloadApp() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 md:p-12 flex items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Llevá Tag Along a todos lados</h2>
                  <p className="text-white/90 text-lg mb-6">
                    Descargá nuestra aplicación móvil para buscar y publicar viajes desde cualquier lugar. Disponible
                    para iOS y Android.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      <AppleIcon className="h-5 w-5 mr-2" />
                      App Store
                    </Button>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      <ShoppingBagIcon className="h-5 w-5 mr-2" />
                      Google Play
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[300px] md:min-h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-muted-foreground text-lg">Vista previa de la app Tag Along</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
