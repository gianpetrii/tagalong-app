import { Suspense } from "react"
import SearchForm from "@/components/search-form"
import SearchResults from "@/components/search-results"
import SearchSkeleton from "@/components/search-skeleton"
import SearchFilters from "@/components/search-filters"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const origin = searchParams.origen as string
  const destination = searchParams.destino as string
  const date = searchParams.fecha as string
  const sortBy = searchParams.ordenar as string
  const minPrice = searchParams.precio_min as string
  const maxPrice = searchParams.precio_max as string
  const minDepartureTime = searchParams.hora_salida_min as string
  const maxDepartureTime = searchParams.hora_salida_max as string
  const minRating = searchParams.calificacion_min as string

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
