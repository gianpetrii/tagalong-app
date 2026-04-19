"use client"

import { useState } from "react"
import { Share2, Copy, Facebook, Twitter, MessageCircle, Link, QrCode, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Trip } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TripShareProps {
  trip: Trip
  className?: string
}

export default function TripShare({ trip, className }: TripShareProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState<string | null>(null)

  // URLs para compartir
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const tripUrl = `${baseUrl}/viaje/${trip.id}`
  const trackingUrl = `${baseUrl}/viaje/${trip.id}/seguimiento`
  const publicUrl = `${baseUrl}/viaje/${trip.id}/publico`

  // Texto para compartir
  const shareText = `🚗 Viaje de ${trip.origin} a ${trip.destination} el ${format(new Date(trip.date), "d 'de' MMMM", { locale: es })} a las ${trip.departureTime}. ${trip.availableSeats} asientos disponibles por $${trip.price} c/u.`

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast({
        title: "¡Copiado!",
        description: "El enlace se ha copiado al portapapeles",
      })
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
        variant: "destructive"
      })
    }
  }

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${tripUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tripUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(tripUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(tripUrl)}&text=${encodeURIComponent(shareText)}`
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Viaje ${trip.origin} → ${trip.destination}`,
          text: shareText,
          url: tripUrl
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      copyToClipboard(tripUrl, "native")
    }
  }

  const openShareUrl = (url: string) => {
    window.open(url, "_blank", "width=550,height=420")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="w-4 h-4 mr-2" />
          Compartir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir viaje</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Redes Sociales</TabsTrigger>
            <TabsTrigger value="links">Enlaces</TabsTrigger>
            <TabsTrigger value="tracking">Seguimiento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="space-y-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Comparte tu viaje en redes sociales para encontrar más pasajeros
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => openShareUrl(shareUrls.whatsapp)}
                className="h-12 flex-col space-y-1"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-xs">WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => openShareUrl(shareUrls.facebook)}
                className="h-12 flex-col space-y-1"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => openShareUrl(shareUrls.twitter)}
                className="h-12 flex-col space-y-1"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span className="text-xs">Twitter</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => openShareUrl(shareUrls.telegram)}
                className="h-12 flex-col space-y-1"
              >
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span className="text-xs">Telegram</span>
              </Button>
            </div>

            <Separator />

            <Button
              onClick={handleNativeShare}
              className="w-full"
              variant="default"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir con más opciones
            </Button>
          </TabsContent>

          <TabsContent value="links" className="space-y-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Copia y pega estos enlaces donde necesites
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Enlace del viaje</label>
                <div className="flex space-x-2 mt-1">
                  <Input 
                    value={tripUrl} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(tripUrl, "trip")}
                  >
                    {copied === "trip" ? "¡Copiado!" : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Texto para compartir</label>
                <div className="flex space-x-2 mt-1">
                  <Input 
                    value={shareText} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(shareText, "text")}
                  >
                    {copied === "text" ? "¡Copiado!" : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4 mt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Enlaces para que familiares y amigos puedan seguir tu viaje
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Seguimiento en tiempo real</label>
                  <Badge variant="secondary" className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Solo durante el viaje
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Input 
                    value={trackingUrl} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(trackingUrl, "tracking")}
                  >
                    {copied === "tracking" ? "¡Copiado!" : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Este enlace permite seguir el progreso del viaje en tiempo real
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Vista pública</label>
                  <Badge variant="outline" className="text-xs">
                    <Link className="w-3 h-3 mr-1" />
                    Siempre disponible
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Input 
                    value={publicUrl} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(publicUrl, "public")}
                  >
                    {copied === "public" ? "¡Copiado!" : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Información básica del viaje sin datos sensibles
                </p>
              </div>
            </div>

            <Separator />

            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2">💡 Consejos para compartir</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Comparte el enlace de seguimiento con familiares para tranquilidad</li>
                <li>• Usa la vista pública para promocionar tu viaje</li>
                <li>• Los enlaces son seguros y no muestran información personal</li>
                <li>• El seguimiento en tiempo real solo funciona durante el viaje</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 