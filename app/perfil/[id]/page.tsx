import { notFound } from "next/navigation"
import { getUserProfile, getPopularUsers } from "@/lib/data"
import UserProfileHeader from "@/components/user-profile-header"
import UserReviews from "@/components/user-reviews"
import UserTrips from "@/components/user-trips"
import UserStats from "@/components/user-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from "next"

type Props = {
  params: { id: string }
}

// Esta función es necesaria para generar rutas estáticas con parámetros dinámicos
export async function generateStaticParams() {
  // Obtener IDs de usuarios populares o predeterminados para pre-renderizar
  const popularUsers = await getPopularUsers()
  
  // IDs de Firebase reales que necesitamos incluir
  const firebaseUserIds = [
    '4eTph1IIrGPZuOZUYCqDynat3YQ2', // ID específico del error
    // Añade aquí otros IDs de Firebase si los conoces
  ]
  
  // Fallback a algunos IDs de ejemplo si no hay usuarios populares
  const defaultUserIds = ['user1', 'user2', 'user3', '101', '102', '103']
  
  // Combinar todos los IDs
  const userIds = [...firebaseUserIds, ...popularUsers, ...defaultUserIds]
  
  // Eliminar duplicados
  const uniqueUserIds = [...new Set(userIds)]
  
  return uniqueUserIds.map(id => ({
    id: id,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUserProfile(params.id)

  if (!user) {
    return {
      title: "Usuario no encontrado | Tag Along",
    }
  }

  return {
    title: `Perfil de ${user.name} | Tag Along`,
    description: `Ver el perfil de ${user.name} en Tag Along. Calificación: ${user.rating}/5 basado en ${user.reviewCount} opiniones.`,
  }
}

export default async function UserProfilePage({ params }: Props) {
  const user = await getUserProfile(params.id)

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfileHeader user={user} />

      <div className="mt-8">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Opiniones</TabsTrigger>
            <TabsTrigger value="trips">Viajes</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="mt-6">
            <UserReviews userId={params.id} />
          </TabsContent>
          <TabsContent value="trips" className="mt-6">
            <UserTrips userId={params.id} />
          </TabsContent>
          <TabsContent value="stats" className="mt-6">
            <UserStats userId={params.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
