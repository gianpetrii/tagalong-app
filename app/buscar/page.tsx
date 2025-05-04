'use client';

import { useSearchParams } from "next/navigation";
import { Suspense } from "react"
import SearchForm from "@/components/search-form"
import SearchResults from "@/components/search-results"
import SearchSkeleton from "@/components/search-skeleton"
import SearchFilters from "@/components/search-filters"

export default function SearchPage() {
  // Usamos useSearchParams() que es un hook del cliente para obtener los parámetros
  const searchParams = useSearchParams();
  
  const origin = searchParams.get('origen') || '';
  const destination = searchParams.get('destino') || '';
  const date = searchParams.get('fecha') || '';
  const sortBy = searchParams.get('ordenar') || '';
  const minPrice = searchParams.get('precio_min') || '';
  const maxPrice = searchParams.get('precio_max') || '';
  const minDepartureTime = searchParams.get('hora_salida_min') || '';
  const maxDepartureTime = searchParams.get('hora_salida_max') || '';
  const minRating = searchParams.get('calificacion_min') || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Resultados de búsqueda</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SearchForm
            defaultValues={{
              origin,
              destination,
              date,
            }}
          />
          <SearchFilters
            defaultValues={{
              sortBy,
              minPrice,
              maxPrice,
              minDepartureTime,
              maxDepartureTime,
              minRating,
            }}
          />
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults
              origin={origin}
              destination={destination}
              date={date}
              sortBy={sortBy}
              minPrice={minPrice ? Number.parseInt(minPrice) : undefined}
              maxPrice={maxPrice ? Number.parseInt(maxPrice) : undefined}
              minDepartureTime={minDepartureTime}
              maxDepartureTime={maxDepartureTime}
              minRating={minRating ? Number.parseFloat(minRating) : undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
