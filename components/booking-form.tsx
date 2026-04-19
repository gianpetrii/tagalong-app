"use client"

import type React from "react"

import { useState } from "react"
import { Check, AlertCircle, CreditCard, DollarSign } from "lucide-react"
import type { Trip } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { saveBooking } from "@/lib/data"
import { usePaymentManager } from "@/lib/payment-manager"

export default function BookingForm({ trip }: { trip: Trip }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const { createPaymentPreference, calculateCommissions } = usePaymentManager()
  const [seats, setSeats] = useState("1")
  const [message, setMessage] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mercadopago">("cash")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calcular el costo total y comisiones
  const totalAmount = trip.price * Number.parseInt(seats)
  const commissions = calculateCommissions(totalAmount)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!user) {
        throw new Error("Debes iniciar sesión para reservar");
      }

      // Preparar datos de la reserva
      const bookingData = {
        tripId: trip.id,
        userId: user.id,
        seats: parseInt(seats),
        message: message.trim() || "",
        paymentMethod,
        requiresAdvancePayment: paymentMethod === "mercadopago",
        advancePaymentPercentage: paymentMethod === "mercadopago" ? 100 : 0,
        remainingPaymentMethod: "cash" as const
      };

      // Guardar la reserva en Firestore
      const bookingId = await saveBooking(bookingData);

      // Si el pago es con MercadoPago, crear la preferencia
      if (paymentMethod === "mercadopago") {
        try {
          const preferenceId = await createPaymentPreference(
            bookingId,
            totalAmount,
            `Viaje de ${trip.origin} a ${trip.destination}`,
            user.email,
            user.name
          );

          // Redirigir a MercadoPago
          const initPoint = process.env.NODE_ENV === 'production' 
            ? `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`
            : `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
          
          window.location.href = initPoint;
          return;
        } catch (paymentError) {
          console.error("Error creando preferencia de pago:", paymentError);
          setError("Error al procesar el pago. La reserva se creó pero deberás pagar en efectivo.");
          // Continuar mostrando éxito aunque el pago haya fallado
        }
      }

      setIsSuccess(true)
      toast({
        title: "Solicitud enviada",
        description: paymentMethod === "cash" 
          ? "Tu solicitud ha sido enviada al conductor. Recibirás una notificación cuando acepte tu reserva."
          : "Tu reserva se ha creado. Procede al pago para confirmarla.",
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
              {paymentMethod === "cash" 
                ? "Tu solicitud ha sido enviada al conductor. Recibirás una notificación cuando acepte tu reserva."
                : "Tu reserva se ha creado. Serás redirigido al pago en un momento."}
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
          <div className="text-muted-foreground">
            {paymentMethod === "cash" ? "Pago en efectivo al conductor" : "Pago seguro con MercadoPago"}
          </div>
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
            <Label>Método de pago</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as "cash" | "mercadopago")}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Efectivo al conductor
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mercadopago" id="mercadopago" />
                <Label htmlFor="mercadopago" className="flex items-center cursor-pointer">
                  <CreditCard className="h-4 w-4 mr-2" />
                  MercadoPago (Tarjeta/Transferencia)
                </Label>
              </div>
            </RadioGroup>
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
              <span>${totalAmount}</span>
            </div>
            {paymentMethod === "mercadopago" && (
              <div className="mt-2 pt-2 border-t border-border text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Comisión TagAlong (10%)</span>
                  <span>-${commissions.commission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comisión MercadoPago</span>
                  <span>-${commissions.mercadoPagoFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-foreground">
                  <span>El conductor recibe</span>
                  <span>${commissions.finalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting || !user || trip.availableSeats < 1} className="w-full">
            {isSubmitting ? "Enviando..." : 
             paymentMethod === "mercadopago" ? "Reservar y Pagar" : "Solicitar reserva"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground text-center w-full">
          {paymentMethod === "cash" 
            ? "No se te cobrará nada por ahora. Pagarás directamente al conductor."
            : "Pago seguro procesado por MercadoPago. Recibirás confirmación inmediata."}
        </p>
      </CardFooter>
    </Card>
  )
}
