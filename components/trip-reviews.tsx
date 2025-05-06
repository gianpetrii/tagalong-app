import Image from "next/image"
import { Star, User } from "lucide-react"
import { getTripReviews } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TripReviews({ tripId }: { tripId: string }) {
  const reviews = await getTripReviews(tripId)

  if (reviews.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opiniones sobre este viaje</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
              <div className="flex items-start">
                {review.reviewer.avatar ? (
                <Image
                    src={review.reviewer.avatar}
                  alt={review.reviewer.name}
                  width={40}
                  height={40}
                    className="rounded-full mr-4 border border-muted"
                />
                ) : (
                  <div className="w-10 h-10 rounded-full mr-4 border border-muted flex items-center justify-center bg-muted">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}

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
      </CardContent>
    </Card>
  )
}
