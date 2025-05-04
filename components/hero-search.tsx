"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { getPopularCities } from "@/lib/data"

export default function HeroSearch() {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState<Date>()
  const [openOriginPopover, setOpenOriginPopover] = useState(false)
  const [openDestinationPopover, setOpenDestinationPopover] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [cities, setCities] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadCities = async () => {
      const popularCities = await getPopularCities()
      setCities(popularCities)
    }

    loadCities()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formattedDate = date ? format(date, "yyyy-MM-dd") : ""

    router.push(
      `/buscar?origen=${encodeURIComponent(origin)}&destino=${encodeURIComponent(destination)}&fecha=${encodeURIComponent(formattedDate)}`,
    )
  }

  const filteredOriginCities = cities.filter((city) => city.toLowerCase().includes(origin.toLowerCase()))

  const filteredDestinationCities = cities.filter((city) => city.toLowerCase().includes(destination.toLowerCase()))

  return (
    <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Viajá por Argentina compartiendo el camino</h1>
          <p className="text-xl">
            Conectamos conductores con asientos libres y pasajeros que viajan en la misma dirección
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-background rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Origen
                </Label>
                <div className="relative">
                  <Popover open={openOriginPopover} onOpenChange={setOpenOriginPopover}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
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

              <div className="relative">
                <Label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Destino
                </Label>
                <div className="relative">
                  <Popover open={openDestinationPopover} onOpenChange={setOpenDestinationPopover}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
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

              <div className="relative">
                <Label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Fecha
                </Label>
                <div className="relative">
                  <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
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
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Buscando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    Buscar viaje
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
