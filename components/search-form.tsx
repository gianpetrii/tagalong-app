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

  const [origin, setOrigin] = useState(defaultOrigin)
  const [destination, setDestination] = useState(defaultDestination)
  const [date, setDate] = useState<Date | undefined>(defaultDate ? new Date(defaultDate) : undefined)
  const [openOriginPopover, setOpenOriginPopover] = useState(false)
  const [openDestinationPopover, setOpenDestinationPopover] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    const loadCities = async () => {
      const popularCities = await getPopularCities()
      setCities(popularCities)
    }

    loadCities()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formattedDate = date ? format(date, "yyyy-MM-dd") : ""

    router.push(
      `/buscar?origen=${encodeURIComponent(origin)}&destino=${encodeURIComponent(destination)}&fecha=${encodeURIComponent(formattedDate)}`,
    )
  }

  const filteredOriginCities = cities.filter((city) => city.toLowerCase().includes(origin.toLowerCase()))

  const filteredDestinationCities = cities.filter((city) => city.toLowerCase().includes(destination.toLowerCase()))

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Modificar búsqueda</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="origin" className="block text-sm font-medium mb-1">
            Origen
          </Label>
          <div className="relative">
            <Popover open={openOriginPopover} onOpenChange={setOpenOriginPopover}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    id="origin"
                    placeholder="¿Desde dónde salís?"
                    className="pl-10 pr-3 py-2"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
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
        </div>

        <div>
          <Label htmlFor="destination" className="block text-sm font-medium mb-1">
            Destino
          </Label>
          <div className="relative">
            <Popover open={openDestinationPopover} onOpenChange={setOpenDestinationPopover}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    id="destination"
                    placeholder="¿A dónde vas?"
                    className="pl-10 pr-3 py-2"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
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
        </div>

        <div>
          <Label htmlFor="date" className="block text-sm font-medium mb-1">
            Fecha
          </Label>
          <div className="relative">
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="date"
                    placeholder="Seleccionar fecha"
                    className="pl-10 pr-3 py-2"
                    value={date ? format(date, "PPP", { locale: es }) : ""}
                    readOnly
                    required
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
                  }}
                  initialFocus
                  locale={es}
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Buscar
        </Button>
      </form>
    </div>
  )
}
