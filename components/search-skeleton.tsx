import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function SearchSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-5 w-40" />
      </div>

      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <div className="md:col-span-3">
                <div className="flex items-center mb-3">
                  <Skeleton className="h-6 w-16" />
                  <div className="mx-2 text-muted-foreground">→</div>
                  <Skeleton className="h-6 w-16" />
                </div>

                <div className="flex items-center mb-3">
                  <Skeleton className="h-4 w-24 mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <div className="mb-3">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>

                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>

              <div className="md:col-span-1 flex md:flex-col md:items-end justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
