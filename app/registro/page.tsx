import RegisterForm from "@/components/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro | ViajeJuntos",
  description: "Crea una cuenta en ViajeJuntos y comienza a compartir viajes",
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear una cuenta</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
