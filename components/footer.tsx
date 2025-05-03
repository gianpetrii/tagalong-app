import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="ViajeJuntos Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-xl font-bold text-emerald-600">ViajeJuntos</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Conectamos conductores con pasajeros para compartir viajes en Argentina de manera económica, ecológica y
              social.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Descubrí</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/seguridad" className="text-muted-foreground hover:text-foreground transition-colors">
                  Seguridad
                </Link>
              </li>
              <li>
                <Link
                  href="/preguntas-frecuentes"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/ciudades" className="text-muted-foreground hover:text-foreground transition-colors">
                  Ciudades
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/prensa" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sala de prensa
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-muted-foreground" />
                <a
                  href="mailto:info@viajejuntos.com.ar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  info@viajejuntos.com.ar
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-muted-foreground" />
                <a href="tel:+5491123456789" className="text-muted-foreground hover:text-foreground transition-colors">
                  +54 9 11 2345-6789
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 text-muted-foreground mt-1" />
                <span className="text-muted-foreground">
                  Av. Corrientes 1234, Piso 5<br />
                  Ciudad Autónoma de Buenos Aires
                  <br />
                  Argentina
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ViajeJuntos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
