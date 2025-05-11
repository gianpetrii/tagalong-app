"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { getPopularCities } from "@/lib/data"
import LocationPicker from "@/components/location-picker"

interface SearchFormProps {
  defaultValues?: {
    origin?: string
    destination?: string
    date?: string
  }
}

export default function SearchForm({ defaultValues = {} }: SearchFormProps) {
  const router = useRouter()
  const { origin: defaultOrigin = "", destination: defaultDestination = "", date: defaultDate = "" } = defaultValues

  const [originLocation, setOriginLocation] = useState<{ address: string; city: string; coordinates: { lat: number; lng: number } } | null>(null)
  const [destinationLocation, setDestinationLocation] = useState<{ address: string; city: string; coordinates: { lat: number; lng: number } } | null>(null)
  const [date, setDate] = useState<Date | undefined>(defaultDate ? new Date(defaultDate) : undefined)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minSeats, setMinSeats] = useState("")
  const [departureFrom, setDepartureFrom] = useState("")
  const [departureTo, setDepartureTo] = useState("")
  const [minRating, setMinRating] = useState("")
  const [features, setFeatures] = useState({
    airConditioner: false,
    music: false,
    pets: false,
    smoking: false,
    luggage: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formattedDate = date ? format(date, "yyyy-MM-dd") : ""
    const params = new URLSearchParams()
    params.set("origin", originLocation?.address || "")
    params.set("destination", destinationLocation?.address || "")
    params.set("date", formattedDate)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (minSeats) params.set("minSeats", minSeats)
    if (departureFrom) params.set("departureFrom", departureFrom)
    if (departureTo) params.set("departureTo", departureTo)
    if (minRating) params.set("minRating", minRating)
    Object.entries(features).forEach(([key, value]) => {
      if (value) params.append("features", key)
    })
    router.push(`/buscar?${params.toString()}`)
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Modificar búsqueda</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LocationPicker
            label="Origen"
            value={originLocation?.address || ""}
            onChange={setOriginLocation}
            placeholder="Ingresa la dirección de origen"
          />

          <LocationPicker
            label="Destino"
            value={destinationLocation?.address || ""}
            onChange={setDestinationLocation}
            placeholder="Ingresa la dirección de destino"
          />
        </div>

        <div>
          <Label htmlFor="date">Fecha de viaje</Label>
          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="date"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date)
                  setOpenCalendar(false)
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minPrice">Precio mínimo</Label>
            <Input id="minPrice" type="number" min="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="$" />
          </div>
          <div>
            <Label htmlFor="maxPrice">Precio máximo</Label>
            <Input id="maxPrice" type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="$" />
          </div>
          <div>
            <Label htmlFor="minSeats">Asientos mínimos</Label>
            <Input id="minSeats" type="number" min="1" value={minSeats} onChange={e => setMinSeats(e.target.value)} placeholder="1" />
          </div>
          <div>
            <Label htmlFor="minRating">Calificación mínima</Label>
            <Input id="minRating" type="number" min="1" max="5" step="0.1" value={minRating} onChange={e => setMinRating(e.target.value)} placeholder="Ej: 4.5" />
          </div>
          <div>
            <Label htmlFor="departureFrom">Salida desde</Label>
            <Input id="departureFrom" type="time" value={departureFrom} onChange={e => setDepartureFrom(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="departureTo">Salida hasta</Label>
            <Input id="departureTo" type="time" value={departureTo} onChange={e => setDepartureTo(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Características del viaje</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={features.airConditioner} onChange={e => setFeatures(f => ({ ...f, airConditioner: e.target.checked }))} />
              <span>Aire acondicionado</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={features.music} onChange={e => setFeatures(f => ({ ...f, music: e.target.checked }))} />
              <span>Música</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={features.pets} onChange={e => setFeatures(f => ({ ...f, pets: e.target.checked }))} />
              <span>Mascotas</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={features.smoking} onChange={e => setFeatures(f => ({ ...f, smoking: e.target.checked }))} />
              <span>Fumar</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={features.luggage} onChange={e => setFeatures(f => ({ ...f, luggage: e.target.checked }))} />
              <span>Equipaje grande</span>
            </label>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Buscar viajes
        </Button>
      </form>
    </div>
  )
}
