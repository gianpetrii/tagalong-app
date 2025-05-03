import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      question: "¿Cómo funciona ViajeJuntos?",
      answer:
        "ViajeJuntos conecta conductores que tienen asientos libres con pasajeros que viajan en la misma dirección. Los conductores publican sus viajes especificando ruta, fecha, hora y precio. Los pasajeros pueden buscar viajes disponibles y reservar asientos. El pago se realiza directamente al conductor al inicio del viaje.",
    },
    {
      question: "¿Cómo me registro en ViajeJuntos?",
      answer:
        "Para registrarte en ViajeJuntos, haz clic en 'Registrarse' en la parte superior derecha de la página. Completa el formulario con tus datos personales, verifica tu correo electrónico y número de teléfono, y ¡listo! Ya puedes comenzar a usar la plataforma.",
    },
    {
      question: "¿Cómo publico un viaje?",
      answer:
        "Para publicar un viaje, inicia sesión en tu cuenta y haz clic en 'Publicar viaje' en la barra de navegación. Completa el formulario con los detalles de tu viaje: origen, destino, fecha, hora, número de asientos disponibles y precio. También puedes agregar paradas intermedias y preferencias de viaje.",
    },
    {
      question: "¿Cómo reservo un asiento?",
      answer:
        "Para reservar un asiento, busca un viaje que se ajuste a tus necesidades utilizando el buscador. Revisa los detalles del viaje y del conductor, y si te interesa, haz clic en 'Solicitar reserva'. El conductor recibirá tu solicitud y podrá aceptarla o rechazarla. Una vez aceptada, recibirás los detalles de contacto para coordinar el encuentro.",
    },
    {
      question: "¿Cómo se realiza el pago?",
      answer:
        "El pago se realiza directamente al conductor al inicio del viaje, generalmente en efectivo. El precio por asiento se establece al momento de publicar el viaje y es visible para todos los pasajeros interesados. No cobramos comisiones por el uso de la plataforma.",
    },
    {
      question: "¿Qué sucede si necesito cancelar mi viaje?",
      answer:
        "Si eres conductor y necesitas cancelar un viaje, debes hacerlo con la mayor anticipación posible. Los pasajeros que hayan reservado asientos recibirán una notificación. Si eres pasajero y necesitas cancelar una reserva, puedes hacerlo hasta 24 horas antes del viaje sin penalización. Las cancelaciones frecuentes pueden afectar tu calificación en la plataforma.",
    },
    {
      question: "¿Cómo funciona el sistema de calificaciones?",
      answer:
        "Después de cada viaje, tanto conductores como pasajeros pueden calificarse mutuamente y dejar reseñas. Las calificaciones van de 1 a 5 estrellas y son visibles en los perfiles de los usuarios. Este sistema ayuda a mantener la confianza y seguridad en la comunidad.",
    },
    {
      question: "¿Es seguro viajar con desconocidos?",
      answer:
        "La seguridad es nuestra prioridad. Todos los usuarios deben verificar su identidad, correo electrónico y número de teléfono. Además, el sistema de calificaciones y reseñas ayuda a identificar usuarios confiables. Recomendamos revisar siempre el perfil y las calificaciones antes de viajar con alguien.",
    },
    {
      question: "¿Qué documentación necesito para ser conductor?",
      answer:
        "Para ser conductor en ViajeJuntos, necesitas tener una licencia de conducir válida, seguro del vehículo al día y verificar tu identidad en la plataforma. No es necesario tener un vehículo específico, pero debe estar en buenas condiciones y ser seguro para los pasajeros.",
    },
    {
      question: "¿ViajeJuntos está disponible en toda Argentina?",
      answer:
        "Sí, ViajeJuntos está disponible en todo el territorio argentino. Sin embargo, la disponibilidad de viajes puede variar según la región. Las rutas más populares suelen ser entre grandes ciudades como Buenos Aires, Córdoba, Rosario, Mendoza y Mar del Plata.",
    },
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
