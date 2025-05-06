"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Plus, Minus, Calendar, Clock, Car, DollarSign, AlertCircle } from "lucide-react"
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { getPopularCities } from "@/lib/data"
import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TripPostingForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [stops, setStops] = useState([{ location: "", time: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState<Date>()
  const [departureTime, setDepartureTime] = useState("")
  const [openOriginPopover, setOpenOriginPopover] = useState(false)
  const [openDestinationPopover, setOpenDestinationPopover] = useState(false)
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

  useEffect(() => {
    const loadCities = async () => {
      const popularCities = await getPopularCities()
      setCities(popularCities)
    }

    loadCities()
  }, [])

  const addStop = () => {
    setStops([...stops, { location: "", time: "" }])
  }

  const removeStop = (index: number) => {
    const newStops = [...stops]
    newStops.splice(index, 1)
    setStops(newStops)
  }

  const updateStop = (index: number, field: "location" | "time", value: string) => {
    const newStops = [...stops]
    newStops[index][field] = value
    setStops(newStops)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!origin) newErrors.origin = "El origen es obligatorio"
    if (!destination) newErrors.destination = "El destino es obligatorio"
    if (!date) newErrors.date = "La fecha es obligatoria"
    if (!departureTime) newErrors.departureTime = "La hora de salida es obligatoria"

    // Validate stops
    stops.forEach((stop, index) => {
      if (stop.location && !stop.time) {
        newErrors[`stop_${index}_time`] = "La hora de la parada es obligatoria"
      }
      if (!stop.location && stop.time) {
        newErrors[`stop_${index}_location`] = "La ubicación de la parada es obligatoria"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Viaje publicado",
        description: "Tu viaje ha sido publicado correctamente.",
      })
      router.push("/viaje/nuevo-viaje-creado")
    }, 1500)
  }

  const filteredOriginCities = cities.filter((city) => city.toLowerCase().includes(origin.toLowerCase()))

  const filteredDestinationCities = cities.filter((city) => city.toLowerCase().includes(destination.toLowerCase()))

  return (
    <Card>
      <CardContent className="pt-6">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Al publicar un viaje, aceptas nuestros términos y condiciones. Asegúrate de proporcionar información
            precisa.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="origin" className={errors.origin ? "text-destructive" : ""}>
                Origen
              </Label>
              <div className="relative">
                <Popover open={openOriginPopover} onOpenChange={setOpenOriginPopover}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className={`h-5 w-5 ${errors.origin ? "text-destructive" : "text-muted-foreground"}`} />
                      </div>
                      <Input
                        type="text"
                        id="origin"
                        placeholder="Ciudad de origen"
                        className={`pl-10 pr-3 py-2 ${errors.origin ? "border-destructive" : ""}`}
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar ciudad..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                          {filteredOriginCities.map((city) => (
                            <CommandItem
                              key={city}
                              onSelect={() => {
                                setOrigin(city)
                                setOpenOriginPopover(false)
                                setErrors({ ...errors, origin: "" })
                              }}
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {errors.origin && <p className="text-destructive text-sm mt-1">{errors.origin}</p>}
            </div>

            <div>
              <Label htmlFor="destination" className={errors.destination ? "text-destructive" : ""}>
                Destino
              </Label>
              <div className="relative">
                <Popover open={openDestinationPopover} onOpenChange={setOpenDestinationPopover}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin
                          className={`h-5 w-5 ${errors.destination ? "text-destructive" : "text-muted-foreground"}`}
                        />
                      </div>
                      <Input
                        type="text"
                        id="destination"
                        placeholder="Ciudad de destino"
                        className={`pl-10 pr-3 py-2 ${errors.destination ? "border-destructive" : ""}`}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar ciudad..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                          {filteredDestinationCities.map((city) => (
                            <CommandItem
                              key={city}
                              onSelect={() => {
                                setDestination(city)
                                setOpenDestinationPopover(false)
                                setErrors({ ...errors, destination: "" })
                              }}
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {errors.destination && <p className="text-destructive text-sm mt-1">{errors.destination}</p>}
            </div>
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
                        className={`pl-10 pr-3 py-2 ${errors.date ? "border-destructive" : ""}`}
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

          <div>
            <Label className="block mb-1">Paradas (opcional)</Label>

            {stops.map((stop, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <div className="flex-grow">
                  <Input
                    type="text"
                    placeholder="Ciudad de parada"
                    value={stop.location}
                    onChange={(e) => updateStop(index, "location", e.target.value)}
                    className={errors[`stop_${index}_location`] ? "border-destructive" : ""}
                  />
                  {errors[`stop_${index}_location`] && (
                    <p className="text-destructive text-sm mt-1">{errors[`stop_${index}_location`]}</p>
                  )}
                </div>
                <div className="w-24">
                  <Input
                    type="time"
                    value={stop.time}
                    onChange={(e) => updateStop(index, "time", e.target.value)}
                    className={errors[`stop_${index}_time`] ? "border-destructive" : ""}
                  />
                  {errors[`stop_${index}_time`] && (
                    <p className="text-destructive text-sm mt-1">{errors[`stop_${index}_time`]}</p>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => removeStop(index)}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Minus size={16} />
                </Button>
              </div>
            ))}

            <Button type="button" onClick={addStop} variant="outline" size="sm" className="mt-2">
              <Plus size={16} className="mr-1" />
              Agregar parada
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="seats">Asientos disponibles</Label>
              <Select defaultValue="3">
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
              <Label htmlFor="price">Precio por asiento</Label>
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
                  className="pl-10 pr-3 py-2 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
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

          <div>
            <Label>Información del vehículo</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Car className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input type="text" placeholder="Marca y modelo" className="pl-10 pr-3 py-2 text-gray-900 dark:text-gray-100" required />
                </div>
              </div>
              <div>
                <Input type="text" placeholder="Color" className="px-3 py-2" required />
              </div>
              <div>
                <Input type="text" placeholder="Patente (opcional)" className="px-3 py-2" />
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
