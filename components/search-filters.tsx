"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Star } from "lucide-react"

interface SearchFiltersProps {
  defaultValues?: {
    sortBy?: string
    minPrice?: string
    maxPrice?: string
    minDepartureTime?: string
    maxDepartureTime?: string
    minRating?: string
  }
}

export default function SearchFilters({ defaultValues = {} }: SearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sortBy, setSortBy] = useState(defaultValues.sortBy || "recommended")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    defaultValues.minPrice ? Number.parseInt(defaultValues.minPrice) : 0,
    defaultValues.maxPrice ? Number.parseInt(defaultValues.maxPrice) : 10000,
  ])
  const [departureTimeRange, setDepartureTimeRange] = useState<[number, number]>([
    defaultValues.minDepartureTime ? Number.parseInt(defaultValues.minDepartureTime.split(":")[0]) : 0,
    defaultValues.maxDepartureTime ? Number.parseInt(defaultValues.maxDepartureTime.split(":")[0]) : 23,
  ])
  const [minRating, setMinRating] = useState(defaultValues.minRating ? Number.parseFloat(defaultValues.minRating) : 0)

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Sort
    params.set("ordenar", sortBy)

    // Price range
    params.set("precio_min", priceRange[0].toString())
    params.set("precio_max", priceRange[1].toString())

    // Departure time range
    params.set("hora_salida_min", `${departureTimeRange[0]}:00`)
    params.set("hora_salida_max", `${departureTimeRange[1]}:59`)

    // Rating
    params.set("calificacion_min", minRating.toString())

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Keep only search parameters
    const origen = params.get("origen")
    const destino = params.get("destino")
    const fecha = params.get("fecha")

    const newParams = new URLSearchParams()
    if (origen) newParams.set("origen", origen)
    if (destino) newParams.set("destino", destino)
    if (fecha) newParams.set("fecha", fecha)

    router.push(`${pathname}?${newParams.toString()}`)

    // Reset state
    setSortBy("recommended")
    setPriceRange([0, 10000])
    setDepartureTimeRange([0, 23])
    setMinRating(0)
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>

      <Accordion type="multiple" defaultValue={["sort", "price", "time", "rating"]}>
        <AccordionItem value="sort">
          <AccordionTrigger>Ordenar por</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recommended" id="recommended" />
                <Label htmlFor="recommended">Recomendados</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_asc" id="price_asc" />
                <Label htmlFor="price_asc">Precio: menor a mayor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_desc" id="price_desc" />
                <Label htmlFor="price_desc">Precio: mayor a menor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="departure" id="departure" />
                <Label htmlFor="departure">Hora de salida</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="rating" />
                <Label htmlFor="rating">Calificación</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Precio</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={10000}
                step={100}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="time">
          <AccordionTrigger>Hora de salida</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={departureTimeRange}
                min={0}
                max={23}
                step={1}
                onValueChange={(value) => setDepartureTimeRange(value as [number, number])}
              />
              <div className="flex justify-between">
                <span>{departureTimeRange[0]}:00</span>
                <span>{departureTimeRange[1]}:59</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Calificación mínima</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={minRating >= rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMinRating(rating)}
                    className="p-2"
                  >
                    <Star className={`h-4 w-4 ${minRating >= rating ? "fill-current" : ""}`} />
                  </Button>
                ))}
              </div>
              <div>{minRating > 0 ? `${minRating} estrellas o más` : "Cualquier calificación"}</div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 flex space-x-2">
        <Button onClick={applyFilters} className="flex-1">
          Aplicar filtros
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          Resetear
        </Button>
      </div>
    </div>
  )
}
