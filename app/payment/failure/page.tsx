"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Obtener parámetros de la URL
  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const externalReference = searchParams.get("external_reference")

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Pago no procesado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>El pago no pudo ser procesado</AlertTitle>
              <AlertDescription>
                Tu pago no se completó exitosamente. No se realizó ningún cargo a tu cuenta.
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-sm">Posibles causas</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fondos insuficientes</li>
                <li>• Datos de tarjeta incorrectos</li>
                <li>• Problemas de conexión</li>
                <li>• Límites de la tarjeta excedidos</li>
                <li>• Transacción cancelada por el usuario</li>
              </ul>
            </div>

            {externalReference && (
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-sm">Detalles</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reserva:</span>
                  <span className="font-mono">{externalReference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className="text-red-600 font-medium">
                    {status === "rejected" ? "Rechazado" : 
                     status === "cancelled" ? "Cancelado" : status}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">¿Qué puedes hacer?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Intentar el pago nuevamente</li>
                <li>• Verificar los datos de tu tarjeta</li>
                <li>• Usar otro método de pago</li>
                <li>• Contactar a tu banco si persiste</li>
                <li>• Pagar en efectivo al conductor</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={() => router.back()} 
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Intentar de nuevo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/mis-viajes")} 
                className="w-full"
              >
                Ver mis viajes
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.push("/")} 
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 