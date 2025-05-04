import ResetPasswordForm from "@/components/reset-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recuperar contraseña | Tag Along",
  description: "Restablece la contraseña de tu cuenta de Tag Along",
}

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Recuperar contraseña</h1>
        <ResetPasswordForm />
      </div>
    </div>
  )
} 