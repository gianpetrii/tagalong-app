"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Calendar, Clock, Car, DollarSign, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Checkbox } from "@/components/ui/checkbox"
import { getPopularCities, saveTrip } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"
import LocationPicker from "@/components/location-picker"

export default function TripPostingForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [originLocation, setOriginLocation] = useState<{
    address: string
    city: string
    coordinates: { lat: number; lng: number }
  } | null>(null)
  const [destinationLocation, setDestinationLocation] = useState<{
    address: string
    city: string
    coordinates: { lat: number; lng: number }
  } | null>(null)
  const [date, setDate] = useState<Date>()
  const [departureTime, setDepartureTime] = useState("")
  const [availableSeats, setAvailableSeats] = useState("3")
  const [price, setPrice] = useState("")
  const [openCalendar, setOpenCalendar] = useState(false)
  const [cities, setCities] = useState<string[]>([])
  const [features, setFeatures] = useState({
    airConditioner: false,
    music: false,
    pets: false,
    smoking: false,
    luggage: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [carInfo, setCarInfo] = useState({
    brand: "",
    model: "",
    year: "",
    plate: ""
  })
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const loadCities = async () => {
      const popularCities = await getPopularCities()
      setCities(popularCities)
    }

    loadCities()
    
    // Auto-populate car information from user profile if available
    if (user?.carInfo) {
      setCarInfo({
        brand: user.carInfo.brand || "",
        model: user.carInfo.model || "",
        year: user.carInfo.year || "",
        plate: user.carInfo.plate || ""
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!originLocation?.city) newErrors.origin = "El origen es obligatorio"
    if (!destinationLocation?.city) newErrors.destination = "El destino es obligatorio"
    if (!date) newErrors.date = "La fecha es obligatoria"
    if (!departureTime) newErrors.departureTime = "La hora de salida es obligatoria"
    if (!price || parseFloat(price) <= 0) newErrors.price = "El precio debe ser mayor a 0"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para publicar un viaje.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate estimated arrival time (simple calculation for now)
      const [hours, minutes] = departureTime.split(':').map(Number)
      let arrivalHours = hours + 2 // assuming 2 hour default duration
      let arrivalMinutes = minutes
      
      if (arrivalHours >= 24) {
        arrivalHours -= 24
      }
      
      const arrivalTime = `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`
      
      // Prepare trip data
      const tripData = {
        origin: originLocation?.city || "",
        destination: destinationLocation?.city || "",
        date: date ? format(date, "yyyy-MM-dd") : "",
        departureTime,
        arrivalTime,
        duration: "2h 00m", // default duration
        price: parseFloat(price),
        availableSeats: parseInt(availableSeats),
        carBrand: carInfo.brand,
        carModel: carInfo.model,
        meetingPoint: originLocation?.address || "",
        dropOffPoint: destinationLocation?.address || "",
        coordinates: {
          origin: originLocation?.coordinates || { lat: 0, lng: 0 },
          destination: destinationLocation?.coordinates || { lat: 0, lng: 0 }
        },
        // Campos opcionales
        ...(carInfo.year && { carYear: parseInt(carInfo.year) }),
        ...(carInfo.plate && { carPlate: carInfo.plate }),
        stops: [], // Ya no hay paradas
        features: Object.entries(features)
          .filter(([_, isEnabled]) => isEnabled)
          .map(([feature]) => {
            switch (feature) {
              case 'airConditioner': return 'Aire acondicionado'
              case 'music': return 'Música'
              case 'pets': return 'Mascotas permitidas'
              case 'smoking': return 'Fumar permitido'
              case 'luggage': return 'Equipaje grande'
              default: return ''
            }
          })
          .filter(Boolean),
        notes: notes
      }

      // Save to Firestore
      const tripId = await saveTrip({
        ...tripData,
        driverId: user.id
      })
      
      setIsSubmitting(false)
      toast({
        title: "Viaje publicado",
        description: "Tu viaje ha sido publicado correctamente.",
      })
      router.push("/viaje/nuevo-viaje-creado")
    } catch (error) {
      console.error("Error al publicar el viaje:", error)
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: "Hubo un problema al publicar tu viaje. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Asegúrate de que toda la información sea correcta antes de publicar tu viaje.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <LocationPicker
              label="Origen"
              value={originLocation?.address || ""}
              onChange={setOriginLocation}
              placeholder="Ingresa la dirección de origen"
            />
            {errors.origin && <p className="text-destructive text-sm mt-1">{errors.origin}</p>}

            <LocationPicker
              label="Destino"
              value={destinationLocation?.address || ""}
              onChange={setDestinationLocation}
              placeholder="Ingresa la dirección de destino"
            />
            {errors.destination && <p className="text-destructive text-sm mt-1">{errors.destination}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="date" className={errors.date ? "text-destructive" : ""}>
                Fecha de salida
              </Label>
              <div className="relative">
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className={`h-5 w-5 ${errors.date ? "text-destructive" : "text-muted-foreground"}`} />
                      </div>
                      <Input
                        id="date"
                        placeholder="Seleccionar fecha"
                        className={`pl-10 pr-3 py-2 cursor-pointer ${errors.date ? "border-destructive" : ""}`}
                        value={date ? format(date, "PPP", { locale: es }) : ""}
                        readOnly
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date)
                        setOpenCalendar(false)
                        setErrors({ ...errors, date: "" })
                      }}
                      initialFocus
                      locale={es}
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {errors.date && <p className="text-destructive text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="departureTime" className={errors.departureTime ? "text-destructive" : ""}>
                Hora de salida
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className={`h-5 w-5 ${errors.departureTime ? "text-destructive" : "text-muted-foreground"}`} />
                </div>
                <Input
                  type="time"
                  id="departureTime"
                  className={`pl-10 pr-3 py-2 ${errors.departureTime ? "border-destructive" : ""}`}
                  value={departureTime}
                  onChange={(e) => {
                    setDepartureTime(e.target.value)
                    setErrors({ ...errors, departureTime: "" })
                  }}
                />
              </div>
              {errors.departureTime && <p className="text-destructive text-sm mt-1">{errors.departureTime}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="seats">Asientos disponibles</Label>
              <Select value={availableSeats} onValueChange={setAvailableSeats}>
                <SelectTrigger id="seats">
                  <SelectValue placeholder="Selecciona el número de asientos" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price" className={errors.price ? "text-destructive" : ""}>
                Precio por asiento
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="number"
                  id="price"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  className={`pl-10 pr-3 py-2 text-gray-900 dark:text-gray-100 ${errors.price ? "border-destructive" : ""}`}
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value)
                    setErrors({ ...errors, price: "" })
                  }}
                  required
                />
              </div>
              {errors.price && <p className="text-destructive text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="currency">Moneda</Label>
              <Select defaultValue="ARS">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Selecciona la moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                  <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información del vehículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carBrand">Marca</Label>
                <Input
                  id="carBrand"
                  placeholder="Marca del vehículo"
                  value={carInfo.brand}
                  onChange={(e) => setCarInfo({ ...carInfo, brand: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="carModel">Modelo</Label>
                <Input
                  id="carModel"
                  placeholder="Modelo del vehículo"
                  value={carInfo.model}
                  onChange={(e) => setCarInfo({ ...carInfo, model: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="carYear">Año (opcional)</Label>
                <Input
                  id="carYear"
                  placeholder="Año del vehículo"
                  value={carInfo.year}
                  onChange={(e) => {
                    // Solo permitir números
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    setCarInfo({ ...carInfo, year: value })
                  }}
                  maxLength={4}
                />
              </div>
              <div>
                <Label htmlFor="carPlate">Patente (opcional)</Label>
                <Input
                  id="carPlate"
                  placeholder="Patente del vehículo"
                  value={carInfo.plate}
                  onChange={(e) => {
                    // Convertir a mayúsculas
                    const value = e.target.value.toUpperCase()
                    setCarInfo({ ...carInfo, plate: value })
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Características del viaje</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="airConditioner"
                  checked={features.airConditioner}
                  onCheckedChange={(checked) => setFeatures({ ...features, airConditioner: checked as boolean })}
                />
                <Label htmlFor="airConditioner" className="cursor-pointer">
                  Aire acondicionado
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="music"
                  checked={features.music}
                  onCheckedChange={(checked) => setFeatures({ ...features, music: checked as boolean })}
                />
                <Label htmlFor="music" className="cursor-pointer">
                  Música permitida
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pets"
                  checked={features.pets}
                  onCheckedChange={(checked) => setFeatures({ ...features, pets: checked as boolean })}
                />
                <Label htmlFor="pets" className="cursor-pointer">
                  Mascotas permitidas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smoking"
                  checked={features.smoking}
                  onCheckedChange={(checked) => setFeatures({ ...features, smoking: checked as boolean })}
                />
                <Label htmlFor="smoking" className="cursor-pointer">
                  Fumar permitido
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="luggage"
                  checked={features.luggage}
                  onCheckedChange={(checked) => setFeatures({ ...features, luggage: checked as boolean })}
                />
                <Label htmlFor="luggage" className="cursor-pointer">
                  Equipaje grande
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Información adicional para los pasajeros..."
              className="px-3 py-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publicando..." : "Publicar viaje"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
