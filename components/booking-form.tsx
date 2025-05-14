"use client"

import type React from "react"

import { useState } from "react"
import { Check, AlertCircle } from "lucide-react"
import type { Trip } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { saveBooking } from "@/lib/data"

export default function BookingForm({ trip }: { trip: Trip }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [seats, setSeats] = useState("1")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!user) {
        throw new Error("Debes iniciar sesión para reservar");
      }

      // Preparar datos de la reserva - con message como string vacío si no hay contenido
      const bookingData = {
        tripId: trip.id,
        userId: user.id,
        seats: parseInt(seats),
        message: message.trim() || ""  // Usar string vacío en lugar de undefined
      };

      // Guardar la reserva en Firestore
      await saveBooking(bookingData);

      setIsSuccess(true)
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud ha sido enviada al conductor. Recibirás una notificación cuando acepte tu reserva.",
      })
    } catch (err) {
      console.error("Error al enviar la solicitud:", err);
      setError("Ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2">¡Solicitud enviada!</h2>
            <p className="text-muted-foreground mb-4">
              Tu solicitud ha sido enviada al conductor. Recibirás una notificación cuando acepte tu reserva.
            </p>
            <Button onClick={() => (window.location.href = "/mis-viajes")} className="w-full">
              Ver mis viajes
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservar asientos</CardTitle>
      </CardHeader>
      <CardContent>
        {!user && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Inicia sesión para reservar</AlertTitle>
            <AlertDescription>Necesitas iniciar sesión para poder reservar este viaje.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <div className="text-2xl font-bold text-emerald-600 mb-1">${trip.price} por persona</div>
          <div className="text-muted-foreground">Pago en efectivo al conductor</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="seats">Número de asientos</Label>
            <Select value={seats} onValueChange={setSeats} disabled={!user}>
              <SelectTrigger id="seats">
                <SelectValue placeholder="Selecciona el número de asientos" />
              </SelectTrigger>
              <SelectContent>
                {trip.availableSeats > 0 ? (
                  [...Array(trip.availableSeats)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1} {i === 0 ? "asiento" : "asientos"}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="0">No hay asientos disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Mensaje para el conductor (opcional)</Label>
            <Textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Preséntate y cuéntale al conductor sobre tu viaje..."
              disabled={!user}
            />
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Precio por asiento</span>
              <span className="font-medium">${trip.price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Asientos</span>
              <span className="font-medium">x {seats}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span>${trip.price * Number.parseInt(seats)}</span>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || !user || trip.availableSeats < 1} className="w-full">
            {isSubmitting ? "Enviando..." : "Solicitar reserva"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground text-center w-full">
          No se te cobrará nada por ahora. Pagarás directamente al conductor.
        </p>
      </CardFooter>
    </Card>
  )
}
