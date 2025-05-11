"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"

const containerStyle = {
  width: "100%",
  height: "400px",
}

const defaultCenter = {
  lat: -34.6037, // Buenos Aires coordinates
  lng: -58.3816,
}

interface LocationPickerProps {
  label: string
  value: string
  onChange: (location: { address: string; city: string; coordinates: { lat: number; lng: number } }) => void
  placeholder?: string
}

export default function LocationPicker({ label, value, onChange, placeholder }: LocationPickerProps) {
  const [searchValue, setSearchValue] = useState(value)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  const handlePlaceSelect = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        
        // Extract city from address components
        let city = ""
        if (place.address_components) {
          const cityComponent = place.address_components.find(
            (component) => component.types.includes("locality")
          )
          if (cityComponent) {
            city = cityComponent.long_name
          }
        }

        onChange({
          address: place.formatted_address || "",
          city,
          coordinates: { lat, lng },
        })
      }
    }
  }, [onChange])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "ar" },
      })
      autocompleteRef.current.addListener("place_changed", handlePlaceSelect)
    }
  }, [isLoaded, handlePlaceSelect])

  if (!isLoaded) {
    return <div>Cargando autocompletado...</div>
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
    </div>
  )
} 