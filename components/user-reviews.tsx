import Image from "next/image"
import { Star } from "lucide-react"
import { getUserReviews } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function UserReviews({ userId }: { userId: string }) {
  const reviews = await getUserReviews(userId)

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Opiniones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Este usuario aún no tiene opiniones.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Opiniones ({reviews.length})</CardTitle>
        <div className="flex items-center">
          <Star size={18} className="text-yellow-500 fill-yellow-500 mr-1" />
          <span className="font-bold mr-2">
            {reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length}
          </span>
          <span className="text-muted-foreground">({reviews.length} opiniones)</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.slice(0, 5).map((review) => (
            <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
              <div className="flex items-start">
                <Image
                  src={review.reviewer.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={review.reviewer.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-4"
                />

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{review.reviewer.name}</div>
                    <div className="text-muted-foreground text-sm">{review.date}</div>
                  </div>

                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"} mr-1`}
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground">{review.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 5 && (
          <div className="mt-6 text-center">
            <Button variant="outline">Ver todas las opiniones</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
