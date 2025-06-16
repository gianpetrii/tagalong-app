"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { FirebaseError } from "firebase/app"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { login, loginWithGoogle, isLoading: contextLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailLoading(true)

    try {
      await login(email, password, rememberMe)
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
      })
      router.push("/")
    } catch (error) {
      let errorMessage = "Correo electrónico o contraseña incorrectos.";
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = "Credenciales inválidas. Verifica tu correo y contraseña.";
            break;
          case 'auth/user-not-found':
            errorMessage = "No existe una cuenta con este correo electrónico.";
            break;
          case 'auth/wrong-password':
            errorMessage = "Contraseña incorrecta.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Demasiados intentos fallidos. Intenta más tarde o restablece tu contraseña.";
            break;
          case 'auth/user-disabled':
            errorMessage = "Esta cuenta ha sido deshabilitada.";
            break;
          case 'auth/invalid-email':
            errorMessage = "El formato del correo electrónico no es válido.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Error de conexión. Verifica tu conexión a internet.";
            break;
        }
      }
      
      console.error("Login error:", error);
      
      toast({
        title: "Error al iniciar sesión",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle(rememberMe)
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente con Google.",
      })
      router.push("/")
    } catch (error) {
      let errorMessage = "No se pudo iniciar sesión con Google. Intenta nuevamente.";
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = "Has cerrado la ventana de inicio de sesión de Google.";
            break;
          case 'auth/popup-blocked':
            errorMessage = "El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes e intenta de nuevo.";
            break;
          case 'auth/cancelled-popup-request':
            errorMessage = "Hay demasiadas solicitudes de ventanas emergentes. Intenta nuevamente.";
            break;
          case 'auth/account-exists-with-different-credential':
            errorMessage = "Ya existe una cuenta con este email pero con otro método de inicio de sesión.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Error de conexión. Verifica tu conexión a internet.";
            break;
        }
      }
      
      console.error("Google login error:", error);
      
      toast({
        title: "Error al iniciar sesión",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const isLoading = contextLoading || isEmailLoading || isGoogleLoading

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer">
                Recordarme
              </Label>
            </div>
            <Link href="/recuperar-contrasena" className="text-sm text-emerald-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isEmailLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              O continúa con
            </span>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isGoogleLoading ? "Iniciando sesión..." : "Continuar con Google"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link href="/registro" className="text-emerald-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
