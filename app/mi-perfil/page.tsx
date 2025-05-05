"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, UserCircle, Phone, Mail, Shield, Edit, LogOut } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import type { Metadata } from "next"

export default function MyProfilePage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: ""
  })

  useEffect(() => {
    // Si no hay usuario autenticado, redirigir al login
    if (!isLoading && !user) {
      router.push("/login")
    }

    // Cargar datos del perfil cuando se carga el usuario
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || ""
      })
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Aquí iría la lógica para actualizar el perfil en Firebase
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han guardado correctamente.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: "No se pudieron guardar los cambios. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error al cerrar sesión",
        description: "No se pudo cerrar sesión. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="text-center">Cargando perfil...</div>
        </div>
      </div>
    )
  }

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mi perfil</h1>

        {!user.emailVerified && (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verifica tu correo electrónico</AlertTitle>
            <AlertDescription>
              Tu dirección de correo no ha sido verificada. Por favor, revisa tu bandeja de entrada.
              <Button variant="link" className="p-0 h-auto ml-2">
                Reenviar correo de verificación
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4 border-2 border-primary">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="text-3xl bg-muted">{userInitials}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="mb-2 w-full">
              Cambiar foto
            </Button>
          </div>

          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" value={profileData.email} disabled />
                    <p className="text-sm text-muted-foreground mt-1">
                      El correo electrónico no se puede modificar
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Acerca de mí</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar cambios</Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-muted-foreground">Miembro desde {user.memberSince}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar perfil
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{user.email}</span>
                    {user.emailVerified && (
                      <Shield className="h-4 w-4 ml-2 text-green-500" />
                    )}
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{user.phone}</span>
                      {user.phoneVerified && (
                        <Shield className="h-4 w-4 ml-2 text-green-500" />
                      )}
                    </div>
                  )}
                </div>

                {user.bio && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Acerca de mí</h3>
                    <p>{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          </TabsList>
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad de la cuenta</CardTitle>
                <CardDescription>
                  Administra tu contraseña y la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Contraseña</h3>
                      <p className="text-sm text-muted-foreground">************</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Cambiar contraseña
                    </Button>
                  </div>
                  <Separator className="my-4" />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Verificación en dos pasos</h3>
                      <p className="text-sm text-muted-foreground">No activada</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Activar
                    </Button>
                  </div>
                  <Separator className="my-4" />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Sesiones activas</h3>
                      <p className="text-sm text-muted-foreground">1 dispositivo actualmente</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Administrar
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
                <Button variant="destructive" className="opacity-70">
                  Eliminar cuenta
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de viaje</CardTitle>
                <CardDescription>
                  Configura tus preferencias para viajes compartidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Esta función estará disponible próximamente
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Esta función estará disponible próximamente
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 