"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, User, LogOut, Car, Search, MapPin } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error al cerrar sesión",
        description: "Hubo un problema al cerrar la sesión. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <MapPin 
              className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mr-2"
            />
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Tag Along</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/buscar"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/buscar")
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <Search className="h-4 w-4 inline mr-1 text-emerald-600 dark:text-emerald-400" />
              Buscar viaje
            </Link>
            <Link
              href="/publicar"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/publicar")
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <Car className="h-4 w-4 inline mr-1 text-emerald-600 dark:text-emerald-400" />
              Publicar viaje
            </Link>
            <Link
              href="/como-funciona"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/como-funciona")
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              Cómo funciona
            </Link>

            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    aria-label="Abrir menú de perfil"
                    disabled={isLoggingOut}
                  >
                    <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400 transition-colors" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card text-card-foreground" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/mi-perfil">
                      <User className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Mi perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mis-viajes">
                      <Car className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Mis viajes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Iniciar sesión</Button>
                </Link>
                <Link href="/registro">
                  <Button>Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
            
            {user && (
              <Link href="/mi-perfil" className="ml-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="Mi perfil"
                  disabled={isLoggingOut}
                >
                  <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400 transition-colors" />
                </Button>
              </Link>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="ml-2 text-emerald-600 dark:text-emerald-400"
              disabled={isLoggingOut}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/buscar"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/buscar")
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="h-4 w-4 inline mr-2 text-emerald-600 dark:text-emerald-400" />
              Buscar viaje
            </Link>
            <Link
              href="/publicar"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/publicar")
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Car className="h-4 w-4 inline mr-2 text-emerald-600 dark:text-emerald-400" />
              Publicar viaje
            </Link>
            <Link
              href="/como-funciona"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/como-funciona")
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Cómo funciona
            </Link>

            {user ? (
              <>
                <Link
                  href="/mi-perfil"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 inline mr-2 text-emerald-600 dark:text-emerald-400" />
                  Mi perfil
                </Link>
                <Link
                  href="/mis-viajes"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Car className="h-4 w-4 inline mr-2 text-emerald-600 dark:text-emerald-400" />
                  Mis viajes
                </Link>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    isLoggingOut 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 inline mr-2 text-emerald-600 dark:text-emerald-400" />
                  {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
