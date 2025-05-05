import Image from "next/image"
import { Star, Shield, Check, Calendar, User } from "lucide-react"
import type { User as UserType } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function UserProfileHeader({ user }: { user: UserType }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-4 md:mb-0 md:mr-6">
            <div className="relative">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="rounded-full border-2 border-primary"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-2 border-primary flex items-center justify-center bg-muted">
                  <User className="h-12 w-12 text-primary" />
                </div>
              )}
              {user.isOnline && (
                <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
              )}
            </div>
          </div>

          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{user.name}</h1>

                <div className="flex items-center justify-center md:justify-start mb-2">
                  <Star size={18} className="text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="text-muted-foreground">
                    {user.rating} · {user.reviewCount} opiniones
                  </span>
                </div>

                <div className="flex items-center justify-center md:justify-start mb-4">
                  <Calendar size={16} className="text-muted-foreground mr-1" />
                  <span className="text-muted-foreground">Miembro desde {user.memberSince}</span>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <Button>Enviar mensaje</Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {user.isVerified && (
                <Badge variant="outline" className="flex items-center">
                  <Shield size={14} className="text-emerald-600 mr-1" />
                  <span>Identidad verificada</span>
                </Badge>
              )}
              {user.emailVerified && (
                <Badge variant="outline" className="flex items-center">
                  <Check size={14} className="text-emerald-600 mr-1" />
                  <span>Email verificado</span>
                </Badge>
              )}
              {user.phoneVerified && (
                <Badge variant="outline" className="flex items-center">
                  <Check size={14} className="text-emerald-600 mr-1" />
                  <span>Teléfono verificado</span>
                </Badge>
              )}
              {user.badges &&
                user.badges.map((badge, index) => (
                  <Badge key={index} variant="outline">
                    {badge}
                  </Badge>
                ))}
            </div>

            {user.bio && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Acerca de mí</h2>
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
