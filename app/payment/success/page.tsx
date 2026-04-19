"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Obtener parámetros de la URL
  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const externalReference = searchParams.get("external_reference")
  const merchantOrderId = searchParams.get("merchant_order_id")

  useEffect(() => {
    // Simular carga de información del pago
    const timer = setTimeout(() => {
      setPaymentInfo({
        paymentId,
        status,
        externalReference,
        merchantOrderId
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [paymentId, status, externalReference, merchantOrderId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <h2 className="text-lg font-semibold mb-2">Verificando pago...</h2>
              <p className="text-muted-foreground">
                Por favor espera mientras confirmamos tu pago.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl text-emerald-600">
            ¡Pago exitoso!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Tu pago ha sido procesado correctamente y tu reserva está confirmada.
              </p>
              <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                Reserva confirmada
              </Badge>
            </div>

            {paymentInfo && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-sm">Detalles del pago</h3>
                {paymentInfo.paymentId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ID de pago:</span>
                    <span className="font-mono">{paymentInfo.paymentId}</span>
                  </div>
                )}
                {paymentInfo.externalReference && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reserva:</span>
                    <span className="font-mono">{paymentInfo.externalReference}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge variant="outline" className="text-xs">
                    {status === "approved" ? "Aprobado" : status}
                  </Badge>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">¿Qué sigue?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Recibirás un email de confirmación</li>
                <li>• El conductor será notificado de tu reserva</li>
                <li>• Podrás chatear con el conductor pronto</li>
                <li>• Verifica los detalles en "Mis viajes"</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={() => router.push("/mis-viajes")} 
                className="w-full"
              >
                Ver mis viajes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/")} 
                className="w-full"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 