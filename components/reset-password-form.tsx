"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { FirebaseError } from "firebase/app"

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSuccess(true)
      toast({
        title: "Correo enviado",
        description: "Te hemos enviado un correo con instrucciones para restablecer tu contraseña.",
      })
    } catch (error) {
      let errorMessage = "No se pudo enviar el correo de restablecimiento. Verifica tu dirección de correo.";
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = "El formato del correo electrónico no es válido.";
            break;
          case 'auth/user-not-found':
            errorMessage = "No existe una cuenta con este correo electrónico.";
            break;
        }
      }
      
      toast({
        title: "Error al restablecer contraseña",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Correo enviado</CardTitle>
          <CardDescription>Revisa tu bandeja de entrada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p>
              Hemos enviado un correo con instrucciones para restablecer tu contraseña a <strong>{email}</strong>.
            </p>
            <p>
              Si no lo encuentras, revisa también tu carpeta de spam o correo no deseado.
            </p>
            <Button onClick={() => router.push("/login")} className="mt-4">
              Volver a inicio de sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </CardDescription>
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
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Recordaste tu contraseña?{" "}
          <Link href="/login" className="text-emerald-600 hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
} 