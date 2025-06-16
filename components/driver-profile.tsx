import Image from "next/image"
import Link from "next/link"
import { Star, Shield, Check, ExternalLink, User } from "lucide-react"
import type { Driver } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DriverProfile({ driver }: { driver: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acerca del conductor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6">
          {driver.avatar ? (
          <Image
              src={driver.avatar}
            alt={driver.name}
            width={64}
            height={64}
              className="rounded-full mr-4 border border-primary"
          />
          ) : (
            <div className="w-16 h-16 rounded-full mr-4 border border-primary flex items-center justify-center bg-muted">
              <User className="h-6 w-6 text-primary" />
            </div>
          )}
          <div>
            <div className="font-medium text-lg">{driver.name}</div>
            <div className="flex items-center">
              <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-muted-foreground">
                {driver.rating || 'N/A'} · {driver.reviewCount || 0} opiniones
              </span>
            </div>
            <div className="text-muted-foreground text-sm">Miembro desde {driver.memberSince || 'N/A'}</div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-muted-foreground">Identidad verificada</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-muted-foreground">Correo electrónico verificado</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-muted-foreground">Teléfono verificado</span>
          </div>
        </div>

        {driver.bio && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Bio</h3>
            <p className="text-muted-foreground">{driver.bio}</p>
          </div>
        )}

        {driver.preferences && driver.preferences.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Preferencias de viaje</h3>
          <div className="flex flex-wrap gap-1">
              {driver.preferences.map((preference: string, index: number) => (
              <Badge key={index} variant="outline">
                {preference}
              </Badge>
            ))}
          </div>
        </div>
        )}

        <Button asChild variant="outline" className="w-full">
          <Link href={`/perfil/${driver.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver perfil completo
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
