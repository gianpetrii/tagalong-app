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
import { AlertCircle, UserCircle, Phone, Mail, Shield, Edit, LogOut, Car, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Switch } from '@headlessui/react'
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function MyProfilePage() {
  const { user, logout, isLoading, setUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingVehicle, setIsEditingVehicle] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
  })
  const [vehicle, setVehicle] = useState({
    brand: '',
    model: '',
    year: '',
    plate: '',
    isActive: true
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }

    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        about: user.about || "",
      })
      if (user.carInfo) {
        setVehicle({
          brand: user.carInfo.brand || '',
          model: user.carInfo.model || '',
          year: user.carInfo.year || '',
          plate: user.carInfo.plate || '',
          isActive: user.carInfo.isActive ?? true
        })
      }
    }
  }, [user, isLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVehicleChange = (field: string, value: string | boolean) => {
    setVehicle(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!user) return;
      
      const updatedUserData = {
        name: profileData.name,
        phone: profileData.phone,
        about: profileData.about,
      };
      
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, updatedUserData);
      
      const updatedUser = {
        ...user,
        ...updatedUserData
      };
      
      setUser(updatedUser);
      
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han guardado correctamente.",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error al actualizar",
        description: "No se pudieron guardar los cambios. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleSaveVehicle = async () => {
    try {
      if (!user) return;
      
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        carInfo: vehicle
      });
      
      const updatedUser = {
        ...user,
        carInfo: vehicle
      };
      
      setUser(updatedUser);
      
      toast({
        title: "Vehículo actualizado",
        description: "La información del vehículo se ha guardado correctamente.",
      })
      
      setIsEditingVehicle(false);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast({
        title: "Error al actualizar",
        description: "No se pudo guardar la información del vehículo. Intenta nuevamente.",
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
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu nombre completo"
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
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu número de teléfono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="about">Acerca de mí</Label>
                    <Textarea
                      id="about"
                      name="about"
                      value={profileData.about}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                      placeholder="Cuéntanos un poco sobre ti"
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
                    <h2 className="text-xl font-semibold">{user.name || 'No has ingresado tu nombre aún'}</h2>
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
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{user.phone || 'No has ingresado tu teléfono aún'}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Acerca de mí</h3>
                  <p className="text-sm">{user.about || 'No has ingresado información sobre ti aún'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mi vehículo</CardTitle>
                <CardDescription>
                  Gestiona la información del vehículo que utilizas para tus viajes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <Car className="h-6 w-6 mr-2 text-primary" />
                        <h3 className="font-medium">Vehículo principal</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={vehicle.isActive}
                          onChange={(checked) => handleVehicleChange('isActive', checked)}
                          className={`${
                            vehicle.isActive ? 'bg-blue-500' : 'bg-gray-300'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              vehicle.isActive ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {vehicle.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>

                    {isEditingVehicle ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="brand">Marca</Label>
                          <Input
                            id="brand"
                            value={vehicle.brand}
                            onChange={(e) => handleVehicleChange('brand', e.target.value)}
                            placeholder="Ej. Toyota"
                          />
                        </div>
                        <div>
                          <Label htmlFor="model">Modelo</Label>
                          <Input
                            id="model"
                            value={vehicle.model}
                            onChange={(e) => handleVehicleChange('model', e.target.value)}
                            placeholder="Ej. Corolla"
                          />
                        </div>
                        <div>
                          <Label htmlFor="year">Año (opcional)</Label>
                          <Input
                            id="year"
                            value={vehicle.year}
                            onChange={(e) => handleVehicleChange('year', e.target.value)}
                            placeholder="Ej. 2020"
                          />
                        </div>
                        <div>
                          <Label htmlFor="plate">Patente (opcional)</Label>
                          <Input
                            id="plate"
                            value={vehicle.plate}
                            onChange={(e) => handleVehicleChange('plate', e.target.value)}
                            placeholder="Ej. ABC123"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsEditingVehicle(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveVehicle}>
                            Guardar cambios
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{vehicle.brand} {vehicle.model}</p>
                            {vehicle.year && <p className="text-sm text-muted-foreground">Año: {vehicle.year}</p>}
                            {vehicle.plate && <p className="text-sm text-muted-foreground">Patente: {vehicle.plate}</p>}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditingVehicle(true)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
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
        </Tabs>
      </div>
    </div>
  )
} 