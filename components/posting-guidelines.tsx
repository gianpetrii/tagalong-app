import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"

export default function PostingGuidelines() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="mr-2 h-5 w-5" />
          Consejos para publicar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium flex items-center mb-2">
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Recomendaciones
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Sé preciso con los horarios y puntos de encuentro</li>
            <li>• Establece un precio justo y competitivo</li>
            <li>• Describe claramente tu vehículo y las comodidades</li>
            <li>• Responde rápidamente a las solicitudes de reserva</li>
            <li>• Actualiza la disponibilidad si cambian tus planes</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium flex items-center mb-2">
            <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
            Evita
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Publicar viajes sin intención real de realizarlos</li>
            <li>• Establecer precios excesivamente altos</li>
            <li>• Proporcionar información falsa sobre tu vehículo</li>
            <li>• Cancelar viajes a último momento</li>
            <li>• Incluir información de contacto en la descripción</li>
          </ul>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Recuerda que mantener una buena reputación te ayudará a conseguir más pasajeros. Las calificaciones y
            reseñas son visibles para todos los usuarios.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
