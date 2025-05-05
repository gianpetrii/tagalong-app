import HowItWorksDetailed from "@/components/how-it-works-detailed"
import FAQ from "@/components/faq"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cómo funciona | TagAlong",
  description: "Aprende cómo funciona TagAlong, la plataforma de viajes compartidos en Argentina",
}

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Cómo funciona TagAlong</h1>
      <HowItWorksDetailed />
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Preguntas frecuentes</h2>
        <FAQ />
      </div>
    </div>
  )
}
